import type { StoredRecord, TableName } from '../../db/store';

/** In-memory double of the store backend for DAL tests. */
export function createMemoryStore() {
  const tables = new Map<TableName, StoredRecord[]>();

  const rows = (table: TableName): StoredRecord[] => {
    if (!tables.has(table)) tables.set(table, []);
    return tables.get(table)!;
  };

  return {
    async upsert(table: TableName, record: StoredRecord) {
      const list = rows(table);
      const idx = list.findIndex((r) => r.id === record.id);
      if (idx >= 0) list[idx] = record;
      else list.push(record);
    },
    async getById<T extends StoredRecord>(table: TableName, id: string) {
      return (rows(table).find((r) => r.id === id) as T) ?? null;
    },
    async listBetween<T extends StoredRecord>(table: TableName, startDate: string, endDate: string) {
      return rows(table)
        .filter((r) => r.logDate != null && r.logDate >= startDate && r.logDate <= endDate)
        .sort((a, b) => (a.logDate! < b.logDate! ? -1 : 1)) as T[];
    },
    async listAll<T extends StoredRecord>(table: TableName) {
      return [...rows(table)] as T[];
    },
    async listDirty<T extends StoredRecord>(table: TableName) {
      return rows(table).filter((r) => r.synced === 0) as T[];
    },
    async markSynced(table: TableName, ids: string[]) {
      const idSet = new Set(ids);
      for (const r of rows(table)) {
        if (idSet.has(r.id)) r.synced = 1;
      }
    },
    async clearAll() {
      tables.clear();
    },
  };
}
