import React from 'react';
import styles from './DataTable.module.css';

/**
 * Component DataTable để hiển thị dữ liệu dạng bảng.
 *
 * @param {Object} props - Các props của component.
 * @param {Array<Object>} props.data - Mảng dữ liệu để hiển thị trong bảng.
 * @param {Array<Object>} props.columns - Mảng định nghĩa cột, gồm { header, accessor, render? }
 */
const DataTable = ({ data, columns }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.dataTableEmpty}>
        <p>Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    console.warn("DataTable: Không có định nghĩa cột (columns) được cung cấp.");
    return (
      <div className={styles.dataTableEmpty}>
        <p>Bảng không có cấu hình cột.</p>
      </div>
    );
  }

  return (
    <div className={styles.dataTableContainer}>
      <table className={styles.dataTable}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={col.accessor || index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td
                  key={col.accessor ? `${row.id || rowIndex}-${col.accessor}` : colIndex}
                  data-label={col.header}
                >
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
