import React from 'react';
import './DataTable.css'; // Import file CSS cho bảng này

/**
 * Component DataTable để hiển thị dữ liệu dạng bảng.
 *
 * @param {Object} props - Các props của component.
 * @param {Array<Object>} props.data - Mảng dữ liệu để hiển thị trong bảng.
 * Mỗi object trong mảng là một hàng dữ liệu.
 * @param {Array<Object>} props.columns - Định nghĩa các cột của bảng.
 * Mỗi object trong mảng có các thuộc tính:
 * - header: String, tiêu đề hiển thị của cột.
 * - accessor: String, tên thuộc tính trong object data để lấy giá trị cho cột đó.
 * - render (tùy chọn): Function, hàm để tùy chỉnh cách hiển thị dữ liệu của cột.
 * Nhận vào toàn bộ object hàng (row) làm đối số.
 */
const DataTable = ({ data, columns }) => {
  // Kiểm tra nếu không có dữ liệu hoặc dữ liệu rỗng
  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty">
        <p>Không có dữ liệu để hiển thị.</p>
      </div>
    );
  }

  // Kiểm tra nếu không có định nghĩa cột
  if (!columns || columns.length === 0) {
    console.warn("DataTable: Không có định nghĩa cột (columns) được cung cấp.");
    return (
      <div className="data-table-empty">
        <p>Bảng không có cấu hình cột.</p>
      </div>
    );
  }

  return (
    <div className="data-table-container"> {/* Thêm container để dễ quản lý overflow */}
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              // Sử dụng col.accessor làm key nếu nó duy nhất, nếu không dùng index
              // col.header là văn bản hiển thị cho tiêu đề cột
              <th key={col.accessor || index}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            // Sử dụng row.id làm key nếu có ID duy nhất, nếu không dùng rowIndex
            <tr key={row.id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={col.accessor ? `${row.id}-${col.accessor}` : colIndex}>
                  {/* Kiểm tra nếu cột có hàm render tùy chỉnh (col.render)
                      Nếu có, gọi hàm render với toàn bộ đối tượng hàng (row)
                      Nếu không, truy cập giá trị trực tiếp bằng col.accessor (ví dụ: row.name)
                  */}
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