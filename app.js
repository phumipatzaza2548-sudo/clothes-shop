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

const KBANK_ACCOUNT = "0762790998";
const SCB_ACCOUNT = "0001206020";
const KBANK_ACCOUNT_DISPLAY = "076-2-79099-8";
const SCB_ACCOUNT_DISPLAY = "000-1-20602-0";
const SHIPPING_THRESHOLD = 500;
const MAX_SLIP_SIZE = 8 * 1024 * 1024;
const MAX_AVATAR_SIZE = 8 * 1024 * 1024;

let cart = [];
let currentCategory = "all";
let currentSearch = "";
const selectedProductSizes = {};
let toastTimer;
let selectedBank = "kbank";
let pendingAvatarData = null;

/* ==================== Helpers ==================== */
function formatPrice(value) {
    return Number(value || 0).toLocaleString("th-TH");
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

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7"></path></svg>
        <span>${escapeHTML(message)}</span>
    `;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function syncBodyScroll() {
    const hasOpenModal = Array.from(document.querySelectorAll(".modal"))
        .some((modal) => getComputedStyle(modal).display !== "none");

    document.body.classList.toggle("modal-open", hasOpenModal);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.style.display = "flex";
    const content = modal.querySelector(".modal-content");
    if (content) content.scrollTop = 0;
    syncBodyScroll();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.style.display = "none";
    syncBodyScroll();
}

function isModalOpen(id) {
    const modal = document.getElementById(id);
    return Boolean(modal) && getComputedStyle(modal).display !== "none";
}

/* ปิด modal ด้วยการคลิกฉากหลังหรือปุ่ม Esc */
document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal(modal.id);
    });
});

window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    document.querySelectorAll(".modal").forEach((modal) => {
        if (isModalOpen(modal.id)) closeModal(modal.id);
    });
});

function normalizePhone(input) {
    let digits = String(input || "").replace(/\D/g, "");
    if (digits.startsWith("0")) digits = digits.slice(1);
    return /^\d{9}$/.test(digits) ? `0${digits}` : "";
}

function phoneForDisplay(phone) {
    return String(phone || "").replace(/\D/g, "").replace(/^0/, "");
}

/* ==================== แสดงรายการสินค้า ==================== */
function getVisibleProducts() {
    const query = currentSearch.trim().toLowerCase();

    return products.filter((product) => {
        const categoryLabel = CATEGORY_LABELS[product.category] || "";
        const matchCategory = currentCategory === "all" || product.category === currentCategory;
        const matchSearch = !query
            || product.name.toLowerCase().includes(query)
            || categoryLabel.includes(query);

        return matchCategory && matchSearch;
    });
}

function getStockHintText(product, selectedSize = "") {
    const sizes = getProductSizes(product);
    const totalStock = getProductTotalStock(product);
    const selectedStock = selectedSize ? getProductStock(product.id, selectedSize) : 0;

    if (totalStock <= 0) return "สินค้าหมด · ไม่มีสินค้าคงเหลือ";
    if (sizes.length === 0) return `คงเหลือ ${formatPrice(totalStock)} ชิ้น`;
    if (selectedSize) return `ไซส์ ${escapeHTML(selectedSize)} · เหลือ ${formatPrice(selectedStock)} ชิ้น`;
    return `เลือกไซส์ · คงเหลือรวม ${formatPrice(totalStock)} ชิ้น`;
}

function isLowStockState(product, selectedSize = "") {
    const totalStock = getProductTotalStock(product);
    if (totalStock <= 0) return false;

    return getProductSizes(product).length > 0 && selectedSize
        ? getProductStock(product.id, selectedSize) <= 2
        : totalStock <= 3;
}

function getStockHintHTML(product, selectedSize = "") {
    const totalStock = getProductTotalStock(product);
    const isSoldOut = totalStock <= 0;
    const isLow = isLowStockState(product, selectedSize);
    const classes = ["stock-hint"];

    if (isSoldOut) classes.push("is-out");
    else if (isLow) classes.push("is-low");

    return `
        <span class="${classes.join(" ")}" id="stock-hint-${product.id}" data-total-stock="${totalStock}">
            <span class="stock-dot" aria-hidden="true"></span>${getStockHintText(product, selectedSize)}
        </span>
    `;
}

function updateProductStockHint(productId) {
    const product = products.find((item) => item.id === productId);
    const hint = document.getElementById(`stock-hint-${productId}`);
    if (!product || !hint) return;

    const selectedSize = selectedProductSizes[productId] || "";
    const isSoldOut = getProductTotalStock(product) <= 0;
    const isLow = isLowStockState(product, selectedSize);

    hint.classList.toggle("is-out", isSoldOut);
    hint.classList.toggle("is-low", !isSoldOut && isLow);
    hint.dataset.totalStock = String(getProductTotalStock(product));
    hint.innerHTML = `<span class="stock-dot" aria-hidden="true"></span>${getStockHintText(product, selectedSize)}`;
}

function displayProducts(itemsToDisplay) {
    const productList = document.getElementById("product-list");
    if (!productList) return;

    const items = Array.isArray(itemsToDisplay) ? itemsToDisplay : getVisibleProducts();
    const resultCount = document.getElementById("result-count");
    if (resultCount) resultCount.textContent = `${formatPrice(items.length)} รายการ`;

    productList.innerHTML = "";

    if (items.length === 0) {
        productList.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="11" cy="11" r="7"></circle>
                    <path d="m20 20-4-4"></path>
                </svg>
                <h3>ไม่พบสินค้าที่ค้นหา</h3>
                <p>ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดูอีกครั้ง</p>
                <button onclick="resetFilters()">ดูสินค้าทั้งหมด</button>
            </div>
        `;
        return;
    }

    items.forEach((product) => {
        const categoryLabel = CATEGORY_LABELS[product.category] || "สินค้า";
        const sizes = getProductSizes(product);
        const totalStock = getProductTotalStock(product);
        const isSoldOut = totalStock <= 0;

        // ถ้าไซส์ที่เคยเลือกไว้หมดสต็อกแล้ว ให้กลับไปเริ่มเลือกไซส์ใหม่
        if (selectedProductSizes[product.id] && getProductStock(product.id, selectedProductSizes[product.id]) <= 0) {
            delete selectedProductSizes[product.id];
        }

        const selectedSize = selectedProductSizes[product.id] || "";
        const sizePicker = sizes.length > 0
            ? `
                <div class="size-picker" id="size-picker-${product.id}">
                    <span class="size-picker-label" id="size-label-${product.id}">ไซส์</span>
                    <div class="size-options" id="size-options-${product.id}" role="group" aria-labelledby="size-label-${product.id}">
                        ${sizes.map((size) => {
                            const stock = getProductStock(product.id, size);
                            const isOut = stock <= 0;
                            const isActive = selectedSize === size && !isOut;

                            return `
                                <button
                                    type="button"
                                    class="size-chip${isActive ? " is-active" : ""}${isOut ? " is-sold-out" : ""}"
                                    data-size="${size}"
                                    aria-pressed="${isActive}"
                                    title="${isOut ? `ไซส์ ${size} หมดแล้ว` : `ไซส์ ${size} · เหลือ ${formatPrice(stock)} ชิ้น`}"
                                    ${isOut ? `disabled aria-label="ไซส์ ${size} หมดแล้ว"` : ""}
                                    onclick="selectProductSize(${product.id}, '${size}')"
                                >${size}</button>
                            `;
                        }).join("")}
                    </div>
                </div>
            `
            : "";

        const addButton = isSoldOut
            ? `
                <button type="button" class="add-btn is-sold-out" disabled aria-label="${escapeHTML(product.name)} สินค้าหมด">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m6 6 12 12M18 6 6 18"></path>
                    </svg>
                    <span class="btn-label">สินค้าหมด</span>
                </button>
            `
            : `
                <button type="button" class="add-btn" onclick="addToCart(${product.id})" aria-label="เพิ่ม ${escapeHTML(product.name)} ลงตะกร้า">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 5v14M5 12h14"></path>
                    </svg>
                    <span class="btn-label">เพิ่มลงตะกร้า</span>
                </button>
            `;

        const card = document.createElement("article");
        card.className = `product-card${isSoldOut ? " is-sold-out" : ""}`;
        card.dataset.productId = product.id;
        card.innerHTML = `
            <div class="product-media">
                <span class="product-badge">${categoryLabel}</span>
                ${isSoldOut ? `<span class="product-stock-badge">สินค้าหมด</span>` : ""}
                <img src="${product.image}" alt="${escapeHTML(product.name)}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-cat">${categoryLabel} · ${isSoldOut ? "สินค้าหมด" : "พร้อมส่ง"}</span>
                <h3>${escapeHTML(product.name)}</h3>
                ${sizePicker}
                ${getStockHintHTML(product, selectedSize)}
                <div class="product-footer">
                    <p class="price"><span class="currency">฿</span>${formatPrice(product.price)}</p>
                    ${addButton}
                </div>
            </div>
        `;
        productList.appendChild(card);
    });
}

/* ==================== ตัวกรองและค้นหา ==================== */
function filterCategory(categoryName, element) {
    currentCategory = categoryName;

    document.querySelectorAll(".category-btn").forEach((btn) => btn.classList.remove("active"));
    if (element) element.classList.add("active");

    displayProducts();
}

function selectCategory(categoryName) {
    currentSearch = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    const button = document.querySelector(`.category-btn[data-category="${categoryName}"]`);
    filterCategory(categoryName, button);

    const catalog = document.getElementById("products");
    if (catalog) catalog.scrollIntoView({ behavior: "smooth", block: "start" });
}

function searchProducts(query) {
    currentSearch = query;
    displayProducts();
}

function resetFilters() {
    currentCategory = "all";
    currentSearch = "";

    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    document.querySelectorAll(".category-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.category === "all");
    });

    displayProducts();
}

/* ==================== ตะกร้าสินค้า ==================== */
function getCartQty() {
    return cart.reduce((sum, item) => sum + (item.qty || 1), 0);
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
}

function selectProductSize(productId, size) {
    const product = products.find((item) => item.id === productId);
    if (!product || !getProductSizes(product).includes(size)) return;

    if (getProductStock(productId, size) <= 0) {
        showToast(`ไซส์ ${size} สินค้าหมดแล้ว`);
        return;
    }

    selectedProductSizes[productId] = size;

    const options = document.getElementById(`size-options-${productId}`);
    if (options) {
        options.querySelectorAll(".size-chip").forEach((chip) => {
            const isActive = chip.dataset.size === size;
            chip.classList.toggle("is-active", isActive);
            chip.setAttribute("aria-pressed", String(isActive));
        });
    }

    const picker = document.getElementById(`size-picker-${productId}`);
    if (picker) picker.classList.remove("is-missing");

    updateProductStockHint(productId);
}

function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    const sizes = getProductSizes(product);
    const size = selectedProductSizes[productId] || "";
    const totalStock = getProductTotalStock(product);

    if (totalStock <= 0) {
        showToast(`สินค้า “${product.name}” หมดแล้ว`);
        return;
    }

    if (sizes.length > 0 && !size) {
        const picker = document.getElementById(`size-picker-${productId}`);
        if (picker) {
            picker.classList.remove("is-missing");
            void picker.offsetWidth;
            picker.classList.add("is-missing");
            window.setTimeout(() => picker.classList.remove("is-missing"), 800);
        }
        showToast("กรุณาเลือกไซส์ก่อนเพิ่มลงตะกร้า");
        return;
    }

    const stock = getProductStock(productId, size);
    if (stock <= 0) {
        showToast(size ? `ไซส์ ${size} สินค้าหมดแล้ว` : `สินค้า “${product.name}” หมดแล้ว`);
        return;
    }

    const existingItem = cart.find((item) => (
        item.id === productId && (item.size || "") === size
    ));

    if (existingItem) {
        if ((existingItem.qty || 1) >= stock) {
            showToast(`สินค้าเหลือเพียง ${formatPrice(stock)} ชิ้น`);
            return;
        }
        existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            size,
            qty: 1
        });
    }

    updateCartUI();
    showToast(`เพิ่ม “${product.name}”${size ? ` ไซส์ ${size}` : ""} ลงตะกร้าแล้ว`);

    const countElement = document.getElementById("cart-count");
    if (countElement) {
        countElement.classList.remove("bump");
        void countElement.offsetWidth;
        countElement.classList.add("bump");
    }
}

function changeQty(index, delta) {
    const item = cart[index];
    if (!item) return;

    const currentQty = item.qty || 1;
    const stock = getCartItemStock(item);

    if (delta > 0) {
        if (stock <= 0) {
            showToast(`สินค้า “${item.name}” หมดแล้ว`);
            updateCartUI();
            return;
        }

        if (currentQty >= stock) {
            showToast(`สินค้าเหลือเพียง ${formatPrice(stock)} ชิ้น`);
            return;
        }

        item.qty = Math.min(stock, currentQty + delta);

        if (item.qty === stock) {
            showToast(`เพิ่มครบจำนวนคงเหลือ ${formatPrice(stock)} ชิ้นแล้ว`);
        }
    } else {
        item.qty = currentQty + delta;
        if (item.qty <= 0) {
            cart.splice(index, 1);
        }
    }

    updateCartUI();
}

function removeFromCart(index) {
    if (!cart[index]) return;
    cart.splice(index, 1);
    updateCartUI();
}

function clearCart() {
    if (cart.length === 0) return;
    cart = [];
    updateCartUI();
    showToast("ล้างตะกร้าเรียบร้อยแล้ว");
}

function continueShopping() {
    closeModal("cart-modal");
    const catalog = document.getElementById("products");
    if (catalog) catalog.scrollIntoView({ behavior: "smooth", block: "start" });
}

function updateCartUI() {
    const totalQty = getCartQty();
    const total = getCartTotal();

    const countElement = document.getElementById("cart-count");
    if (countElement) countElement.innerText = totalQty;

    const badge = document.getElementById("cart-items-badge");
    if (badge) badge.innerText = `${totalQty} ชิ้น`;

    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const shippingProgress = document.getElementById("shipping-progress");
    const shippingText = document.getElementById("shipping-text");
    const shippingBar = document.getElementById("shipping-bar");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const totalRow = document.getElementById("cart-total-row");
    const checkoutBtn = document.getElementById("checkout-btn");

    if (!cartItemsContainer || !totalPriceElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="9" cy="20" r="1.5"></circle>
                    <circle cx="18" cy="20" r="1.5"></circle>
                    <path d="M2 3h2.5l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h9.2a1.5 1.5 0 0 0 1.5-1.2L21 7H6"></path>
                </svg>
                <p>ยังไม่มีสินค้าในตะกร้า</p>
                <small>เลือกสินค้าที่ถูกใจแล้วเพิ่มลงตะกร้าได้เลย</small>
                <button type="button" class="empty-cart-btn" onclick="continueShopping()">เลือกซื้อสินค้า</button>
            </div>
        `;
        totalPriceElement.innerText = "0";
        if (shippingProgress) shippingProgress.style.display = "none";
        if (clearCartBtn) clearCartBtn.style.display = "none";
        if (totalRow) totalRow.style.display = "none";
        if (checkoutBtn) checkoutBtn.style.display = "none";
        return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const qty = item.qty || 1;
        const lineTotal = item.price * qty;
        const stock = getCartItemStock(item);
        const isMaxedOut = qty >= stock;

        return `
            <div class="cart-item-row">
                <img src="${resolveProductImage(item.image)}" alt="${escapeHTML(item.name)}" class="cart-thumb">
                <div class="cart-item-info">
                    <div class="cart-item-top">
                        <span class="cart-item-name">${escapeHTML(item.name)}</span>
                        <button class="remove-btn" onclick="removeFromCart(${index})" aria-label="ลบ ${escapeHTML(item.name)}${item.size ? ` ไซส์ ${escapeHTML(item.size)}` : ""} ออกจากตะกร้า">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"></path></svg>
                        </button>
                    </div>
                    ${item.size ? `<span class="cart-item-variant">ไซส์ ${escapeHTML(item.size)}</span>` : ""}
                    <span class="cart-item-price">${formatPrice(item.price)} บาท / ชิ้น</span>
                    <span class="cart-item-stock${stock <= 2 ? " is-low" : ""}">คงเหลือ ${formatPrice(stock)} ชิ้น</span>
                    <div class="cart-item-controls">
                        <div class="qty-control">
                            <button type="button" class="qty-btn" onclick="changeQty(${index}, -1)" aria-label="ลดจำนวน">−</button>
                            <span class="qty-value">${qty}</span>
                            <button type="button" class="qty-btn" onclick="changeQty(${index}, 1)" aria-label="เพิ่มจำนวน" ${isMaxedOut ? `disabled title="ครบจำนวนคงเหลือแล้ว"` : ""}>+</button>
                        </div>
                        <strong class="cart-line-total">${formatPrice(lineTotal)} บาท</strong>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    totalPriceElement.innerText = formatPrice(total);
    if (clearCartBtn) clearCartBtn.style.display = "inline-flex";
    if (totalRow) totalRow.style.display = "flex";
    if (checkoutBtn) checkoutBtn.style.display = "flex";

    if (shippingProgress && shippingText && shippingBar) {
        const remaining = Math.max(0, SHIPPING_THRESHOLD - total);
        const progress = Math.min(100, (total / SHIPPING_THRESHOLD) * 100);

        shippingProgress.style.display = "block";
        shippingProgress.classList.toggle("is-complete", remaining === 0);
        shippingBar.style.width = `${progress}%`;
        shippingText.innerHTML = remaining > 0
            ? `ช้อปอีก <strong>฿${formatPrice(remaining)}</strong> เพื่อรับสิทธิ์ส่งฟรี`
            : "<strong>คุณได้รับสิทธิ์ส่งฟรีแล้ว</strong>";
    }
}

function toggleCart() {
    closeProfileDropdown();

    if (isModalOpen("cart-modal")) {
        closeModal("cart-modal");
    } else {
        openModal("cart-modal");
    }
}

/* ==================== ชำระเงิน ==================== */
function setCheckoutStep(stepCount) {
    document.querySelectorAll(".checkout-step").forEach((step, index) => {
        step.classList.toggle("is-active", index < stepCount);
        step.classList.toggle("is-current", index === stepCount - 1);
    });
}

function checkout() {
    if (cart.length === 0) {
        showToast("กรุณาเลือกสินค้าก่อนสั่งซื้อ");
        return;
    }

    const total = getCartTotal();

    const kbankQrImg = document.getElementById("qr-kbank-img");
    const scbQrImg = document.getElementById("qr-scb-img");

    if (kbankQrImg) kbankQrImg.src = `https://promptpay.io/${KBANK_ACCOUNT}/${total}.png`;
    if (scbQrImg) scbQrImg.src = `https://promptpay.io/${SCB_ACCOUNT}/${total}.png`;

    const payAmount = document.getElementById("pay-amount");
    if (payAmount) payAmount.innerText = formatPrice(total);

    switchBankQR("kbank");
    resetSlipInput();
    setCheckoutStep(1);
    closeModal("cart-modal");
    openModal("payment-modal");
}

function previewSlip(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
        showToast("กรุณาเลือกไฟล์รูปภาพ PNG, JPG หรือ WEBP");
        event.target.value = "";
        return;
    }

    if (file.size > MAX_SLIP_SIZE) {
        showToast("ไฟล์สลิปมีขนาดใหญ่เกิน 8 MB");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const preview = document.getElementById("slip-preview");
        const container = document.getElementById("slip-preview-container");
        const fileName = document.getElementById("slip-file-name");
        const labelTitle = document.getElementById("slip-label-title");
        const uploadLabel = document.getElementById("upload-label-text");
        const hint = uploadLabel ? uploadLabel.querySelector(".upload-copy small") : null;
        const confirmButton = document.getElementById("confirm-payment-btn");

        if (preview) preview.src = e.target.result;
        if (container) container.style.display = "flex";
        if (fileName) {
            fileName.textContent = file.name.length > 28
                ? `${file.name.substring(0, 24)}...`
                : file.name;
        }
        if (labelTitle) labelTitle.textContent = "เปลี่ยนรูปสลิป";
        if (hint) hint.textContent = "แนบหลักฐานเรียบร้อยแล้ว";
        if (uploadLabel) uploadLabel.classList.add("has-file");
        if (confirmButton) confirmButton.disabled = false;

        setCheckoutStep(3);
    };

    reader.onerror = () => showToast("ไม่สามารถอ่านไฟล์สลิปได้ กรุณาลองใหม่");
    reader.readAsDataURL(file);
}

function clearSlip(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const slipInput = document.getElementById("slip-input");
    const slipPreview = document.getElementById("slip-preview");
    const slipContainer = document.getElementById("slip-preview-container");
    const labelTitle = document.getElementById("slip-label-title");
    const uploadLabel = document.getElementById("upload-label-text");
    const hint = uploadLabel ? uploadLabel.querySelector(".upload-copy small") : null;
    const confirmButton = document.getElementById("confirm-payment-btn");

    if (slipInput) slipInput.value = "";
    if (slipPreview) slipPreview.src = "";
    if (slipContainer) slipContainer.style.display = "none";
    if (labelTitle) labelTitle.textContent = "แตะเพื่อแนบสลิป";
    if (hint) hint.textContent = "PNG, JPG หรือ WEBP ขนาดไม่เกิน 8 MB";
    if (uploadLabel) uploadLabel.classList.remove("has-file");
    if (confirmButton) confirmButton.disabled = true;

    setCheckoutStep(1);
}

function resetSlipInput() {
    clearSlip();
}

function closePayment() {
    closeModal("payment-modal");
}

function showReceipt(order, slipSource) {
    const orderId = document.getElementById("receipt-order-id");
    const orderDate = document.getElementById("receipt-order-date");
    const itemsList = document.getElementById("receipt-items-list");
    const total = document.getElementById("receipt-total-price");
    const slipContainer = document.getElementById("receipt-slip-container");
    const slipImage = document.getElementById("receipt-slip-img");

    if (orderId) orderId.textContent = order.id;
    if (orderDate) orderDate.textContent = order.date;

    if (itemsList) {
        itemsList.innerHTML = order.items.map((item) => {
            const qty = item.qty || 1;
            const size = item.size ? ` · ไซส์ ${escapeHTML(item.size)}` : "";
            return `
                <div class="receipt-item">
                    <span>${escapeHTML(item.name)}${size} <small>× ${qty}</small></span>
                    <span>${formatPrice(item.price * qty)} บาท</span>
                </div>
            `;
        }).join("");
    }

    if (total) total.textContent = `${formatPrice(order.totalPrice)} บาท`;

    if (slipContainer && slipImage) {
        if (slipSource) {
            slipImage.src = slipSource;
            slipContainer.style.display = "block";
        } else {
            slipContainer.style.display = "none";
        }
    }

    openModal("receipt-modal");
}

function confirmPayment() {
    try {
        const slipInput = document.getElementById("slip-input");
        const slipFile = slipInput && slipInput.files ? slipInput.files[0] : null;

        if (!slipFile) {
            showToast("กรุณาแนบสลิปการโอนเงินก่อนยืนยัน");
            return;
        }

        if (!cart || cart.length === 0) {
            showToast("ไม่พบรายการสินค้าในตะกร้า");
            return;
        }

        const unavailableItem = cart.find((item) => (item.qty || 1) > getCartItemStock(item));
        if (unavailableItem) {
            const availableStock = getCartItemStock(unavailableItem);
            showToast(availableStock > 0
                ? `สินค้า “${unavailableItem.name}” เหลือเพียง ${formatPrice(availableStock)} ชิ้น`
                : `สินค้า “${unavailableItem.name}” หมดแล้ว`);
            updateCartUI();
            return;
        }

        const total = getCartTotal();
        const slipPreview = document.getElementById("slip-preview");
        const slipSource = slipPreview ? slipPreview.src : "";

        const orderData = {
            id: "ORD-" + Date.now().toString().slice(-6),
            date: new Date().toLocaleString("th-TH"),
            items: cart.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty || 1,
                size: item.size || "",
                image: resolveProductImage(item.image)
            })),
            totalPrice: total,
            bank: selectedBank,
            status: "รอดำเนินการ"
        };

        const orders = loadOrders();
        orders.unshift(orderData);
        saveOrders(orders);

        // ตัดสต็อกหลังชำระเงินสำเร็จ และอัปเดตการ์ดสินค้าให้เห็นจำนวนคงเหลือล่าสุด
        cart.forEach((item) => decrementProductStock(item));
        saveProductStock();

        cart = [];
        updateCartUI();
        displayProducts();
        closePayment();
        showReceipt(orderData, slipSource);
    } catch (error) {
        console.error("Error in confirmPayment:", error);
        showToast("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
}

function closeReceipt() {
    closeModal("receipt-modal");
}

function viewOrdersFromReceipt() {
    closeReceipt();
    openOrderHistoryModal();
}

function switchBankQR(bank) {
    const kbankBox = document.getElementById("qr-box-kbank");
    const scbBox = document.getElementById("qr-box-scb");
    const kbankBtn = document.getElementById("btn-kbank");
    const scbBtn = document.getElementById("btn-scb");

    selectedBank = bank;

    if (bank === "kbank") {
        if (kbankBox) kbankBox.style.display = "block";
        if (scbBox) scbBox.style.display = "none";
        if (kbankBtn) kbankBtn.classList.add("active");
        if (scbBtn) scbBtn.classList.remove("active");
    } else if (bank === "scb") {
        if (kbankBox) kbankBox.style.display = "none";
        if (scbBox) scbBox.style.display = "block";
        if (scbBtn) scbBtn.classList.add("active");
        if (kbankBtn) kbankBtn.classList.remove("active");
    }
}

function copyAccount() {
    const account = selectedBank === "scb" ? SCB_ACCOUNT_DISPLAY : KBANK_ACCOUNT_DISPLAY;

    const fallbackCopy = () => {
        const textarea = document.createElement("textarea");
        textarea.value = account;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand("copy");
            showToast("คัดลอกเลขบัญชีแล้ว");
        } catch {
            showToast("ไม่สามารถคัดลอกได้ กรุณาจดเลขบัญชีด้วยตนเอง");
        }

        textarea.remove();
    };

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(account)
            .then(() => showToast("คัดลอกเลขบัญชีแล้ว"))
            .catch(fallbackCopy);
    } else {
        fallbackCopy();
    }
}

/* ==================== Profile Dropdown ==================== */
function closeProfileDropdown() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) dropdown.classList.remove("show");
}

function toggleProfileMenu() {
    const dropdown = document.getElementById("profile-dropdown");
    if (dropdown) dropdown.classList.toggle("show");
}

function logout() {
    clearCurrentUsername();
    showToast("ออกจากระบบเรียบร้อยแล้ว");
    window.setTimeout(() => {
        window.location.href = "index.html";
    }, 550);
}

function initUserDisplay() {
    const user = getCurrentShopUser();
    const username = user ? user.username : getCurrentUsername();
    const displayName = (user && user.fullname)
        || username
        || "ผู้ใช้งาน";
    const secondaryText = (user && user.email)
        || (username ? `@${username}` : "ยินดีต้อนรับกลับมา");
    const avatar = (user && user.avatar) || "assets/images/avatars/user.jpg";

    const display = document.getElementById("user-display");
    const subDisplay = document.getElementById("profile-sub");
    const avatarImg = document.getElementById("avatar-img");
    const logoutButton = document.getElementById("header-logout-btn");

    if (display) display.innerText = displayName;
    if (subDisplay) subDisplay.innerText = secondaryText;
    if (avatarImg) avatarImg.src = avatar;
    if (logoutButton) logoutButton.hidden = !(user || username);
}

/* ==================== ข้อมูลส่วนตัว ==================== */
function previewProfileAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
        showToast("กรุณาเลือกไฟล์รูปภาพ PNG, JPG หรือ WEBP");
        event.target.value = "";
        return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
        showToast("ไฟล์รูปภาพมีขนาดใหญ่เกิน 8 MB");
        event.target.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const image = new Image();
        image.onload = () => {
            const size = 256;
            const canvas = document.createElement("canvas");
            const minSide = Math.min(image.width, image.height);
            const offsetX = (image.width - minSide) / 2;
            const offsetY = (image.height - minSide) / 2;

            canvas.width = size;
            canvas.height = size;

            const context = canvas.getContext("2d");
            context.drawImage(image, offsetX, offsetY, minSide, minSide, 0, 0, size, size);

            pendingAvatarData = canvas.toDataURL("image/jpeg", 0.86);
            const preview = document.getElementById("profile-avatar-preview");
            if (preview) preview.src = pendingAvatarData;

            showToast("เลือกรูปโปรไฟล์แล้ว กดบันทึกเพื่อใช้งาน");
        };
        image.onerror = () => showToast("ไม่สามารถอ่านรูปภาพได้ กรุณาเลือกรูปอื่น");
        image.src = e.target.result;
    };
    reader.onerror = () => showToast("ไม่สามารถอ่านไฟล์รูปภาพได้");
    reader.readAsDataURL(file);
}

function openProfileModal() {
    closeProfileDropdown();

    const user = getCurrentShopUser();
    const username = user ? user.username : getCurrentUsername();
    const fullname = (user && user.fullname) || "";
    const email = (user && user.email) || "";
    const phone = (user && user.phone) || "";
    const birthdate = (user && user.birthdate) || "";
    const avatar = (user && user.avatar) || "assets/images/avatars/user.jpg";
    const savedGender = (user && user.gender) || "male";

    const fullnameInput = document.getElementById("profile-fullname");
    const phoneInput = document.getElementById("profile-phone");
    const emailInput = document.getElementById("profile-email");
    const birthdateInput = document.getElementById("profile-birthdate");
    const avatarPreview = document.getElementById("profile-avatar-preview");
    const nameDisplay = document.getElementById("profile-name-display");
    const usernameDisplay = document.getElementById("profile-username-display");
    const genderRadio = document.querySelector(`input[name="gender"][value="${savedGender}"]`);

    if (fullnameInput) fullnameInput.value = fullname;
    if (phoneInput) phoneInput.value = phoneForDisplay(phone);
    if (emailInput) emailInput.value = email;
    if (birthdateInput) birthdateInput.value = birthdate;
    if (avatarPreview) avatarPreview.src = avatar;
    if (nameDisplay) nameDisplay.textContent = fullname || "ข้อมูลส่วนตัว";
    if (usernameDisplay) usernameDisplay.textContent = username ? `@${username}` : "บัญชีผู้เยี่ยมชม";
    if (genderRadio) genderRadio.checked = true;

    pendingAvatarData = null;
    openModal("profile-modal");
}

function closeProfileModal() {
    closeModal("profile-modal");
}

function saveProfileData(event) {
    event.preventDefault();

    const fullnameInput = document.getElementById("profile-fullname");
    const phoneInput = document.getElementById("profile-phone");
    const emailInput = document.getElementById("profile-email");
    const birthdateInput = document.getElementById("profile-birthdate");

    const fullname = fullnameInput ? fullnameInput.value.trim() : "";
    const email = emailInput ? emailInput.value.trim() : "";
    const phone = normalizePhone(phoneInput ? phoneInput.value : "");
    const birthdate = birthdateInput ? birthdateInput.value : "";
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";

    if (fullname.length < 2) {
        showToast("กรุณากรอกชื่อ - นามสกุลอย่างน้อย 2 ตัวอักษร");
        fullnameInput?.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        showToast("กรุณากรอกอีเมลให้ถูกต้อง");
        emailInput?.focus();
        return;
    }

    if (!phone) {
        showToast("กรุณากรอกเบอร์โทรศัพท์ 9 หลัก");
        phoneInput?.focus();
        return;
    }

    const user = getCurrentShopUser();
    if (!user) {
        showToast("กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูลส่วนตัว");
        return;
    }

    const emailTaken = getShopUsers().some((account) => (
        normalizeIdentity(account.email) === normalizeIdentity(email)
        && normalizeIdentity(account.username) !== normalizeIdentity(user.username)
    ));

    if (emailTaken) {
        showToast("อีเมลนี้ถูกใช้งานโดยบัญชีอื่น กรุณาใช้อีเมลอื่น");
        emailInput?.focus();
        return;
    }

    const updates = {
        fullname,
        email,
        phone,
        birthdate,
        gender
    };

    if (pendingAvatarData) {
        updates.avatar = pendingAvatarData;
    }

    const updatedUser = updateCurrentShopUser(updates);
    const avatar = (updatedUser && updatedUser.avatar) || "assets/images/avatars/user.jpg";

    const userDisplay = document.getElementById("user-display");
    const profileSub = document.getElementById("profile-sub");
    const headerAvatar = document.getElementById("avatar-img");
    const nameDisplay = document.getElementById("profile-name-display");
    const avatarPreview = document.getElementById("profile-avatar-preview");

    if (userDisplay) userDisplay.innerText = fullname;
    if (profileSub) profileSub.innerText = email;
    if (headerAvatar) headerAvatar.src = avatar;
    if (nameDisplay) nameDisplay.textContent = fullname;
    if (avatarPreview) avatarPreview.src = avatar;

    pendingAvatarData = null;
    showToast("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว");
    closeProfileModal();
}

/* ==================== ที่อยู่ ==================== */
function openAddressModal() {
    closeProfileDropdown();

    const user = getCurrentShopUser();
    const savedAddress = (user && user.address) || {};
    const name = savedAddress.name || "";
    const phone = savedAddress.phone || "";
    const mainAddress = savedAddress.address || "";
    const detail = savedAddress.detail || "";

    document.getElementById("addr-name").value = name;
    document.getElementById("addr-phone").value = phoneForDisplay(phone);
    document.getElementById("addr-main").value = mainAddress;
    document.getElementById("addr-detail").value = detail;

    openModal("address-modal");
}

function closeAddressModal() {
    closeModal("address-modal");
}

function saveAddressData(event) {
    event.preventDefault();

    const nameInput = document.getElementById("addr-name");
    const phoneInput = document.getElementById("addr-phone");
    const mainInput = document.getElementById("addr-main");
    const detailInput = document.getElementById("addr-detail");

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = normalizePhone(phoneInput ? phoneInput.value : "");
    const mainAddress = mainInput ? mainInput.value.trim() : "";
    const detail = detailInput ? detailInput.value.trim() : "";

    if (!name) {
        showToast("กรุณากรอกชื่อผู้รับ");
        nameInput?.focus();
        return;
    }

    if (!phone) {
        showToast("กรุณากรอกเบอร์โทรศัพท์ 9 หลัก");
        phoneInput?.focus();
        return;
    }

    if (!mainAddress) {
        showToast("กรุณากรอกที่อยู่จัดส่ง");
        mainInput?.focus();
        return;
    }

    if (!getCurrentShopUser()) {
        showToast("กรุณาเข้าสู่ระบบก่อนบันทึกที่อยู่จัดส่ง");
        return;
    }

    const address = {
        name,
        phone,
        address: mainAddress,
        detail,
        updatedAt: Date.now()
    };

    updateCurrentShopUser({ address });

    showToast("บันทึกข้อมูลที่อยู่เรียบร้อยแล้ว");
    closeAddressModal();
}

/* ==================== ประวัติการสั่งซื้อ ==================== */
function openOrderHistoryModal() {
    closeProfileDropdown();

    const container = document.getElementById("order-history-list");
    const orders = loadOrders();

    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="orders-empty">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2Z"></path><path d="M9 7h6M9 11h6"></path></svg>
                <p>ยังไม่มีประวัติการสั่งซื้อ</p>
                <small>เมื่อคุณสั่งซื้อสำเร็จ รายการจะแสดงอยู่ที่นี่</small>
            </div>
        `;
    } else {
        container.innerHTML = orders.map((order) => `
            <article class="order-card">
                <div class="order-head">
                    <div>
                        <strong>รหัส: ${escapeHTML(order.id)}</strong>
                        <span class="order-date">${escapeHTML(order.date)}</span>
                    </div>
                    <span class="order-status">${escapeHTML(order.status || "รอดำเนินการ")}</span>
                </div>
                <div class="order-items">
                    ${(order.items || []).map((item) => {
                        const qty = item.qty || 1;
                        const size = item.size ? ` · ไซส์ ${escapeHTML(item.size)}` : "";
                        return `
                            <div class="order-item">
                                <div class="order-item-left">
                                    <img src="${resolveProductImage(item.image)}" alt="${escapeHTML(item.name)}">
                                    <span>${escapeHTML(item.name)}${size}${qty > 1 ? ` <small>× ${qty}</small>` : ""}</span>
                                </div>
                                <span>${formatPrice(item.price * qty)} บาท</span>
                            </div>
                        `;
                    }).join("")}
                </div>
                <div class="order-total">
                    <span>ยอดรวมทั้งหมด</span>
                    <span>${formatPrice(order.totalPrice)} บาท</span>
                </div>
            </article>
        `).join("");
    }

    openModal("order-history-modal");
}

function closeOrderHistoryModal() {
    closeModal("order-history-modal");
}

/* ==================== ปิด dropdown เมื่อคลิกด้านนอก ==================== */
window.addEventListener("click", (event) => {
    if (!event.target.closest(".user-profile-menu")) {
        closeProfileDropdown();
    }
});

/* ==================== ธีมมืด / สว่าง ==================== */
const THEME_STORAGE_KEY = "shop_theme";
const THEME_COLORS = {
    dark: "#0e0e10",
    light: "#f6f1e7"
};

function getStoredTheme() {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
    } catch {
        return "dark";
    }
}

function updateThemeControl(theme) {
    const button = document.getElementById("theme-toggle-btn");
    if (!button) return;

    const nextThemeLabel = theme === "dark" ? "สลับเป็นธีมสว่าง" : "สลับเป็นธีมมืด";
    button.setAttribute("aria-label", nextThemeLabel);
    button.setAttribute("title", nextThemeLabel);
    button.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
}

function applyTheme(theme, options = {}) {
    const nextTheme = theme === "light" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", THEME_COLORS[nextTheme]);

    updateThemeControl(nextTheme);

    if (options.persist) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch {
            // ใช้งานต่อได้แม้เบราว์เซอร์ไม่ให้บันทึก localStorage
        }
    }

    if (options.announce) {
        showToast(nextTheme === "light" ? "เปลี่ยนเป็นธีมสว่างแล้ว" : "เปลี่ยนเป็นธีมมืดแล้ว");
    }

    return nextTheme;
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") === "light"
        ? "light"
        : "dark";

    applyTheme(currentTheme === "light" ? "dark" : "light", {
        persist: true,
        announce: true
    });
}

function initTheme() {
    applyTheme(getStoredTheme());
}

window.addEventListener("storage", (event) => {
    if (event.key === THEME_STORAGE_KEY) {
        applyTheme(event.newValue, { persist: false });
    }
});

/* ==================== เริ่มต้นการทำงาน ==================== */
initTheme();
initUserDisplay();
displayProducts();
updateCartUI();
