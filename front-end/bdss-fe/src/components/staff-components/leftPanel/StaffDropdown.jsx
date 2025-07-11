import React, { useState } from 'react';
import styles from './StaffDropdown.module.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
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

    return (
        <div className={styles.staffDropdown}>
            <div className={styles.dropdownToggle} onClick={toggleDropdown}>
                <span className={styles.staffName}>Staff: {user?.fullName || "Staff"}</span>
                {isOpen ? <FaChevronUp className={styles.arrowIcon} /> : <FaChevronDown className={styles.arrowIcon} />}
            </div>
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    <li className={styles.dropdownMenuItem} onClick={() => navigate("/staff-dashboard/staff-profile")}>Profile</li>
                    <li className={styles.dropdownMenuItem} onClick={handleLogout}>Logout</li>
                </ul>
            )}
        </div>
    );
};

export default StaffDropdown;