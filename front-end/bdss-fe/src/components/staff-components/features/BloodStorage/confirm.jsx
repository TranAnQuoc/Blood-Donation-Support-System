// components/ConfirmationModal.jsx
import React from 'react';
import styles from './confirm.module.css';

const ConfirmationModal = ({ message, onConfirm, onCancel, isProcessing }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <p className={styles.modalMessage}>{message}</p>
                <div className={styles.modalActions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={isProcessing}
                    >
                        Hủy
                    </button>
                    <button
                        className={styles.confirmButton}
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;