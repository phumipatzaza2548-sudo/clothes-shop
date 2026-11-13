const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const authSource = fs.readFileSync(
    path.join(__dirname, "..", "supabase-auth.js"),
    "utf8"
);

function createAuthContext({ config, createClient = () => ({}) } = {}) {
    const context = vm.createContext({ URL });
    context.window = context;
    context.SUPABASE_CONFIG = config;
    context.supabase = { createClient };
    vm.runInContext(authSource, context);
    return context;
}

test("requires valid Supabase configuration before creating a client", () => {
    const auth = createAuthContext();

    assert.throws(() => auth.getSharedSupabaseClient(), /Supabase/);
});

test("creates one shared client with a persistent auth session", () => {
    let createClientCalls = 0;
    let clientOptions;
    const client = {};
    const auth = createAuthContext({
        config: {
            url: "https://example.supabase.co",
            publishableKey: "public-test-key"
        },
        createClient(url, key, options) {
            createClientCalls += 1;
            clientOptions = options;
            assert.equal(url, "https://example.supabase.co");
            assert.equal(key, "public-test-key");
            return client;
        }
    });

    assert.equal(auth.getSharedSupabaseClient(), client);
    assert.equal(auth.getSharedSupabaseClient(), client);
    assert.equal(createClientCalls, 1);
    assert.equal(clientOptions.auth.persistSession, true);
    assert.equal(clientOptions.auth.autoRefreshToken, true);
    assert.equal(clientOptions.auth.detectSessionInUrl, true);
});

test("routes admins to inventory and customers to the storefront", async () => {
    const auth = createAuthContext();

    assert.equal(await auth.getAuthLandingPage({ rpc: async () => ({ data: true }) }), "admin.html");
    assert.equal(await auth.getAuthLandingPage({ rpc: async () => ({ data: false }) }), "shop.html");
});

test("does not choose a destination when admin-role lookup fails", async () => {
    const auth = createAuthContext();

    await assert.rejects(
        auth.getAuthLandingPage({ rpc: async () => ({ data: null, error: new Error("offline") }) }),
        /สิทธิ์/
    );
});
