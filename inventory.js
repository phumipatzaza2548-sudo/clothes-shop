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
function getStockKeys(product) {
    const sizes = getProductSizes(product);
    return sizes.length > 0 ? sizes : ["onesize"];
}

// สต๊อกจริงอยู่ใน Supabase เท่านั้น ก่อนโหลดเสร็จจะถือว่าเป็น 0
let productStock = {};

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

// ใช้ร่วมกันทั้งหน้าร้านและหน้าแอดมิน: ดึงสต๊อกทั้งหมดและตรวจว่าครบทุกสินค้า/ไซส์
async function fetchProductStock(supabaseClient) {
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

    return nextStock;
}

async function syncProductStockFromSupabase(supabaseClient) {
    const nextStock = await fetchProductStock(supabaseClient);
    const hasChanged = products.some((product) => getStockKeys(product).some((size) => (
        productStock[product.id]?.[size] !== nextStock[product.id][size]
    )));
    productStock = nextStock;
    return hasChanged;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function getCartItemStock(item) {
    return getProductStock(item.id, item.size || "");
}
