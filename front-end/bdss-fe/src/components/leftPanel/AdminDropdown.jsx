// src/components/LeftPanel/AdminDropdown.jsx
import React, { useState } from 'react';
import styles from './AdminDropdown.module.css';
import { FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Ví dụ dùng react-icons

const AdminDropdown = ({ adminName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.adminDropdown}>
      <div className={styles.dropdownToggle} onClick={toggleDropdown}>
        <FaUserCircle className={styles.userIcon} />
        <span className = {styles.adminName}>Admin: {adminName}</span>
        {isOpen ? <FaChevronUp className={styles.arrowIcon} /> : <FaChevronDown className={styles.arrowIcon} />}
      </div>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li className={styles.dropdownMenuItem}>Profile</li>
          <li className={styles.dropdownMenuItem}>Settings</li>
          <li className={styles.dropdownMenuItem}>Logout</li>
        </ul>
      )}
    </div>
  );
};

export default AdminDropdown;