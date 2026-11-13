(function (global) {
    const PAYMENT_SLIP_BUCKET = "payment-slips";
    const MAX_PAYMENT_SLIP_SIZE = 8 * 1024 * 1024;
    const ORDER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const PAYMENT_SLIP_TYPES = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/webp": "webp"
    };

    function validateOrderInput(orderId, items, bank, slipFile) {
        if (!ORDER_ID_PATTERN.test(String(orderId || ""))) {
            throw new Error("รหัสคำสั่งซื้อไม่ถูกต้อง");
        }
        if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
            throw new Error("ไม่พบรายการสินค้าในคำสั่งซื้อ");
        }
        if (!["kbank", "scb"].includes(bank)) {
            throw new Error("กรุณาเลือกธนาคารที่ถูกต้อง");
        }
        if (!slipFile || !PAYMENT_SLIP_TYPES[slipFile.type]) {
            throw new Error("กรุณาเลือกไฟล์รูปภาพ PNG, JPG หรือ WEBP");
        }
        if (!Number.isSafeInteger(slipFile.size) || slipFile.size <= 0
            || slipFile.size > MAX_PAYMENT_SLIP_SIZE) {
            throw new Error("ไฟล์สลิปต้องมีขนาดไม่เกิน 8 MB");
        }

        return items.map((item) => {
            if (!item || typeof item !== "object") {
                throw new Error("ข้อมูลสินค้าในคำสั่งซื้อไม่ถูกต้อง");
            }
            const productId = Number(item.id);
            const quantity = Number(item.qty || 1);
            const size = String(item.size || "onesize");
            if (!Number.isSafeInteger(productId) || productId < 1
                || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000
                || !size) {
                throw new Error("ข้อมูลสินค้าในคำสั่งซื้อไม่ถูกต้อง");
            }

            return {
                product_id: productId,
                size,
                quantity
            };
        });
    }

    function isDuplicateUpload(error) {
        return error && (error.error === "Duplicate"
            || error.statusCode === 409
            || error.statusCode === "409");
    }

    async function submitStoreOrder(supabaseClient, { orderId, items, bank, slipFile }) {
        if (!supabaseClient || typeof supabaseClient.auth?.getUser !== "function"
            || !supabaseClient.storage
            || typeof supabaseClient.rpc !== "function") {
            throw new Error("ระบบคำสั่งซื้อยังไม่พร้อมใช้งาน");
        }

        const orderItems = validateOrderInput(orderId, items, bank, slipFile);
        const { data: userData, error: userError } = await supabaseClient.auth.getUser();
        if (userError) throw new Error("ตรวจสอบบัญชีไม่ได้ กรุณาเข้าสู่ระบบใหม่");
        if (!userData?.user) throw new Error("กรุณาเข้าสู่ระบบก่อนสั่งซื้อ");
        if (!ORDER_ID_PATTERN.test(userData.user.id)) {
            throw new Error("ข้อมูลบัญชีไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
        }

        const extension = PAYMENT_SLIP_TYPES[slipFile.type];
        const slipPath = `${userData.user.id}/${orderId}.${extension}`;
        const paymentSlips = supabaseClient.storage.from(PAYMENT_SLIP_BUCKET);
        const { error: uploadError } = await paymentSlips
            .upload(slipPath, slipFile, {
                cacheControl: "0",
                contentType: slipFile.type,
                upsert: false
            });

        if (uploadError && !isDuplicateUpload(uploadError)) {
            console.error("Payment slip upload failed:", uploadError);
            throw new Error("อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่");
        }

        const { data, error } = await supabaseClient.rpc("submit_store_order", {
            p_order_id: orderId,
            p_items: orderItems,
            p_slip_path: slipPath,
            p_bank: bank
        });
        if (error) {
            console.error("Order submission failed:", error);
            try {
                const { error: cleanupError } = await paymentSlips.remove([slipPath]);
                if (cleanupError) console.error("Could not remove unsubmitted payment slip:", cleanupError);
            } catch (cleanupError) {
                console.error("Could not remove unsubmitted payment slip:", cleanupError);
            }
            throw new Error("บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาตรวจสอบสต๊อกและลองใหม่");
        }
        if (!data || data.id !== orderId
            || !["pending", "approved", "rejected"].includes(data.status)
            || !Number.isSafeInteger(data.total_amount) || data.total_amount < 1
            || !Number.isFinite(Date.parse(data.created_at))) {
            throw new Error("ได้รับข้อมูลคำสั่งซื้อไม่ถูกต้อง กรุณาตรวจสอบประวัติคำสั่งซื้อ");
        }

        return { data, slipPath };
    }

    global.submitStoreOrder = submitStoreOrder;
})(window);
