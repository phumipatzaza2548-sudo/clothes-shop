const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const inventorySource = fs.readFileSync(
    path.join(__dirname, "..", "inventory.js"),
    "utf8"
);

function createInventoryContext({ failWrites = false } = {}) {
    const values = new Map();
    const localStorage = {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            if (failWrites) throw new Error("Storage is unavailable");
            values.set(key, String(value));
        }
    };
    const context = vm.createContext({ localStorage });
    vm.runInContext(inventorySource, context);

    return {
        context,
        read(expression) {
            return vm.runInContext(expression, context);
        }
    };
}

test("restocks a selected size and saves the updated stock", () => {
    const inventory = createInventoryContext();

    const updatedStock = inventory.read("restockProduct(1, 'XL', 2)");
    const savedStock = JSON.parse(inventory.read("localStorage.getItem(STOCK_STORAGE_KEY)"));

    assert.equal(updatedStock, 2);
    assert.equal(savedStock[1].XL, 2);
});

test("syncs storefront stock from the database and persists the latest quantities", async () => {
    const inventory = createInventoryContext();
    const rows = inventory.read(`products.flatMap((product) => (
        getStockKeys(product).map((size) => ({ product_id: product.id, size, stock: 7 }))
    ))`);
    const client = {
        from(table) {
            assert.equal(table, "product_stock");
            return {
                select(columns) {
                    assert.equal(columns, "product_id, size, stock");
                    return Promise.resolve({ data: rows, error: null });
                }
            };
        }
    };

    const syncStock = inventory.read("syncProductStockFromSupabase");
    assert.equal(await syncStock(client), true);

    assert.equal(inventory.read("getProductStock(1, 'S')"), 7);
    assert.equal(inventory.read("getProductStock(11)"), 7);
    const savedStock = JSON.parse(inventory.read("localStorage.getItem(STOCK_STORAGE_KEY)"));
    assert.equal(savedStock[1].S, 7);
    assert.equal(savedStock[11].onesize, 7);

    client.from = () => ({
        select: () => Promise.resolve({ data: [...rows].reverse(), error: null })
    });
    assert.equal(await syncStock(client), false);
});

test("rejects incomplete database stock without changing the current stock", async () => {
    const inventory = createInventoryContext();
    const originalStock = inventory.read("getProductStock(1, 'S')");
    const client = {
        from() {
            return {
                select() {
                    return Promise.resolve({
                        data: [{ product_id: 1, size: "S", stock: 10 }],
                        error: null
                    });
                }
            };
        }
    };

    await assert.rejects(
        inventory.read("syncProductStockFromSupabase")(client),
        /ข้อมูลสต๊อกในฐานข้อมูลไม่ครบ/
    );
    assert.equal(inventory.read("getProductStock(1, 'S')"), originalStock);
});

test("rejects invalid quantities, products, and sizes without changing stock", () => {
    const inventory = createInventoryContext();
    const originalStock = inventory.read("getProductStock(1, 'S')");

    assert.throws(() => inventory.read("restockProduct(1, 'S', 0)"), /จำนวน/);
    assert.throws(() => inventory.read("restockProduct(1, 'S', 1.5)"), /จำนวน/);
    assert.throws(() => inventory.read("restockProduct(999, 'S', 1)"), /สินค้า/);
    assert.throws(() => inventory.read("restockProduct(1, 'XXL', 1)"), /ไซส์/);
    assert.equal(inventory.read("getProductStock(1, 'S')"), originalStock);
});

test("restores in-memory stock and reports an error when persistence fails", () => {
    const inventory = createInventoryContext({ failWrites: true });
    const originalStock = inventory.read("getProductStock(1, 'S')");

    assert.throws(() => inventory.read("restockProduct(1, 'S', 3)"), /บันทึกสต๊อก/);
    assert.equal(inventory.read("getProductStock(1, 'S')"), originalStock);
});
