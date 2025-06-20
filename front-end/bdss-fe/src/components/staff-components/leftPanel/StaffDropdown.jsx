import React, { useState } from 'react';
import styles from './StaffDropdown.module.css';
import { FaUserCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/userSlice';
import { useNavigate } from 'react-router-dom';

const StaffDropdown = () => {
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

    const handleProfileClick = () => {
        setIsOpen(false);
        navigate("/staff-dashboard/profile");
    };

    const handleSettingsClick = () => {
        setIsOpen(false);
        navigate("/staff-dashboard/settings");
    };

    return (
        <div className={styles.StaffDropdown}>
            <div className={styles.dropdownToggle} onClick={toggleDropdown}>
                <FaUserCircle className={styles.userIcon} />
                <span className={styles.StaffName}>Staff: {user?.fullName || "Staff"}</span>
                {isOpen ? <FaChevronUp className={styles.arrowIcon} /> : <FaChevronDown className={styles.arrowIcon} />}
            </div>
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    <li className={styles.dropdownMenuItem} onClick={handleProfileClick}>Profile</li>
                    <li className={styles.dropdownMenuItem} onClick={handleSettingsClick}>Settings</li>
                    <li className={styles.dropdownMenuItem} onClick={handleLogout}>Logout</li>
                </ul>
            )}
        </div>
    );
};

export default StaffDropdown;