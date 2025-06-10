// src/components/LeftPanel/AdminDropdown.jsx
import React, { useState } from 'react';
import styles from './StaffDropdown.module.css';
import { FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Ví dụ dùng react-icons

const StaffDropdown = ({ StaffName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.StaffDropdown}>
      <div className={styles.dropdownToggle} onClick={toggleDropdown}>
        <FaUserCircle className={styles.userIcon} />
        <span className = {styles.StaffName}>Staff: {StaffName}</span>
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

export default StaffDropdown;