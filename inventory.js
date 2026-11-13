/* ==================== ข้อมูลสินค้า ==================== */
const PRODUCT_IMAGE_DIR = "assets/images/products";

const products = [
    { id: 1, name: "เสื้อยืดสีขาว", price: 150, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p01.webp` },
    { id: 2, name: "เสื้อยืดสีดำ", price: 150, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p02.webp` },
    { id: 3, name: "เสื้อ Polo", price: 500, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p03.webp` },
    { id: 4, name: "เสื้อฮู้ดดี้", price: 700, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p04.webp` },
    { id: 5, name: "เสื้อเชิ้ตแขนยาว", price: 300, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p05.webp` },
    { id: 6, name: "เสื้อกล้ามผู้หญิง", price: 200, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p06.webp` },
    { id: 7, name: "เสื้อกล้ามผู้ชาย", price: 150, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p07.webp` },
    { id: 8, name: "กางเกงยีนส์ขาสั้น", price: 300, category: "pants", image: `${PRODUCT_IMAGE_DIR}/p08.webp` },
    { id: 9, name: "กางเกงยีนส์ Baggy", price: 350, category: "pants", image: `${PRODUCT_IMAGE_DIR}/p09.webp` },
    { id: 10, name: "กางเกงสแล็คชาย", price: 350, category: "pants", image: `${PRODUCT_IMAGE_DIR}/p10.webp` },
    { id: 11, name: "หมวกแก๊ปขาว", price: 250, category: "hat", image: `${PRODUCT_IMAGE_DIR}/p11.webp` },
    { id: 12, name: "หมวกแก๊ปเขียว", price: 250, category: "hat", image: `${PRODUCT_IMAGE_DIR}/p12.webp` },
    { id: 13, name: "หมวกแก๊ปน้ำเงิน", price: 250, category: "hat", image: `${PRODUCT_IMAGE_DIR}/p13.webp` },
    { id: 14, name: "หมวกแก๊ปครีม", price: 250, category: "hat", image: `${PRODUCT_IMAGE_DIR}/p14.webp` },
    { id: 15, name: "เสื้อยืดคอกลมสีขาว", price: 190, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p15.webp` },
    { id: 16, name: "เสื้อเชิ้ตแขนยาวสีขาว", price: 420, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p16.webp` },
    { id: 17, name: "เสื้อกล้ามสีขาว", price: 180, category: "shirt", image: `${PRODUCT_IMAGE_DIR}/p17.webp` },
    { id: 18, name: "กางเกงออกกำลังกาย", price: 290, category: "pants", image: `${PRODUCT_IMAGE_DIR}/p18.webp` },
    { id: 19, name: "กางเกงบอลลูน", price: 450, category: "pants", image: `${PRODUCT_IMAGE_DIR}/p19.webp` },
    { id: 20, name: "รองเท้าผ้าใบแฟชั่นสีขาว", price: 1290, category: "shoe", image: `${PRODUCT_IMAGE_DIR}/p20.webp` },
    { id: 21, name: "รองเท้าผ้าใบแฟชั่นสีชมพู", price: 1190, category: "shoe", image: `${PRODUCT_IMAGE_DIR}/p21.webp` },
    { id: 22, name: "รองเท้าผ้าใบแฟชั่นสีดำ-ขาว", price: 1490, category: "shoe", image: `${PRODUCT_IMAGE_DIR}/p22.webp` },
    { id: 23, name: "รองเท้าวิ่งสีเทา", price: 1590, category: "shoe", image: `${PRODUCT_IMAGE_DIR}/p23.webp` },
    { id: 24, name: "รองเท้าวิ่งสีขาว", price: 1690, category: "shoe", image: `${PRODUCT_IMAGE_DIR}/p24.webp` }
];

const PRODUCT_IMAGE_ALIASES = {
    "เสื้อยืสีขาว.jpg": `${PRODUCT_IMAGE_DIR}/p01.webp`,
    "ยืดดำ.jpg": `${PRODUCT_IMAGE_DIR}/p02.webp`,
    "polo.jpg": `${PRODUCT_IMAGE_DIR}/p03.webp`,
    "ฮุ้ดดี้.jpg": `${PRODUCT_IMAGE_DIR}/p04.webp`,
    "เชิ้ตแขนยาว 2.jpg": `${PRODUCT_IMAGE_DIR}/p05.webp`,
    "กล้ามหญิง.jpg": `${PRODUCT_IMAGE_DIR}/p06.webp`,
    "กล้ามชาย 1.jpg": `${PRODUCT_IMAGE_DIR}/p07.webp`,
    "ขาสั้น.jpg": `${PRODUCT_IMAGE_DIR}/p08.webp`,
    "Bagy.jpg": `${PRODUCT_IMAGE_DIR}/p09.webp`,
    "สแล็คชาย.jpg": `${PRODUCT_IMAGE_DIR}/p10.webp`,
    "แก็บขาว.jpg": `${PRODUCT_IMAGE_DIR}/p11.webp`,
    "เเก็ปเขียว.jpg": `${PRODUCT_IMAGE_DIR}/p12.webp`,
    "แก็บน้ำเงิน.jpg": `${PRODUCT_IMAGE_DIR}/p13.webp`,
    "เเก็บครีม.jpg": `${PRODUCT_IMAGE_DIR}/p14.webp`,
    "ยืดขาว 1.jpg": `${PRODUCT_IMAGE_DIR}/p15.webp`,
    "เสื้อเชิ๊ตแขนยาว.jpg": `${PRODUCT_IMAGE_DIR}/p16.webp`,
    "กล้ามชาย.jpg": `${PRODUCT_IMAGE_DIR}/p17.webp`,
    "กางเกงออกกำลังกาย.jpg": `${PRODUCT_IMAGE_DIR}/p18.webp`,
    "บอลลูน.jpg": `${PRODUCT_IMAGE_DIR}/p19.webp`,
    "shoe-fashion-white.jpg": `${PRODUCT_IMAGE_DIR}/p20.webp`,
    "shoe-fashion-pink.jpg": `${PRODUCT_IMAGE_DIR}/p21.webp`,
    "shoe-fashion-black-white.jpg": `${PRODUCT_IMAGE_DIR}/p22.webp`,
    "shoe-running-gray.jpg": `${PRODUCT_IMAGE_DIR}/p23.webp`,
    "shoe-running-white.jpg": `${PRODUCT_IMAGE_DIR}/p24.webp`
};

function resolveProductImage(image) {
    if (!image) return `${PRODUCT_IMAGE_DIR}/p01.webp`;
    if (image.startsWith("assets/")) return image;
    return PRODUCT_IMAGE_ALIASES[image] || image;
}

const CATEGORY_LABELS = {
    shirt: "เสื้อ",
    pants: "กางเกง",
    shoe: "รองเท้า",
    hat: "หมวก"
};

const PRODUCT_SIZES = {
    shirt: ["S", "M", "L", "XL"],
    pants: ["28", "30", "32", "34", "36"],
    shoe: ["38", "39", "40", "41", "42", "43", "44"]
};

function getProductSizes(product) {
    return PRODUCT_SIZES[product.category] || [];
}

/* ==================== สต็อกสินค้า ==================== */
const STOCK_STORAGE_KEY = "shop_stock_v1";

const DEFAULT_PRODUCT_STOCK = {
    1: { S: 6, M: 8, L: 8, XL: 0 },
    2: { S: 5, M: 7, L: 7, XL: 3 },
    3: { S: 4, M: 6, L: 6, XL: 2 },
    4: { S: 4, M: 5, L: 3, XL: 2 },
    5: { S: 2, M: 4, L: 4, XL: 2 },
    6: { S: 5, M: 5, L: 4, XL: 2 },
    7: { S: 6, M: 6, L: 5, XL: 3 },
    8: { 28: 4, 30: 5, 32: 5, 34: 4, 36: 2 },
    9: { 28: 5, 30: 6, 32: 7, 34: 5, 36: 3 },
    10: { 28: 3, 30: 4, 32: 4, 34: 2, 36: 0 },
    11: { onesize: 9 },
    12: { onesize: 6 },
    13: { onesize: 5 },
    14: { onesize: 2 },
    15: { S: 8, M: 10, L: 9, XL: 4 },
    16: { S: 3, M: 5, L: 4, XL: 2 },
    17: { S: 6, M: 7, L: 5, XL: 3 },
    18: { 28: 4, 30: 6, 32: 6, 34: 4, 36: 2 },
    19: { 28: 3, 30: 5, 32: 5, 34: 3, 36: 0 },
    20: { 38: 2, 39: 4, 40: 5, 41: 4, 42: 3, 43: 2, 44: 0 },
    21: { 38: 3, 39: 4, 40: 4, 41: 3, 42: 2, 43: 1, 44: 1 },
    22: { 38: 0, 39: 2, 40: 3, 41: 3, 42: 2, 43: 2, 44: 1 },
    23: { 38: 2, 39: 3, 40: 4, 41: 4, 42: 3, 43: 2, 44: 1 },
    24: { 38: 3, 39: 5, 40: 5, 41: 4, 42: 3, 43: 2, 44: 0 }
};

function createDefaultStock() {
    const stock = {};
    products.forEach((product) => {
        stock[product.id] = { ...(DEFAULT_PRODUCT_STOCK[product.id] || {}) };
    });
    return stock;
}

function getStockKeys(product) {
    const sizes = getProductSizes(product);
    return sizes.length > 0 ? sizes : ["onesize"];
}

function normalizeProductStock(rawStock) {
    const defaults = createDefaultStock();
    if (!rawStock || typeof rawStock !== "object") return defaults;

    const normalized = {};
    products.forEach((product) => {
        normalized[product.id] = {};
        getStockKeys(product).forEach((key) => {
            const fallback = Math.max(0, Number(defaults[product.id]?.[key]) || 0);
            const rawValue = rawStock[product.id]?.[key];
            const numericValue = Number(rawValue);
            const isValid = rawValue !== undefined
                && rawValue !== null
                && rawValue !== ""
                && Number.isFinite(numericValue);

            normalized[product.id][key] = isValid
                ? Math.max(0, Math.floor(numericValue))
                : fallback;
        });
    });

    return normalized;
}

function loadProductStock() {
    let storedStock = null;

    try {
        storedStock = JSON.parse(localStorage.getItem(STOCK_STORAGE_KEY) || "null");
    } catch {
        storedStock = null;
    }

    const stock = normalizeProductStock(storedStock);

    try {
        localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(stock));
    } catch {
        // ใช้งานต่อได้แม้เบราว์เซอร์ไม่ให้บันทึก localStorage
    }

    return stock;
}

let productStock = loadProductStock();

function saveProductStock() {
    try {
        localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(productStock));
    } catch {
        // ใช้งานต่อได้แม้เบราว์เซอร์ไม่ให้บันทึก localStorage
    }
}

function getProductStock(productId, size = "") {
    const product = products.find((item) => item.id === productId);
    if (!product) return 0;

    const key = getProductSizes(product).length > 0 ? String(size || "") : "onesize";
    if (!key) return 0;

    return Math.max(0, Number(productStock?.[productId]?.[key]) || 0);
}

function getProductTotalStock(product) {
    return getStockKeys(product).reduce(
        (sum, key) => sum + Math.max(0, Number(productStock?.[product.id]?.[key]) || 0),
        0
    );
}

async function syncProductStockFromSupabase(supabaseClient) {
    if (!supabaseClient || typeof supabaseClient.from !== "function") {
        throw new Error("ไม่สามารถเชื่อมต่อฐานข้อมูลสต๊อกได้");
    }

    const { data, error } = await supabaseClient
        .from("product_stock")
        .select("product_id, size, stock");

    if (error || !Array.isArray(data)) {
        throw new Error("โหลดสต๊อกจากฐานข้อมูลไม่สำเร็จ");
    }

    const nextStock = {};
    for (const row of data) {
        const product = products.find((item) => item.id === row.product_id);
        if (!product || !getStockKeys(product).includes(row.size)
            || !Number.isSafeInteger(row.stock) || row.stock < 0
            || nextStock[row.product_id]?.[row.size] !== undefined) {
            throw new Error("ข้อมูลสต๊อกในฐานข้อมูลไม่ถูกต้อง");
        }

        nextStock[row.product_id] = nextStock[row.product_id] || {};
        nextStock[row.product_id][row.size] = row.stock;
    }

    for (const product of products) {
        for (const size of getStockKeys(product)) {
            if (!Number.isSafeInteger(nextStock[product.id]?.[size])) {
                throw new Error("ข้อมูลสต๊อกในฐานข้อมูลไม่ครบ กรุณาตรวจสอบการตั้งค่าฐานข้อมูล");
            }
        }
    }

    const hasChanged = products.some((product) => getStockKeys(product).some((size) => (
        productStock[product.id]?.[size] !== nextStock[product.id][size]
    )));
    productStock = nextStock;
    saveProductStock();
    return hasChanged;
}

function getCartItemStock(item) {
    return getProductStock(item.id, item.size || "");
}

function decrementProductStock(item) {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return;

    const key = getProductSizes(product).length > 0 ? String(item.size || "") : "onesize";
    if (!key) return;

    const currentEntry = productStock[item.id] || {};
    currentEntry[key] = Math.max(0, (Number(currentEntry[key]) || 0) - (item.qty || 1));
    productStock[item.id] = currentEntry;
}

function restockProduct(productId, size, quantity) {
    const product = products.find((item) => item.id === Number(productId));
    if (!product) throw new Error("ไม่พบสินค้า");

    const stockKey = getStockKeys(product).find((key) => key === String(size));
    if (!stockKey) throw new Error("ไม่พบไซส์สินค้าที่เลือก");

    const amount = Number(quantity);
    if (!Number.isSafeInteger(amount) || amount <= 0) {
        throw new Error("จำนวนสินค้าที่เติมต้องเป็นจำนวนเต็มมากกว่า 0");
    }

    const previousStock = getProductStock(product.id, stockKey);
    const updatedStock = previousStock + amount;
    if (!Number.isSafeInteger(updatedStock)) {
        throw new Error("จำนวนสต๊อกเกินค่าที่รองรับ");
    }

    productStock[product.id][stockKey] = updatedStock;
    try {
        localStorage.setItem(STOCK_STORAGE_KEY, JSON.stringify(productStock));
    } catch {
        productStock[product.id][stockKey] = previousStock;
        throw new Error("ไม่สามารถบันทึกสต๊อกสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    }

    return updatedStock;
}
