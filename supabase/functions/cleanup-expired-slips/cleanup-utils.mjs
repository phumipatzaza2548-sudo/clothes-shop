export function getExpiredSlipPaths(files, now = Date.now(), retentionMs, activePaths = []) {
    const cutoff = now - retentionMs;
    const active = new Set(activePaths);

    return files.flatMap((file) => {
        const createdAt = Date.parse(file?.created_at || "");
        if (!file?.path || active.has(file.path) || !Number.isFinite(createdAt) || createdAt > cutoff) {
            return [];
        }
        return [file.path];
    });
}
