/* ==================== Shared local account store ==================== */
const SHOP_USERS_KEY = "shop_users";
const SHOP_CURRENT_USER_KEY = "currentUser";
const SHOP_CURRENT_AUTH_ID_KEY = "currentSupabaseUserId";
const SHOP_LEGACY_ORDERS_KEY = "my_orders";

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
    const profiles = users.map((user) => {
        const profile = { ...user };
        delete profile.passwordHash;
        return profile;
    });
    localStorage.setItem(SHOP_USERS_KEY, JSON.stringify(profiles));
}

function normalizeIdentity(value) {
    return String(value || "").trim().toLowerCase();
}

function getCurrentUsername() {
    return localStorage.getItem(SHOP_CURRENT_USER_KEY) || "";
}

function setCurrentUsername(username) {
    localStorage.setItem(SHOP_CURRENT_USER_KEY, username);
}

function clearCurrentUsername() {
    localStorage.removeItem(SHOP_CURRENT_USER_KEY);
    localStorage.removeItem(SHOP_CURRENT_AUTH_ID_KEY);
}

function getCurrentShopUser() {
    const userId = localStorage.getItem(SHOP_CURRENT_AUTH_ID_KEY);
    if (!userId) return null;

    return getShopUsers().find((user) => user.supabaseUserId === userId) || null;
}

function upsertShopUserFromAuthUser(authUser) {
    if (!authUser || !authUser.id || !authUser.email) {
        throw new Error("ข้อมูลบัญชีจาก Supabase ไม่ครบถ้วน");
    }

    const users = getShopUsers();
    const email = normalizeIdentity(authUser.email);
    const index = users.findIndex((user) => (
        user.supabaseUserId === authUser.id
        || normalizeIdentity(user.email) === email
    ));
    const existing = index === -1 ? {} : users[index];
    const existingProfile = { ...existing };
    delete existingProfile.passwordHash;
    const metadata = authUser.user_metadata || {};
    const username = String(existing.username || metadata.username || email.split("@")[0]).trim();
    const profile = {
        ...existingProfile,
        supabaseUserId: authUser.id,
        username,
        fullname: existing.fullname || metadata.fullname || username,
        email: authUser.email,
        phone: existing.phone || metadata.phone || "",
        gender: existing.gender || "",
        birthdate: existing.birthdate || "",
        avatar: existing.avatar || "",
        address: existing.address || {},
        createdAt: existing.createdAt || Date.now()
    };

    if (index === -1) {
        users.push(profile);
    } else {
        users[index] = profile;
    }

    saveShopUsers(users);
    setCurrentUsername(username);
    localStorage.setItem(SHOP_CURRENT_AUTH_ID_KEY, authUser.id);
    return profile;
}

function updateCurrentShopUser(updates) {
    const userId = localStorage.getItem(SHOP_CURRENT_AUTH_ID_KEY);
    if (!userId) return null;

    const users = getShopUsers();
    const index = users.findIndex((user) => user.supabaseUserId === userId);

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
