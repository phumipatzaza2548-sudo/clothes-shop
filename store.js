/* ==================== Shared local account store ==================== */
const SHOP_USERS_KEY = "shop_users";
const SHOP_CURRENT_USER_KEY = "currentUser";
const SHOP_LEGACY_ORDERS_KEY = "my_orders";
const SHOP_PASSWORD_PREFIX = "my-clothing-shop::v1::";

function safeParseJSON(value, fallback) {
    try {
        const parsed = JSON.parse(value);
        return parsed ?? fallback;
    } catch {
        return fallback;
    }
}

function getShopUsers() {
    const users = safeParseJSON(localStorage.getItem(SHOP_USERS_KEY), []);
    return Array.isArray(users) ? users : [];
}

function saveShopUsers(users) {
    localStorage.setItem(SHOP_USERS_KEY, JSON.stringify(users));
}

function normalizeIdentity(value) {
    return String(value || "").trim().toLowerCase();
}

function findShopUser(identity) {
    const key = normalizeIdentity(identity);
    if (!key) return null;

    return getShopUsers().find((user) => (
        normalizeIdentity(user.username) === key
        || normalizeIdentity(user.email) === key
    )) || null;
}

function getCurrentUsername() {
    return localStorage.getItem(SHOP_CURRENT_USER_KEY) || "";
}

function setCurrentUsername(username) {
    localStorage.setItem(SHOP_CURRENT_USER_KEY, username);
}

function clearCurrentUsername() {
    localStorage.removeItem(SHOP_CURRENT_USER_KEY);
}

function getCurrentShopUser() {
    const username = getCurrentUsername();
    if (!username) return null;
    return findShopUser(username);
}

function updateCurrentShopUser(updates) {
    const username = getCurrentUsername();
    if (!username) return null;

    const users = getShopUsers();
    const index = users.findIndex((user) => (
        normalizeIdentity(user.username) === normalizeIdentity(username)
    ));

    if (index === -1) return null;

    users[index] = { ...users[index], ...updates };
    saveShopUsers(users);
    return users[index];
}

function getOrdersStorageKey(username = getCurrentUsername()) {
    return username ? `my_orders_${normalizeIdentity(username)}` : SHOP_LEGACY_ORDERS_KEY;
}

function loadOrders() {
    const key = getOrdersStorageKey();
    const stored = localStorage.getItem(key);

    if (stored !== null) {
        const orders = safeParseJSON(stored, []);
        return Array.isArray(orders) ? orders : [];
    }

    // ย้ายประวัติการสั่งซื้อเดิมของผู้ใช้ที่เคยใช้งานก่อนมีระบบบัญชี
    // จากนั้นลบข้อมูลเดิมเพื่อไม่ให้ถูกคัดลอกไปยังบัญชีอื่น
    if (getCurrentUsername()) {
        const legacyOrders = safeParseJSON(localStorage.getItem(SHOP_LEGACY_ORDERS_KEY), []);
        if (Array.isArray(legacyOrders) && legacyOrders.length > 0) {
            localStorage.setItem(key, JSON.stringify(legacyOrders));
            localStorage.removeItem(SHOP_LEGACY_ORDERS_KEY);
            return legacyOrders;
        }
    }

    return [];
}

function saveOrders(orders) {
    localStorage.setItem(getOrdersStorageKey(), JSON.stringify(orders));
}

async function hashPassword(password) {
    const value = `${SHOP_PASSWORD_PREFIX}${password}`;

    if (window.crypto && window.crypto.subtle) {
        const digest = await window.crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(value)
        );

        return Array.from(new Uint8Array(digest))
            .map((byte) => byte.toString(16).padStart(2, "0"))
            .join("");
    }

    // fallback สำหรับเบราว์เซอร์ที่ไม่มี Web Crypto
    let hash = 5381;
    for (let i = 0; i < value.length; i += 1) {
        hash = ((hash << 5) + hash) ^ value.charCodeAt(i);
    }
    return `fallback_${(hash >>> 0).toString(16)}`;
}
