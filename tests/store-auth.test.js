const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const storeSource = fs.readFileSync(
    path.join(__dirname, "..", "store.js"),
    "utf8"
);

function createStoreContext() {
    const values = new Map();
    const localStorage = {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, String(value));
        },
        removeItem(key) {
            values.delete(key);
        }
    };
    const context = vm.createContext({ localStorage });
    vm.runInContext(storeSource, context);
    return context;
}

test("associates a Supabase user with a local shop profile", () => {
    const store = createStoreContext();
    const user = vm.runInContext(`upsertShopUserFromAuthUser({
        id: "auth-user-1",
        email: "customer@example.com",
        user_metadata: { username: "customer", fullname: "Customer Name", phone: "0812345678" }
    })`, store);

    assert.equal(user.supabaseUserId, "auth-user-1");
    assert.equal(user.username, "customer");
    assert.equal(user.fullname, "Customer Name");
    assert.equal(vm.runInContext("getCurrentShopUser().email", store), "customer@example.com");
    assert.equal(vm.runInContext("getCurrentUsername()", store), "customer");
});

test("preserves local profile data and removes the obsolete local password hash", () => {
    const store = createStoreContext();
    vm.runInContext(`localStorage.setItem("shop_users", JSON.stringify([{
        username: "customer",
        email: "customer@example.com",
        passwordHash: "old-local-hash",
        address: { address: "Existing address" },
        avatar: "data:image/png;base64,old-avatar"
    }, {
        username: "another-user",
        email: "another@example.com",
        passwordHash: "another-old-hash"
    }]))`, store);

    const user = vm.runInContext(`upsertShopUserFromAuthUser({
        id: "auth-user-1",
        email: "customer@example.com",
        user_metadata: { username: "customer", fullname: "Customer Name", phone: "0812345678" }
    })`, store);

    assert.equal(user.address.address, "Existing address");
    assert.equal(user.avatar, "data:image/png;base64,old-avatar");
    assert.equal(user.fullname, "Customer Name");
    assert.equal(Object.hasOwn(user, "passwordHash"), false);
    assert.equal(
        vm.runInContext("getShopUsers().some((profile) => 'passwordHash' in profile)", store),
        false
    );
});

test("keeps local profile edits when refreshed Supabase metadata is older", () => {
    const store = createStoreContext();
    vm.runInContext(`saveShopUsers([{
        username: "customer",
        email: "customer@example.com",
        fullname: "Updated Local Name",
        phone: "0899999999",
        supabaseUserId: "auth-user-1"
    }])`, store);

    const user = vm.runInContext(`upsertShopUserFromAuthUser({
        id: "auth-user-1",
        email: "customer@example.com",
        user_metadata: { username: "customer", fullname: "Old Auth Name", phone: "0812345678" }
    })`, store);

    assert.equal(user.fullname, "Updated Local Name");
    assert.equal(user.phone, "0899999999");
});

test("does not treat an old local-only login as an authenticated Supabase user", () => {
    const store = createStoreContext();
    vm.runInContext(`saveShopUsers([{ username: "old-user", email: "old@example.com" }]);
        setCurrentUsername("old-user")`, store);

    assert.equal(vm.runInContext("getCurrentShopUser()", store), null);
});
