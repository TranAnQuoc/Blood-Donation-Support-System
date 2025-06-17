// src/components/LeftPanel/NavButton.jsx
import React from 'react';
import styles from './NavButton.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const NavButton = ({ icon, label, onClick, isActive, hasDropdown, isArrowUp }) => {
    return (
        <button
            className={`${styles.navButton} ${isActive ? styles.active : ''}`}
            onClick={onClick}
        >
            <div className={styles.iconContainer}>{icon}</div>
            <span className={styles.label}>{label}</span>
            {hasDropdown && ( // Chỉ hiển thị mũi tên nếu hasDropdown là true
                <FontAwesomeIcon
                    icon={isArrowUp ? faChevronUp : faChevronDown}
                    className={styles.arrowIcon}
                />
            )}
        </button>
    );
};

export default NavButton;