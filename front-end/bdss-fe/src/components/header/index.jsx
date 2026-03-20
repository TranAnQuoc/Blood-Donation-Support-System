import React, { useState } from "react";
import styles from "./index.module.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import MemberDropdown from "../member-components/sidebar/MemberDropdown";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state) => state.user);
    const isAuthenticated = !!user;


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoArea}>
                <img src={logo} alt="Save a Life - Donate Blood" className={styles.logoImage} />
                <div className={styles.logoText}>
                    <p>SAVE A LIFE</p>
                    <p>DONATE BLOOD</p>
                </div>
            </div>

            <div className={styles.hamburger} onClick={toggleMenu}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </div>

            <div className={`${styles.mainNav} ${menuOpen ? styles.open : ""}`}>
                <nav>
                    <ul>
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member" onClick={closeMenu}>TRANG CHỦ</Link></li>
                        ) : (
                            <li><Link to="/" onClick={closeMenu}>TRANG CHỦ</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/member-service" onClick={closeMenu}>DỊCH VỤ</Link></li>
                        ) : (
                            <li><Link to="/service" onClick={closeMenu}>DỊCH VỤ</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/emergency" onClick={closeMenu}>KHẨN CẤP</Link></li>
                        ) : (
                            <li><Link to="/emergency" onClick={closeMenu}>KHẨN CẤP</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/community" onClick={closeMenu}>CỘNG ĐỒNG</Link></li>
                        ) : (
                            <li><Link to="/community" onClick={closeMenu}>CỘNG ĐỒNG</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member/about-us" onClick={closeMenu}>VỀ CHÚNG TÔI</Link></li>
                        ) : (
                            <li><Link to="/about-us" onClick={closeMenu}>VỀ CHÚNG TÔI</Link></li>
                        )}
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <div className={styles.dropdownWrapper}>
                                <MemberDropdown />
                            </div>
                        ) : (
                            <li><Link to="/login" onClick={closeMenu}>ĐĂNG NHẬP</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
