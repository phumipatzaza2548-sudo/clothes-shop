/* ==================== Dashboard ภาพรวมร้าน (หน้าแอดมิน) ==================== */
// ต้องโหลดหลัง inventory.js (ใช้ products, CATEGORY_LABELS, escapeHTML)
const DASHBOARD_DAYS = 30;
const DASHBOARD_PAGE_SIZE = 1000;
const ORDER_STATUS_ORDER = ["pending", "approved", "rejected"];
const DASHBOARD_STATUS_LABELS = {
    pending: "รอตรวจสอบ",
    approved: "อนุมัติแล้ว",
    rejected: "ปฏิเสธ"
};

function getLocalDateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}

// เที่ยงคืนของวันแรกในช่วง N วันล่าสุด (นับวันนี้ด้วย) ตามเวลาเครื่องผู้ใช้
function getDashboardStart(now = new Date(), days = DASHBOARD_DAYS) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1));
}

// คำนวณตัวเลขทั้งหมดของ dashboard จากข้อมูลดิบ ไม่แตะหน้าจอ จึงเทสต์ได้
// orders: [{ status, total_amount, created_at }] ทุกสถานะในช่วงเวลา
// items:  [{ product_id, quantity, unit_price }] เฉพาะคำสั่งซื้อที่อนุมัติแล้วในช่วงเวลา
function buildDashboardStats(orders, items, now = new Date(), days = DASHBOARD_DAYS) {
    const start = getDashboardStart(now, days);
    const daily = [];
    const dailyByKey = new Map();
    for (let index = 0; index < days; index += 1) {
        const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
        const entry = { key: getLocalDateKey(date), date, total: 0, orders: 0 };
        daily.push(entry);
        dailyByKey.set(entry.key, entry);
    }

    const statusCounts = { pending: 0, approved: 0, rejected: 0 };
    for (const order of orders) {
        const day = dailyByKey.get(getLocalDateKey(new Date(order.created_at)));
        if (!day || statusCounts[order.status] === undefined) continue;
        statusCounts[order.status] += 1;
        if (order.status !== "approved") continue;

        day.total += order.total_amount;
        day.orders += 1;
    }

    const sumLastDays = (count) => daily.slice(-count).reduce((sum, day) => sum + day.total, 0);

    const byProduct = new Map();
    const byCategory = new Map(Object.keys(CATEGORY_LABELS).map((category) => [category, 0]));
    for (const item of items) {
        const product = products.find((entry) => entry.id === item.product_id);
        if (!product) continue;
        const revenue = item.unit_price * item.quantity;
        const current = byProduct.get(product.id) || { product, quantity: 0, revenue: 0 };
        current.quantity += item.quantity;
        current.revenue += revenue;
        byProduct.set(product.id, current);
        byCategory.set(product.category, (byCategory.get(product.category) || 0) + revenue);
    }

    return {
        daily,
        today: sumLastDays(1),
        last7: sumLastDays(7),
        last30: sumLastDays(days),
        statusCounts,
        topProducts: [...byProduct.values()]
            .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
            .slice(0, 5),
        categories: [...byCategory.entries()]
            .map(([category, revenue]) => ({ category, label: CATEGORY_LABELS[category] || category, revenue }))
            .sort((a, b) => b.revenue - a.revenue)
    };
}

/* ---------- ดึงข้อมูล ---------- */
async function fetchAllDashboardRows(makeQuery) {
    const rows = [];
    for (let offset = 0; ; offset += DASHBOARD_PAGE_SIZE) {
        const { data, error } = await makeQuery().range(offset, offset + DASHBOARD_PAGE_SIZE - 1);
        if (error || !Array.isArray(data)) throw new Error("โหลดข้อมูลภาพรวมร้านไม่สำเร็จ");
        rows.push(...data);
        if (data.length < DASHBOARD_PAGE_SIZE) return rows;
    }
}

async function fetchDashboardData(supabaseClient, now = new Date()) {
    const since = getDashboardStart(now).toISOString();
    const [orders, items] = await Promise.all([
        fetchAllDashboardRows(() => supabaseClient
            .from("store_orders")
            .select("status, total_amount, created_at")
            .gte("created_at", since)
            .order("created_at", { ascending: true })
            .order("id", { ascending: true })),
        fetchAllDashboardRows(() => supabaseClient
            .from("store_order_items")
            .select("product_id, quantity, unit_price, store_orders!inner(status, created_at)")
            .eq("store_orders.status", "approved")
            .gte("store_orders.created_at", since)
            .order("order_id", { ascending: true })
            .order("product_id", { ascending: true })
            .order("size", { ascending: true }))
    ]);

    for (const order of orders) {
        if (!Number.isSafeInteger(order.total_amount) || !Number.isFinite(Date.parse(order.created_at))) {
            throw new Error("ข้อมูลคำสั่งซื้อในฐานข้อมูลไม่ถูกต้อง");
        }
    }
    for (const item of items) {
        if (!Number.isSafeInteger(item.quantity) || !Number.isSafeInteger(item.unit_price)) {
            throw new Error("ข้อมูลรายการคำสั่งซื้อไม่ถูกต้อง");
        }
    }

    return buildDashboardStats(orders, items, now);
}

/* ---------- วาดหน้าจอ ---------- */
const formatBaht = (value) => `${Number(value).toLocaleString("th-TH")} บาท`;
const formatShortDate = (date) => date.toLocaleDateString("th-TH", { day: "numeric", month: "short" });

// แท่งกราฟมุมบนโค้ง 4px ฐานตรงติดเส้นแกน
function roundedBarPath(x, y, width, height) {
    const radius = Math.min(4, width / 2, height);
    const bottom = y + height;
    return `M${x},${bottom}V${y + radius}Q${x},${y} ${x + radius},${y}`
        + `H${x + width - radius}Q${x + width},${y} ${x + width},${y + radius}V${bottom}Z`;
}

// ตัวหนังสือ (วันที่, ยอดสูงสุด) อยู่นอก SVG เพื่อให้ขนาดคงที่ ไม่ย่อขยายตามความกว้างกราฟ
function renderDailyChart(daily) {
    const width = 960;
    const height = 220;
    const top = 6;
    const plotHeight = height - top - 1;
    const slot = width / daily.length;
    const barWidth = Math.max(2, slot - 2); // ช่องว่าง 2px ระหว่างแท่ง
    const max = Math.max(...daily.map((day) => day.total), 0);
    const baseline = top + plotHeight;
    const peak = daily.reduce((best, day) => (day.total > best.total ? day : best), daily[0]);

    const bars = daily.map((day, index) => {
        const x = index * slot + (slot - barWidth) / 2;
        const barHeight = max > 0 ? (day.total / max) * plotHeight : 0;
        const label = `${formatShortDate(day.date)}: ${formatBaht(day.total)} · ${day.orders} คำสั่งซื้อ`;
        const bar = barHeight > 0
            ? `<path class="insights-bar" d="${roundedBarPath(x, baseline - barHeight, barWidth, barHeight)}"></path>`
            : "";
        // พื้นที่ hover สูงเต็มกราฟ ใหญ่กว่าแท่ง เลือกง่าย
        return `<g class="insights-bar-group"><title>${escapeHTML(label)}</title>`
            + `<rect class="insights-bar-hit" x="${index * slot}" y="${top}" width="${slot}" height="${plotHeight}"></rect>${bar}</g>`;
    }).join("");

    const xLabels = [0, Math.floor(daily.length / 2), daily.length - 1]
        .map((index) => `<span>${escapeHTML(formatShortDate(daily[index].date))}</span>`)
        .join("");
    const peakText = max > 0
        ? `สูงสุด ${formatBaht(max)} · ${formatShortDate(peak.date)}`
        : "ยังไม่มียอดขายในช่วงนี้";

    return `<p class="insights-peak">${escapeHTML(peakText)}</p>
            <svg class="insights-daily-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img"
                aria-label="กราฟยอดขายรายวัน ${daily.length} วันล่าสุด ${escapeHTML(peakText)}">
                <line class="insights-grid-line" x1="0" x2="${width}" y1="${top}" y2="${top}"></line>
                <line class="insights-baseline" x1="0" x2="${width}" y1="${baseline}" y2="${baseline}"></line>
                ${bars}
            </svg>
            <div class="insights-axis">${xLabels}</div>`;
}

function renderBarRows(rows, emptyText) {
    const max = Math.max(...rows.map((row) => row.value), 0);
    if (max === 0) return `<p class="admin-empty">${escapeHTML(emptyText)}</p>`;
    return `<ol class="insights-rows">${rows.map((row) => `
        <li>
            <span class="insights-row-name">${escapeHTML(row.name)}</span>
            <span class="insights-row-track" aria-hidden="true">
                <span class="insights-row-fill" style="width: ${(row.value / max) * 100}%"></span>
            </span>
            <span class="insights-row-value">${escapeHTML(row.detail)}</span>
        </li>`).join("")}</ol>`;
}

function renderDashboard(stats) {
    const tile = (label, value, note) => `
        <article class="admin-summary-card">
            <span>${escapeHTML(label)}</span>
            <strong>${escapeHTML(value)}</strong>
            <small>${escapeHTML(note)}</small>
        </article>`;

    document.getElementById("insights-sales-tiles").innerHTML = [
        tile("ยอดขายวันนี้", formatBaht(stats.today), "คำสั่งซื้อที่อนุมัติแล้ว"),
        tile("ยอดขาย 7 วัน", formatBaht(stats.last7), "รวมวันนี้"),
        tile(`ยอดขาย ${DASHBOARD_DAYS} วัน`, formatBaht(stats.last30), "รวมวันนี้")
    ].join("");

    document.getElementById("insights-status-tiles").innerHTML = ORDER_STATUS_ORDER
        .map((status) => tile(
            DASHBOARD_STATUS_LABELS[status],
            stats.statusCounts[status].toLocaleString("th-TH"),
            `คำสั่งซื้อใน ${DASHBOARD_DAYS} วัน`
        ))
        .join("");

    document.getElementById("insights-daily-chart").innerHTML = renderDailyChart(stats.daily);
    document.getElementById("insights-daily-table").innerHTML = `
        <thead><tr><th scope="col">วันที่</th><th scope="col">คำสั่งซื้อ</th><th scope="col">ยอดขาย</th></tr></thead>
        <tbody>${stats.daily.slice().reverse().map((day) => `
            <tr><td>${escapeHTML(formatShortDate(day.date))}</td><td>${day.orders}</td><td>${escapeHTML(formatBaht(day.total))}</td></tr>
        `).join("")}</tbody>`;

    document.getElementById("insights-top-products").innerHTML = renderBarRows(
        stats.topProducts.map((row) => ({
            name: row.product.name,
            value: row.quantity,
            detail: `${row.quantity.toLocaleString("th-TH")} ชิ้น · ${formatBaht(row.revenue)}`
        })),
        "ยังไม่มีสินค้าที่ขายได้ในช่วงนี้"
    );

    document.getElementById("insights-categories").innerHTML = renderBarRows(
        stats.categories.map((row) => ({ name: row.label, value: row.revenue, detail: formatBaht(row.revenue) })),
        "ยังไม่มียอดขายในช่วงนี้"
    );
}

async function loadDashboardInsights(supabaseClient) {
    const message = document.getElementById("insights-message");
    try {
        renderDashboard(await fetchDashboardData(supabaseClient));
        message.textContent = "";
        message.classList.remove("is-visible", "is-error");
    } catch (error) {
        message.textContent = error.message || "โหลดข้อมูลภาพรวมร้านไม่สำเร็จ";
        message.classList.add("is-visible", "is-error");
    }
}
