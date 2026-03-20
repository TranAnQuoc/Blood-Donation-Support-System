import React from 'react';
import styles from './DataTableContainer.module.css';

const DataTableContainer = ({ children }) => {
  return (
    <div className={styles.dataTableContainer}>
      {children}
    </div>
  );
};

export default DataTableContainer;