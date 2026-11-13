import { withSupabase } from "npm:@supabase/server@1";
import { getExpiredSlipPaths } from "./cleanup-utils.mjs";

const PAYMENT_SLIP_RETENTION_MS = 15 * 24 * 60 * 60 * 1000;
const STORAGE_PAGE_SIZE = 1000;
const DELETE_BATCH_SIZE = 100;
const USER_FOLDER_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function listStorageEntries(bucket, path) {
    const entries = [];
    for (let offset = 0; ; offset += STORAGE_PAGE_SIZE) {
        const { data, error } = await bucket.list(path, {
            limit: STORAGE_PAGE_SIZE,
            offset,
            sortBy: { column: "name", order: "asc" }
        });
        if (error || !Array.isArray(data)) {
            throw new Error("Could not list payment slip files");
        }

        entries.push(...data);
        if (data.length < STORAGE_PAGE_SIZE) return entries;
    }
}

async function deleteExpiredFiles(supabaseAdmin, bucket, paths, now) {
    let deletedCount = 0;
    for (let index = 0; index < paths.length; index += DELETE_BATCH_SIZE) {
        const batch = paths.slice(index, index + DELETE_BATCH_SIZE);
        const { data: activeOrders, error: activeError } = await supabaseAdmin
            .from("store_orders")
            .select("slip_path")
            .in("slip_path", batch)
            .gt("slip_expires_at", now);
        if (activeError) throw new Error("Could not check active payment slips");

        const activePaths = new Set((activeOrders || []).map((order) => order.slip_path));
        const expiredPaths = batch.filter((path) => !activePaths.has(path));
        if (expiredPaths.length === 0) continue;

        const { error: deleteError } = await bucket.remove(expiredPaths);
        if (deleteError) throw new Error("Could not remove expired payment slips");

        const { error: updateError } = await supabaseAdmin
            .from("store_orders")
            .update({ slip_path: null })
            .in("slip_path", expiredPaths);
        if (updateError) throw new Error("Could not clear expired payment slip paths");

        deletedCount += expiredPaths.length;
    }

    return deletedCount;
}

export default {
    fetch: withSupabase({ auth: "secret" }, async (_request, context) => {
        try {
            const now = new Date();
            const bucket = context.supabaseAdmin.storage.from("payment-slips");
            const folders = await listStorageEntries(bucket, "");
            let deletedCount = 0;

            for (const folder of folders) {
                if (folder.id !== null || !USER_FOLDER_PATTERN.test(folder.name)) continue;

                const files = await listStorageEntries(bucket, folder.name);
                const candidates = getExpiredSlipPaths(
                    files
                        .filter((file) => file.id !== null)
                        .map((file) => ({
                            path: `${folder.name}/${file.name}`,
                            created_at: file.created_at
                        })),
                    now.getTime(),
                    PAYMENT_SLIP_RETENTION_MS
                );
                deletedCount += await deleteExpiredFiles(
                    context.supabaseAdmin,
                    bucket,
                    candidates,
                    now.toISOString()
                );
            }

            return Response.json({ deletedCount });
        } catch (error) {
            console.error("Could not clean up expired payment slips:", error);
            return Response.json({ error: "Could not clean up expired slips" }, { status: 500 });
        }
    })
};
