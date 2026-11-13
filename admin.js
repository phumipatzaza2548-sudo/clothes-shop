const loginForm = document.getElementById("admin-login-form");
const loginPanel = document.getElementById("admin-login-panel");
const dashboard = document.getElementById("admin-dashboard");
const authMessage = document.getElementById("admin-auth-message");
const inventoryBody = document.getElementById("inventory-body");
const inventorySearch = document.getElementById("inventory-search");
const inventoryCategory = document.getElementById("inventory-category");
const adminMessage = document.getElementById("admin-message");
const adminOrdersList = document.getElementById("admin-orders-list");
const adminOrderMessage = document.getElementById("admin-order-message");
const adminTotalSales = document.getElementById("admin-total-sales");
const adminSalesOrderCount = document.getElementById("admin-sales-order-count");
const loginSubmit = document.getElementById("admin-login-submit");
const adminLogout = document.getElementById("admin-logout");

let supabaseClient = null;
let adminProductStock = {};

async function loadSalesSummary() {
    const pageSize = 1000;
    let totalSales = 0;
    let approvedOrderCount = 0;

    for (let offset = 0; ; offset += pageSize) {
        const { data: orders, error } = await supabaseClient
            .from("store_orders")
            .select("total_amount")
            .eq("status", "approved")
            .range(offset, offset + pageSize - 1);

        if (error || !Array.isArray(orders)) {
            throw new Error("โหลดสรุปยอดขายไม่สำเร็จ");
        }

        for (const order of orders) {
            if (!Number.isSafeInteger(order.total_amount) || order.total_amount < 1) {
                throw new Error("ข้อมูลยอดขายในฐานข้อมูลไม่ถูกต้อง");
            }
            totalSales += order.total_amount;
            if (!Number.isSafeInteger(totalSales)) {
                throw new Error("ยอดขายรวมเกินช่วงตัวเลขที่รองรับ");
            }
        }
        approvedOrderCount += orders.length;

        if (orders.length < pageSize) break;
    }

    adminTotalSales.textContent = `${totalSales.toLocaleString("th-TH")} บาท`;
    adminSalesOrderCount.textContent = `จาก ${approvedOrderCount.toLocaleString("th-TH")} คำสั่งซื้อที่อนุมัติแล้ว`;
}

function showAuthMessage(message, isError = false) {
    authMessage.textContent = message;
    authMessage.classList.add("is-visible");
    authMessage.classList.toggle("is-error", isError);
}

function showAdminMessage(message, isError = false) {
    adminMessage.textContent = message;
    adminMessage.classList.toggle("is-error", isError);
    adminMessage.classList.toggle("is-visible", Boolean(message));
}

function showAdminOrderMessage(message, isError = false) {
    adminOrderMessage.textContent = message;
    adminOrderMessage.classList.toggle("is-error", isError);
    adminOrderMessage.classList.toggle("is-visible", Boolean(message));
}

function escapeAdminHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
    })[character]);
}

function getAdminProductSizes(product) {
    return getStockKeys(product).map((size) => ({
        key: size,
        label: size === "onesize" ? "ฟรีไซส์" : size,
        stock: adminProductStock[product.id]?.[size]
    }));
}

function getAdminProductTotalStock(product) {
    return getAdminProductSizes(product).reduce((sum, size) => sum + size.stock, 0);
}

function renderInventory() {
    const query = inventorySearch.value.trim().toLocaleLowerCase("th-TH");
    const category = inventoryCategory.value;
    const visibleProducts = products.filter((product) => (
        product.name.toLocaleLowerCase("th-TH").includes(query)
        && (category === "all" || product.category === category)
    ));

    const totalUnits = products.reduce((sum, product) => sum + getAdminProductTotalStock(product), 0);
    const lowStockProducts = products.filter((product) => getAdminProductTotalStock(product) <= 5).length;
    const soldOutProducts = products.filter((product) => getAdminProductTotalStock(product) === 0).length;
    const outOfStockSizes = products.reduce((sum, product) => (
        sum + getAdminProductSizes(product).filter((size) => size.stock === 0).length
    ), 0);

    document.getElementById("admin-total-units").textContent = totalUnits.toLocaleString("th-TH");
    document.getElementById("admin-low-stock").textContent = lowStockProducts.toLocaleString("th-TH");
    document.getElementById("admin-out-of-stock").textContent = outOfStockSizes.toLocaleString("th-TH");
    document.getElementById("admin-sold-out-products").textContent = soldOutProducts.toLocaleString("th-TH");

    if (visibleProducts.length === 0) {
        inventoryBody.innerHTML = '<tr><td class="admin-empty" colspan="4">ไม่พบสินค้าที่ตรงกับการค้นหา</td></tr>';
        return;
    }

    inventoryBody.innerHTML = visibleProducts.map((product) => {
        const sizes = getAdminProductSizes(product);
        const sizeOptions = sizes.map((size) => (
            `<option value="${escapeAdminHTML(size.key)}">${escapeAdminHTML(size.label)}</option>`
        )).join("");
        const stockLabels = sizes.map((size) => (
            `<li class="${size.stock === 0 ? "is-empty" : size.stock <= 2 ? "is-low" : ""}">
                <span>${escapeAdminHTML(size.label)}</span>
                <strong>${Number(size.stock).toLocaleString("th-TH")}${size.stock === 0 ? " · หมด" : ""}</strong>
            </li>`
        )).join("");

        return `
            <tr>
                <td>
                    <div class="admin-product">
                        <img src="${escapeAdminHTML(product.image)}" alt="" loading="lazy">
                        <span>${escapeAdminHTML(product.name)}<small>รหัสสินค้า #${product.id}</small></span>
                    </div>
                </td>
                <td>${escapeAdminHTML(CATEGORY_LABELS[product.category] || product.category)}</td>
                <td><ul class="admin-stock-list">${stockLabels}</ul></td>
                <td>
                    <form class="admin-restock-form" data-product-id="${product.id}">
                        <label class="sr-only" for="restock-size-${product.id}">ไซส์สินค้า ${escapeAdminHTML(product.name)}</label>
                        <select id="restock-size-${product.id}" name="size">${sizeOptions}</select>
                        <label class="sr-only" for="restock-quantity-${product.id}">จำนวนที่เติม ${escapeAdminHTML(product.name)}</label>
                        <input id="restock-quantity-${product.id}" name="quantity" type="number" min="1" max="10000" step="1" value="1" required>
                        <button type="submit">เติม</button>
                    </form>
                </td>
            </tr>
        `;
    }).join("");
}

async function loadInventory() {
    const { data, error } = await supabaseClient
        .from("product_stock")
        .select("product_id, size, stock");

    if (error) throw new Error("โหลดสต๊อกไม่ได้ กรุณาตรวจสอบการตั้งค่าฐานข้อมูล");

    const nextStock = {};
    for (const row of data || []) {
        const product = products.find((item) => item.id === row.product_id);
        if (!product || !getStockKeys(product).includes(row.size)
            || !Number.isSafeInteger(row.stock) || row.stock < 0) {
            throw new Error("ข้อมูลสต๊อกในฐานข้อมูลไม่ถูกต้อง");
        }
        nextStock[row.product_id] = nextStock[row.product_id] || {};
        nextStock[row.product_id][row.size] = row.stock;
    }

    for (const product of products) {
        for (const size of getStockKeys(product)) {
            if (!Number.isSafeInteger(nextStock[product.id]?.[size])) {
                throw new Error("ข้อมูลสต๊อกในฐานข้อมูลไม่ครบ กรุณารันสคริปต์ตั้งค่าฐานข้อมูล");
            }
        }
    }

    adminProductStock = nextStock;
    renderInventory();
}

async function loadPendingOrders() {
    const { data: orders, error: orderError } = await supabaseClient
        .from("store_orders")
        .select("id, status, bank, total_amount, created_at, slip_path, slip_expires_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

    if (orderError || !Array.isArray(orders)) {
        throw new Error("โหลดคำสั่งซื้อไม่ได้ กรุณาตรวจสอบการตั้งค่าฐานข้อมูล");
    }
    if (orders.length === 0) {
        adminOrdersList.innerHTML = '<p class="admin-empty">ไม่มีคำสั่งซื้อที่รอตรวจสอบ</p>';
        return;
    }

    for (const order of orders) {
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(order.id)
            || order.status !== "pending"
            || !["kbank", "scb"].includes(order.bank)
            || !Number.isSafeInteger(order.total_amount) || order.total_amount < 1
            || !Number.isFinite(Date.parse(order.created_at))
            || !Number.isFinite(Date.parse(order.slip_expires_at))
            || (order.slip_path !== null && typeof order.slip_path !== "string")) {
            throw new Error("ข้อมูลคำสั่งซื้อในฐานข้อมูลไม่ถูกต้อง");
        }
    }

    const orderIds = orders.map((order) => order.id);
    const { data: orderItems, error: itemError } = await supabaseClient
        .from("store_order_items")
        .select("order_id, product_id, size, quantity, unit_price")
        .in("order_id", orderIds);

    if (itemError) throw new Error("โหลดรายการสินค้าในคำสั่งซื้อไม่ได้");

    const itemsByOrder = new Map();
    for (const item of orderItems || []) {
        const product = products.find((entry) => entry.id === item.product_id);
        if (!orderIds.includes(item.order_id)
            || !product || !getStockKeys(product).includes(item.size)
            || !Number.isSafeInteger(item.quantity) || item.quantity < 1
            || !Number.isSafeInteger(item.unit_price) || item.unit_price < 1) {
            throw new Error("ข้อมูลคำสั่งซื้อในฐานข้อมูลไม่ถูกต้อง");
        }
        const items = itemsByOrder.get(item.order_id) || [];
        items.push({ ...item, product });
        itemsByOrder.set(item.order_id, items);
    }

    const cards = await Promise.all(orders.map(async (order) => {
        const lines = itemsByOrder.get(order.id) || [];
        if (lines.length === 0) throw new Error("คำสั่งซื้อไม่มีรายการสินค้า");
        const calculatedTotal = lines.reduce(
            (total, item) => total + item.unit_price * item.quantity,
            0
        );
        if (calculatedTotal !== order.total_amount) {
            throw new Error("ยอดรวมคำสั่งซื้อไม่ตรงกับรายการสินค้า");
        }

        const isSlipExpired = Date.parse(order.slip_expires_at) <= Date.now();
        let slipMarkup = '<p class="admin-order-slip-expired">ไม่พบสลิปที่เปิดดูได้</p>';
        if (order.slip_path && !isSlipExpired) {
            const { data, error } = await supabaseClient.storage
                .from("payment-slips")
                .createSignedUrl(order.slip_path, 60);
            if (error || !data?.signedUrl) {
                throw new Error("เปิดดูสลิปไม่ได้ กรุณาตรวจสอบสิทธิ์ Storage");
            }
            slipMarkup = `
                <a class="admin-order-slip" href="${escapeAdminHTML(data.signedUrl)}" target="_blank" rel="noopener">
                    <img src="${escapeAdminHTML(data.signedUrl)}" alt="สลิปคำสั่งซื้อ ${escapeAdminHTML(order.id.slice(0, 8))}">
                    <span>เปิดสลิป</span>
                </a>
            `;
        }

        const itemMarkup = lines.map((item) => `
            <li>
                <span>${escapeAdminHTML(item.product.name)} · ${escapeAdminHTML(item.size)} × ${item.quantity}</span>
                <strong>${(item.unit_price * item.quantity).toLocaleString("th-TH")} บาท</strong>
            </li>
        `).join("");
        const dateLabel = new Date(order.created_at).toLocaleString("th-TH");
        const canApprove = Boolean(order.slip_path) && !isSlipExpired;
        const actions = `
            ${canApprove ? "" : '<p class="admin-order-slip-expired">สลิปหมดอายุหรือไม่มีไฟล์ กรุณาติดต่อผู้ซื้อ</p>'}
            <div class="admin-order-actions">
                ${canApprove
                    ? `<button type="button" data-order-action="approve" data-order-id="${escapeAdminHTML(order.id)}">อนุมัติและหักสต๊อก</button>`
                    : ""}
                <button type="button" data-order-action="reject" data-order-id="${escapeAdminHTML(order.id)}">ปฏิเสธคำสั่งซื้อ</button>
            </div>
        `;

        return `
            <article class="admin-order-card">
                <div class="admin-order-card-heading">
                    <div>
                        <strong>คำสั่งซื้อ ${escapeAdminHTML(order.id.slice(0, 8).toUpperCase())}</strong>
                        <time datetime="${escapeAdminHTML(order.created_at)}">${escapeAdminHTML(dateLabel)}</time>
                    </div>
                    <span>${order.bank === "kbank" ? "กสิกรไทย" : "ไทยพาณิชย์"}</span>
                </div>
                <ul class="admin-order-items">${itemMarkup}</ul>
                <div class="admin-order-total">
                    <span>ยอดที่ต้องตรวจสอบ</span>
                    <strong>${Number(order.total_amount).toLocaleString("th-TH")} บาท</strong>
                </div>
                <div class="admin-order-review">
                    ${slipMarkup}
                    ${actions}
                </div>
            </article>
        `;
    }));

    adminOrdersList.innerHTML = cards.join("");
}

async function showAdminDashboard() {
    if (!await isCurrentUserAdmin(supabaseClient)) return false;

    await loadInventory();
    loginPanel.hidden = true;
    dashboard.hidden = false;
    loginForm.reset();
    try {
        await Promise.all([loadPendingOrders(), loadSalesSummary()]);
    } catch (error) {
        showAdminOrderMessage(error.message || "โหลดข้อมูลแดชบอร์ดไม่สำเร็จ", true);
    }
    return true;
}

async function signInAsAdmin(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

    if (!await showAdminDashboard()) {
        throw new Error("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ");
    }
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    loginSubmit.disabled = true;
    showAuthMessage("กำลังตรวจสอบบัญชี...");

    try {
        await signInAsAdmin(loginForm.elements.email.value.trim(), loginForm.elements.password.value);
    } catch (error) {
        showAuthMessage(error.message || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่", true);
    } finally {
        loginSubmit.disabled = false;
    }
});

adminLogout.addEventListener("click", async () => {
    const { error } = await supabaseClient.auth.signOut({ scope: "local" });
    dashboard.hidden = true;
    loginPanel.hidden = false;
    adminProductStock = {};
    showAuthMessage(error
        ? "ออกจากระบบในอุปกรณ์นี้แล้ว แต่ยืนยันกับเซิร์ฟเวอร์ไม่สำเร็จ"
        : "ออกจากระบบแล้ว", Boolean(error));
});

inventoryBody.addEventListener("submit", async (event) => {
    const form = event.target.closest(".admin-restock-form");
    if (!form) return;

    event.preventDefault();
    const productId = Number(form.dataset.productId);
    const size = form.elements.size.value;
    const quantity = Number(form.elements.quantity.value);

    if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 10000) {
        showAdminMessage("จำนวนที่เติมต้องเป็นจำนวนเต็มตั้งแต่ 1 ถึง 10,000", true);
        return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    try {
        const { data, error } = await supabaseClient.rpc("restock_product", {
            p_product_id: productId,
            p_size: size,
            p_quantity: quantity
        });
        if (error || !Number.isSafeInteger(data)) {
            throw new Error("บันทึกสต๊อกไม่สำเร็จ กรุณาตรวจสอบสิทธิ์และลองใหม่");
        }

        adminProductStock[productId][size] = data;
        renderInventory();
        showAdminMessage(`เติมสินค้าเรียบร้อย คงเหลือ ${data.toLocaleString("th-TH")} ชิ้น`);
    } catch (error) {
        showAdminMessage(error.message || "บันทึกสต๊อกไม่สำเร็จ กรุณาลองใหม่", true);
    } finally {
        submitButton.disabled = false;
    }
});

adminOrdersList.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-order-action]");
    if (!button) return;

    const orderId = button.dataset.orderId;
    const action = button.dataset.orderAction === "approve"
        ? "approve_store_order"
        : "reject_store_order";
    button.disabled = true;
    showAdminOrderMessage("");

    try {
        const { data, error } = await supabaseClient.rpc(action, { p_order_id: orderId });
        const expectedStatus = action === "approve_store_order" ? "approved" : "rejected";
        if (error || data?.id !== orderId || data?.status !== expectedStatus) {
            throw new Error(action === "approve_store_order"
                ? "อนุมัติไม่ได้ สต๊อกอาจไม่พอหรือคำสั่งซื้อหมดอายุแล้ว"
                : "ปฏิเสธคำสั่งซื้อไม่สำเร็จ");
        }

        await Promise.all([loadInventory(), loadPendingOrders(), loadSalesSummary()]);
        showAdminOrderMessage(action === "approve_store_order"
            ? "อนุมัติคำสั่งซื้อและหักสต๊อกเรียบร้อย"
            : "ปฏิเสธคำสั่งซื้อเรียบร้อย");
    } catch (error) {
        showAdminOrderMessage(error.message || "อัปเดตคำสั่งซื้อไม่สำเร็จ", true);
    } finally {
        button.disabled = false;
    }
});

inventorySearch.addEventListener("input", renderInventory);
inventoryCategory.addEventListener("change", renderInventory);
window.addEventListener("focus", () => {
    if (dashboard.hidden) return;
    Promise.all([loadInventory(), loadPendingOrders(), loadSalesSummary()]).catch((error) => {
        showAdminOrderMessage(error.message || "รีเฟรชข้อมูลไม่สำเร็จ", true);
    });
});

async function restoreAdminSession() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
        throw new Error("ตรวจสอบสถานะการเข้าสู่ระบบไม่ได้ กรุณารีเฟรชหน้า");
    }
    if (!data.session?.user) return;

    const isAdmin = await showAdminDashboard();
    if (!isAdmin) showAuthMessage("บัญชีนี้ไม่มีสิทธิ์ผู้ดูแลระบบ", true);
}

try {
    supabaseClient = getSharedSupabaseClient();
    showAuthMessage("ใช้บัญชี Supabase ชุดเดียวกับหน้าร้านได้");
    restoreAdminSession().catch((error) => {
        showAuthMessage(error.message || "ตรวจสอบสิทธิ์แอดมินไม่ได้ กรุณาลองใหม่", true);
    });
} catch (error) {
    loginSubmit.disabled = true;
    showAuthMessage(error.message || "ยังไม่ได้ตั้งค่า Supabase — หลังบ้านถูกล็อกไว้", true);
}
