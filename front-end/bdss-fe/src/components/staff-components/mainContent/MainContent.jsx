// src/components/MainContent/MainContent.jsx
import React from 'react';
import ContentHeader from './ContentHeader';
import NotificationIcon from './NotificationIcon';

import styles from './MainContent.module.css';
import DonationRequestList from './DonationRequestList';
import TransfusionRequestList from './TransfusionRequestList';
import EmergencyTransfusionRequestList from './EmergencyTransfusionRequestList';
import StaffList from './StaffList';
import MemberList from './MemberList';

import DonationProcess from './DonationProcess';
import TransfusionProcess from './TransfusionProcess';
import EmergencyTransfusionProcess from './EmergencyTransfusionProcess';
import DonationHistoryList from './DonationHistoryList';
import TransfusionHistoryList from './TransfusionHistoryList';
import RegistrationList from './RegistrationList';
import ScheduleManagement from './ScheduleManagement';

const MainContent = ({ activePage }) => {
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <div>Nội dung Trang chủ Staff (Dashboard)</div>;
      case 'user-staff-list':
        return <StaffList />;
      case 'user-member-list':
        return <MemberList />;
      case 'request-donation':
        return <DonationRequestList />;
      case 'request-transfusion':
        return <TransfusionRequestList />;
      case 'request-emergency-transfusion':
        return <EmergencyTransfusionRequestList />;
      // New: Process Pages
      case 'process-donation':
        return <DonationProcess />;
      case 'process-transfusion':
        return <TransfusionProcess />;
      case 'process-emergency-transfusion':
        return <EmergencyTransfusionProcess />;
      // New: History Pages
      case 'history-donations':
        return <DonationHistoryList />;
      case 'history-transfusions':
        return <TransfusionHistoryList />;
      // New: Registration List Page
      case 'registrationList': // <-- Case cho Đơn Đăng Ký
        return <RegistrationList />;
      case 'scheduleManagement':
          return <ScheduleManagement />;
      case 'bloodStock':
        return <div>Nội dung Kho Máu Staff</div>;
      case 'interFacilityCoordination':
        return <div>Nội dung Điều Phối Liên Cơ Sở Staff</div>;
      case 'donationStatus':
        return <div>Nội dung Trạng Thái Hiến Máu Staff</div>;
      case 'notifications':
        return <div>Nội dung Thông Báo Staff</div>;
      case 'recoveryReminders':
        return <div>Nội dung Nhắc Nhờ Hồi Phục Staff</div>;
      case 'communityPosts':
        return <div>Nội dung Bài Viết Cộng Đồng Staff</div>;
      case 'reports':
        return <div>Nội dung Báo Cáo Staff</div>;
      case 'supportCenter':
        return <div>Nội dung Trung Tâm Hỗ Trợ Staff</div>;
      default:
        return <div>Chào mừng Staff đến với Dashboard. Vui lòng chọn một mục từ menu bên trái.</div>;
    }
  };

  return (
    <div className={styles.mainContent}>
      <ContentHeader />
      <div className={styles.contentArea}>
        {renderPage()} {/* Hiển thị nội dung của trang hiện tại */}
      </div>
    </div>
  );
};

export default MainContent;