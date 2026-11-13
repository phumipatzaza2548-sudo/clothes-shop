const test = require("node:test");
const assert = require("node:assert/strict");

test("selects slips at least 15 days old unless an order is still active", async () => {
    const { getExpiredSlipPaths } = await import(
        "../supabase/functions/cleanup-expired-slips/cleanup-utils.mjs"
    );
    const now = Date.parse("2026-11-13T00:00:00.000Z");
    const retentionMs = 15 * 24 * 60 * 60 * 1000;
    const files = [
        { path: "owner/expired.png", created_at: new Date(now - retentionMs).toISOString() },
        { path: "owner/active.png", created_at: new Date(now - retentionMs).toISOString() },
        { path: "owner/recent.png", created_at: new Date(now - retentionMs + 1).toISOString() },
        { path: "owner/unknown.png", created_at: null }
    ];

    assert.deepEqual(
        getExpiredSlipPaths(files, now, retentionMs, ["owner/active.png"]),
        ["owner/expired.png"]
    );
});
