const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function createDashboardContext() {
    const context = vm.createContext({});
    const source = ["inventory.js", "admin-dashboard.js"]
        .map((file) => fs.readFileSync(path.join(__dirname, "..", file), "utf8"))
        .join("\n;\n");
    vm.runInContext(source, context);
    // แปลงผ่าน JSON ให้ค่าจาก vm context เทียบกับค่าในเทสต์ได้ (คนละ realm)
    return (expression) => JSON.parse(JSON.stringify(vm.runInContext(expression, context)));
}

// สร้างเวลาแบบ local time เพื่อให้เทสต์ผ่านทุก time zone
const at = (daysAgo, hour = 10) => {
    const now = new Date(2026, 10, 24, 15, 0, 0);
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, hour).toISOString();
};

test("sums approved sales by day and counts statuses inside the 30-day window only", () => {
    const run = createDashboardContext();
    const orders = [
        { status: "approved", total_amount: 500, created_at: at(0) },
        { status: "approved", total_amount: 300, created_at: at(3) },
        { status: "approved", total_amount: 700, created_at: at(20) },
        { status: "approved", total_amount: 999, created_at: at(30) }, // วันที่ 31 ย้อนหลัง: อยู่นอกช่วง
        { status: "pending", total_amount: 200, created_at: at(0) },
        { status: "rejected", total_amount: 150, created_at: at(1) }
    ];
    const stats = run(`buildDashboardStats(${JSON.stringify(orders)}, [], new Date(2026, 10, 24, 15))`);

    assert.equal(stats.daily.length, 30);
    assert.equal(stats.today, 500);
    assert.equal(stats.last7, 800);
    assert.equal(stats.last30, 1500);
    assert.deepEqual(stats.statusCounts, { pending: 1, approved: 3, rejected: 1 });
    assert.equal(stats.daily.at(-1).orders, 1);
});

test("ranks top products by quantity and totals revenue per category", () => {
    const run = createDashboardContext();
    const items = [
        { product_id: 11, quantity: 2, unit_price: 250 }, // หมวก
        { product_id: 11, quantity: 3, unit_price: 250 },
        { product_id: 1, quantity: 4, unit_price: 150 }, // เสื้อ
        { product_id: 20, quantity: 1, unit_price: 1290 } // รองเท้า
    ];
    const stats = run(`buildDashboardStats([], ${JSON.stringify(items)}, new Date(2026, 10, 24, 15))`);

    assert.deepEqual(
        stats.topProducts.map((row) => [row.product.id, row.quantity, row.revenue]),
        [[11, 5, 1250], [1, 4, 600], [20, 1, 1290]]
    );
    assert.deepEqual(
        stats.categories.map((row) => [row.category, row.revenue]),
        [["shoe", 1290], ["hat", 1250], ["shirt", 600], ["pants", 0]]
    );
});
