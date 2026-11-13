/* ==================== Shared Supabase authentication ==================== */
(function (global) {
    let sharedClient = null;

    function getSharedSupabaseClient() {
        if (sharedClient) return sharedClient;

        const config = global.SUPABASE_CONFIG;
        if (typeof global.supabase?.createClient !== "function" || !config?.url || !config?.publishableKey) {
            throw new Error("ยังไม่ได้ตั้งค่า Supabase");
        }

        let projectUrl;
        try {
            projectUrl = new URL(config.url);
        } catch {
            throw new Error("Project URL ของ Supabase ไม่ถูกต้อง");
        }

        const secureProtocol = projectUrl.protocol === "https:";
        const localProtocol = projectUrl.protocol === "http:" && projectUrl.hostname === "localhost";
        if (!secureProtocol && !localProtocol) {
            throw new Error("Project URL ต้องใช้ HTTPS");
        }

        sharedClient = global.supabase.createClient(config.url, config.publishableKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        });

        return sharedClient;
    }

    async function isCurrentUserAdmin(client) {
        const { data, error } = await client.rpc("is_admin");
        if (error || typeof data !== "boolean") {
            throw new Error("ไม่สามารถตรวจสอบสิทธิ์บัญชีได้ กรุณาลองใหม่");
        }

        return data;
    }

    async function getAuthLandingPage(client) {
        const isAdmin = await isCurrentUserAdmin(client);
        return isAdmin ? "admin.html" : "shop.html";
    }

    global.getSharedSupabaseClient = getSharedSupabaseClient;
    global.isCurrentUserAdmin = isCurrentUserAdmin;
    global.getAuthLandingPage = getAuthLandingPage;
})(window);
