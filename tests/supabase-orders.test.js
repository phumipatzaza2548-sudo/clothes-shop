const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const CUSTOMER_ID = "f81d4fae-7dec-4a81-ae5d-4c8b3b0a0412";

const ordersSource = fs.readFileSync(
    path.join(__dirname, "..", "supabase-orders.js"),
    "utf8"
);

function createOrdersContext() {
    const context = vm.createContext({ console: { error() {} } });
    context.window = context;
    vm.runInContext(ordersSource, context);
    return context;
}

test("uploads a customer's slip and submits an authenticated pending order", async () => {
    const orders = createOrdersContext();
    const calls = [];
    const client = {
        auth: {
            async getUser() {
                return { data: { user: { id: CUSTOMER_ID } }, error: null };
            }
        },
        storage: {
            from(bucket) {
                calls.push(["bucket", bucket]);
                return {
                    async upload(path, file, options) {
                        calls.push(["upload", path, file, options]);
                        return { error: null };
                    }
                };
            }
        },
        async rpc(name, payload) {
            calls.push(["rpc", name, payload]);
            return {
                data: {
                    id: payload.p_order_id,
                    status: "pending",
                    total_amount: 300,
                    created_at: "2026-11-13T00:00:00Z"
                },
                error: null
            };
        }
    };
    const orderId = "2ca02db8-8ce6-4ea6-864d-5e08f0fae003";
    const slipFile = { type: "image/png", size: 1024 };

    const result = await orders.submitStoreOrder(client, {
        orderId,
        items: [{ id: 1, size: "M", qty: 2 }],
        bank: "kbank",
        slipFile
    });

    assert.equal(result.data.id, orderId);
    assert.equal(calls[0][1], "payment-slips");
    assert.equal(calls[1][1], `${CUSTOMER_ID}/${orderId}.png`);
    assert.equal(calls[1][3].upsert, false);
    assert.equal(calls[2][1], "submit_store_order");
    assert.deepEqual(JSON.parse(JSON.stringify(calls[2][2].p_items)), [
        { product_id: 1, size: "M", quantity: 2 }
    ]);
});

test("requires an authenticated customer before uploading a slip", async () => {
    const orders = createOrdersContext();
    let uploadAttempted = false;
    const client = {
        auth: {
            async getUser() {
                return { data: { user: null }, error: null };
            }
        },
        storage: {
            from() {
                uploadAttempted = true;
            }
        },
        rpc() {}
    };

    await assert.rejects(
        orders.submitStoreOrder(client, {
            orderId: "2ca02db8-8ce6-4ea6-864d-5e08f0fae003",
            items: [{ id: 1, size: "M", qty: 1 }],
            bank: "kbank",
            slipFile: { type: "image/png", size: 1 }
        }),
        /เข้าสู่ระบบ/
    );
    assert.equal(uploadAttempted, false);
});

test("rejects oversized or unsupported slips before contacting Supabase", async () => {
    const orders = createOrdersContext();
    let storageAccessed = false;
    const client = {
        auth: {
            async getUser() {
                return { data: { user: { id: CUSTOMER_ID } }, error: null };
            }
        },
        storage: {
            from() {
                storageAccessed = true;
            }
        },
        rpc() {}
    };
    const order = {
        orderId: "2ca02db8-8ce6-4ea6-864d-5e08f0fae003",
        items: [{ id: 1, size: "M", qty: 1 }],
        bank: "kbank"
    };

    await assert.rejects(
        orders.submitStoreOrder(client, {
            ...order,
            slipFile: { type: "image/png", size: 8 * 1024 * 1024 + 1 }
        }),
        /8 MB/
    );
    await assert.rejects(
        orders.submitStoreOrder(client, {
            ...order,
            slipFile: { type: "text/plain", size: 10 }
        }),
        /รูปภาพ/
    );
    assert.equal(storageAccessed, false);
});

test("removes an uploaded slip when the database rejects the order", async () => {
    const orders = createOrdersContext();
    let removedPaths;
    const client = {
        auth: {
            async getUser() {
                return { data: { user: { id: CUSTOMER_ID } }, error: null };
            }
        },
        storage: {
            from() {
                return {
                    async upload() {
                        return { error: null };
                    },
                    async remove(paths) {
                        removedPaths = paths;
                        return { error: null };
                    }
                };
            }
        },
        async rpc() {
            return { data: null, error: new Error("Insufficient stock") };
        }
    };
    const orderId = "2ca02db8-8ce6-4ea6-864d-5e08f0fae003";

    await assert.rejects(
        orders.submitStoreOrder(client, {
            orderId,
            items: [{ id: 1, size: "M", qty: 1 }],
            bank: "kbank",
            slipFile: { type: "image/png", size: 1024 }
        }),
        /บันทึกคำสั่งซื้อไม่สำเร็จ/
    );
    assert.deepEqual(
        JSON.parse(JSON.stringify(removedPaths)),
        [`${CUSTOMER_ID}/${orderId}.png`]
    );
});
