import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // File CSS cho Modal (tạo mới bên dưới)

const Modal = ({ onClose, children }) => {
    useEffect(() => {
        // Ngăn cuộn trang khi modal mở
        document.body.style.overflow = 'hidden';
        return () => {
            // Cho phép cuộn trang khi modal đóng
            document.body.style.overflow = 'unset';
        };
    }, []);

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root') // Đảm bảo có div#modal-root trong index.html của bạn
    );
};

export default Modal;