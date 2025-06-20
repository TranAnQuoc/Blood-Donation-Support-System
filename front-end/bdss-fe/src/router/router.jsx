import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
//Layout
import Layout from "../layouts/Layout.jsx";
import LayoutAdmin from "../layouts/LayoutAdmin.jsx";
import LayoutStaff from "../layouts/LayoutStaff.jsx";

//Auth
import LoginForm from "../components/authen-form/LoginForm.jsx";
import RegisterForm from "../components/authen-form/RegisterForm.jsx";

//MEMBER
import RegisterDonation from "../components/member-components/features/RegisterDonation";
import MemberDashboard from "../pages/MemberDashboard.jsx";
import Profile from "../components/member-components/mainContent/Profile";
import TransfusionRequest from "../components/member-components/features/TransfusionRequest/TransfusionRequest.jsx";

//STAFF
import DonationRequestList from "../components/staff-components/features/DonationRequestList/DonationRequestList.jsx";
import DonationProcess from "../components/staff-components/features/DonationProcess/DonationProcess.jsx";
import DonationHistoryList from "../components/staff-components/features/DonationHistoryList/DonationHistoryList.jsx";

import TransfusionRequestList from "../components/staff-components/features/TransfusionRequestList/TransfusionRequestList.jsx";
import TransfusionRequestDetail from "../components/staff-components/features/TransfusionRequestDetail/TransfusionRequestDetail.jsx";

import TransfusionProcess from "../components/staff-components/features/TransfusionProcess/TransfusionProcess.jsx";
import EmergencyTransfusionRequestList from "../components/staff-components/features/EmergencyTransfusionRequestList/EmergencyTransfusionRequestList.jsx";
import EmergencyTransfusionProcess from "../components/staff-components/features/EmergencyTransfusionProcess/EmergencyTransfusionProcess.jsx";
import TransfusionHistoryList from "../components/staff-components/features/TransfusionHistoryList/TransfusionHistoryList.jsx";
import StaffList from "../components/staff-components/features/UserManagement/StaffList.jsx";
import MemberList from "../components/staff-components/features/UserManagement/MemberList.jsx";
import ScheduleManagement from "../components/staff-components/features/ScheduleManagement/ScheduleManagement.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <LayoutAdmin>
          <Outlet />
        </LayoutAdmin>
      </ProtectedRoute>
    ),
    children: [
      // các route con của admin
    ],
  },

  {
    path: "/staff-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["STAFF"]}>
        <LayoutStaff />
      </ProtectedRoute>
    ),
    children: [
      //staff dropdown
      { path: "profile", element: <div>Staff Profile Page</div> },
      { path: "settings", element: <div>Staff Settings Page</div> },

      { index: true, element: <div>Trang chủ Bảng điều khiển Staff</div> },

      //left panel navigate
      // NHẮC NHỞ: Thay thế các <div> bằng các Component thực tế của bạn khi đã tạo
      { path: "registration-list", element: <div>Đơn Đăng Ký</div> },
      //{ path: "schedule-management",element: <div>Quản Lý Lịch Hiến Máu</div> },
      { path: "blood-stock", element: <div>Kho Máu</div> },
      { path: "inter-facility-coordination",element: <div>Điều Phối Liên Cơ Sở</div> },
      { path: "donation-status", element: <div>Trạng Thái Hiến Máu</div> },
      { path: "notifications", element: <div>Thông Báo</div> },
      { path: "recovery-reminders", element: <div>Nhắc Nhở Hồi Phục</div> },
      { path: "community-posts", element: <div>Bài Viết Cộng Đồng</div> },
      { path: "reports", element: <div>Báo Cáo</div> },
      { path: "support-center", element: <div>Trung Tâm Hỗ Trợ</div> },

      //dropdown
      {path: "emergency-transfusion-requests",element: <EmergencyTransfusionRequestList /> },

      // PROCESS DROPDOWN
      { path: "transfusion-processes", element: <TransfusionProcess /> },
      {path: "emergency-transfusion-processes",element: <EmergencyTransfusionProcess /> },

      // HISTORY DROPDOWN
      { path: "transfusion-histories", element: <TransfusionHistoryList /> },

      //user management dropdown
      { path: "user-management/staff-list", element: <StaffList /> },
      { path: "user-management/member-list", element: <MemberList /> },

      //các tính năng
      //donation
      { path: "donation-requests", element: <DonationRequestList /> },
      { path: "donation-processes", element: <DonationProcess /> },
      { path: "donation-histories", element: <DonationHistoryList /> },
      //transfusion
      { path: "transfusion-requests-management", element: <TransfusionRequestList /> },
      { path: "transfusion-requests-management/:id", element: <TransfusionRequestDetail /> },
      //schedule
      { path: "schedule-management", element: <ScheduleManagement/>}
      //emergency
      

    ],
  },

  {
    path: "/member",
    element: (
      <ProtectedRoute allowedRoles={["MEMBER"]}>
        <Layout>
          <Outlet />
        </Layout>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MemberDashboard /> },
      { path: "register-donation", element: <RegisterDonation /> },
      { path: "profile", element: <Profile /> },
      { path: "request-transfusion", element: <TransfusionRequest /> },
    ],
  },
]);

export default router;