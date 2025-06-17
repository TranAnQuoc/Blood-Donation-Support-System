import React, { useState } from "react";
import styles from "./index.module.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import MemberDropdown from "./MemberDropdown";
import { useSelector } from "react-redux";

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

            {/* Hamburger icon (sẽ được căn chỉnh riêng) */}
            <div className={styles.hamburger} onClick={toggleMenu}>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </div>

            {/* mainNav */}
            <div className={`${styles.mainNav} ${menuOpen ? styles.open : ""}`}>
                <nav>
                    <ul>
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <li><Link to="/member" onClick={closeMenu}>HOME</Link></li> // Nếu là member, HOME dẫn đến /member
                        ) : (
                            <li><Link to="/" onClick={closeMenu}>HOME</Link></li> // Nếu không, HOME dẫn đến /
                        )}
                        <li><Link to="/service" onClick={closeMenu}>SERVICE</Link></li>
                        <li><Link to="/emergency" onClick={closeMenu}>EMERGENCY</Link></li>
                        <li><Link to="/community" onClick={closeMenu}>COMMUNITY</Link></li>
                        <li><Link to="/about-us" onClick={closeMenu}>ABOUT US</Link></li>
                        <li><Link to="/blog" onClick={closeMenu}>BLOG</Link></li>
                        {isAuthenticated && user?.role === "MEMBER" ? (
                            <div className={styles.dropdownWrapper}>
                                <MemberDropdown />
                            </div>
                        ) : (
                            <li><Link to="/login" onClick={closeMenu}>LOGIN</Link></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
