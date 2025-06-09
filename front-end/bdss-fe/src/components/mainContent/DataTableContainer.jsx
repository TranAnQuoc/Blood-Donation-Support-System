// src/components/MainContent/DataTableContainer.jsx (Ví dụ)
import React from 'react';
import styles from './DataTableContainer.module.css';

const DataTableContainer = ({ children }) => {
  return (
    <div className={styles.dataTableContainer}>
      {children} {/* Nơi các component bảng/danh sách con được render */}
    </div>
  );
};

export default DataTableContainer;