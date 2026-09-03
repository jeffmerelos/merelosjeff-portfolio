import React from 'react';

export interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  loading?: boolean;
  emptyMessage?: string;
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="cyber-spinner w-12 h-12 border-4" />
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-cyber-text-muted text-lg">{emptyMessage}</div>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto cyber-scrollbar">
      <table className="cyber-table min-w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-text-secondary uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cyber-border">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`
                transition-all duration-200
                hover:bg-cyber-cyan/5
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 text-sm text-cyber-text-primary"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
