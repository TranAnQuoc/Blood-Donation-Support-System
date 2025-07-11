// src/components/LeftPanel/AdminDropdown.jsx
import React, { useState } from 'react';
import styles from './AdminDropdown.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';

const AdminDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/login");
    };

  return (
    <div className={styles.adminDropdown}>
      <div className={styles.dropdownToggle} onClick={toggleDropdown}>
        <span className={styles.adminName}>Admin: {user?.fullName || "Admin"}</span>
        {isOpen ? <FaChevronUp className={styles.arrowIcon} /> : <FaChevronDown className={styles.arrowIcon} />}
      </div>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          <li className={styles.dropdownMenuItem} onClick={() => navigate("/admin-dashboard/admin-profile")}>Profile</li>
          <li className={styles.dropdownMenuItem} onClick={handleLogout}>Logout</li>
        </ul>
      )}
    </div>
  );
};

export default AdminDropdown;