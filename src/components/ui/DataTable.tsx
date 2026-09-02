import type { ReactNode } from "react";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = "Nothing here yet.",
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-ink/15 bg-white px-6 py-12 text-center text-sm text-brand-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-brand-ink/10 bg-brand-light/40">
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-deep"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-ink/8">
          {rows.map((row) => (
            <tr key={rowKey(row)} className="transition-colors hover:bg-brand-light/20">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3.5 align-middle ${col.className ?? ""}`}>
                  {col.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
