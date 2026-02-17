import { ReactNode } from 'react';

interface Column<T> {
    header: string;
    render: (item: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
}

export default function DataTable<T>({ columns, data, emptyMessage }: DataTableProps<T>) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className={`p-4 text-[11px] font-black uppercase tracking-widest text-slate-400 ${col.className || ''}`}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? (
                            data.map((item, ri) => (
                                <tr key={ri} className="group hover:bg-slate-50/50 transition-colors">
                                    {columns.map((col, ci) => (
                                        <td key={ci} className={`p-4 align-middle ${col.className || ''}`}>
                                            {col.render(item)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="p-12 text-center text-slate-400 font-medium italic">
                                    {emptyMessage || 'No records found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}