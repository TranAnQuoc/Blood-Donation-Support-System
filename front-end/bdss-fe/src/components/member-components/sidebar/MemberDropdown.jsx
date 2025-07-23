import React, { useState } from "react";
import styles from "../sidebar/MemberDropdown.module.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/features/userSlice";
import { useNavigate } from "react-router-dom";

const MemberDropdown = () => {
  const [open, setOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate("/login");
  };

  return (
    <div className={styles.dropdown}>
      <div className={styles.avatar} onClick={toggleDropdown}>
        <img
          src="/default-avatar.jpg"
          alt="User Avatar"
          className={styles.avatarImg}
        />
        <span className={styles.username}>{user?.fullName || "Member"}</span>
      </div>

      {open && (
        <div className={styles.menu}>
          <button onClick={() => navigate("/member/member-profile")}>Hồ sơ</button>
          <button onClick={handleLogout}>Đăng xuất</button>
        </div>
      )}
    </div>
  );
};

export default MemberDropdown;
