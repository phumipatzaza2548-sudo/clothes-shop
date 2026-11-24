const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const inventorySource = fs.readFileSync(
    path.join(__dirname, "..", "inventory.js"),
    "utf8"
);

function createInventoryContext() {
    const context = vm.createContext({});
    vm.runInContext(inventorySource, context);

    return {
        context,
        read(expression) {
            return vm.runInContext(expression, context);
        }
    };
}

test("storefront prices match the prices the database charges", () => {
    const sql = fs.readFileSync(
        path.join(__dirname, "..", "supabase", "order-schema.sql"),
        "utf8"
    );
    const priceBlock = sql.match(/unit_price := case product_id([\s\S]*?)end;/);
    assert.ok(priceBlock, "price case block not found in order-schema.sql");

    const sqlPrices = {};
    for (const [, id, price] of priceBlock[1].matchAll(/when (\d+) then (\d+)/g)) {
        sqlPrices[id] = Number(price);
    }

    const jsPrices = {};
    for (const product of createInventoryContext().read("products")) {
        jsPrices[product.id] = product.price;
    }

    assert.deepEqual(jsPrices, sqlPrices);
});

test("shows zero stock until the database stock is loaded", () => {
    const inventory = createInventoryContext();

    assert.equal(inventory.read("getProductStock(1, 'S')"), 0);
    assert.equal(inventory.read("getProductTotalStock(products[0])"), 0);
});

test("syncs storefront stock from the database", async () => {
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
