import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute.jsx";

//PUPLIC
import EmergencyRequestForm from '../components/common/emergency-request/index.jsx';

//LAYOUT
import Layout from "../layouts/Layout.jsx";
import LayoutAdmin from "../layouts/LayoutAdmin.jsx";
import LayoutStaff from "../layouts/LayoutStaff.jsx";

//AUTH
import LoginForm from "../components/authen-form/LoginForm.jsx";
import RegisterForm from "../components/authen-form/RegisterForm.jsx";

//GUEST
import GuestDashboard from "../pages/Home/GuestDashboard.jsx";
import GuestService from "../pages/Service/GuestService.jsx";

//MEMBER
import MemberDashboard from "../pages/Home/MemberDashboard.jsx";
import MemberService from "../pages/Service/MemberService.jsx";
import MemberProfile from "../components/member-components/mainContent/MemberProfile";
import RegisterDonation from "../components/member-components/features/RegisterDonation/RegisterDonation.jsx";
import MyDonationRequest from "../components/member-components/features/MyDonationRequest/MyDonationRequest.jsx";
import MyDonationHistory from "../components/member-components/features/MyDonationHistory/MyDonationHistory.jsx";
import TransfusionRequest from "../components/member-components/features/TransfusionRequest/TransfusionRequest.jsx";

//STAFF
import MemberList from "../components/staff-components/features/MemberList/MemberList.jsx";
import DonationRequestList from "../components/staff-components/features/DonationRequestList/DonationRequestList.jsx";
import DonationProcess from "../components/staff-components/features/DonationProcess/DonationProcess.jsx";
import DonationProcessDetail from "../components/staff-components/features/DonationProcessDetail/DonationProcessDetail.jsx";
import DonationHistoryList from "../components/staff-components/features/DonationHistoryList/DonationHistoryList.jsx";
import TransfusionRequestList from "../components/staff-components/features/TransfusionRequestList/TransfusionRequestList.jsx";
import TransfusionRequestDetail from "../components/staff-components/features/TransfusionRequestDetail/TransfusionRequestDetail.jsx";
import TransfusionProcess from "../components/staff-components/features/TransfusionProcess/TransfusionProcess.jsx";
import TransfusionHistoryList from "../components/staff-components/features/TransfusionHistoryList/TransfusionHistoryList.jsx";
import EmergencyTransfusionRequestList from "../components/staff-components/features/EmergencyTransfusionRequestList/EmergencyTransfusionRequestList.jsx";
import EmergencyTransfusionProcess from "../components/staff-components/features/EmergencyTransfusionProcess/EmergencyTransfusionProcess.jsx";
import EventManagement from "../components/staff-components/features/EventManagement/EventManagement.jsx";

//ADMIN
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."
// import DonationProcess from "../components/admin-components/features/DonationProcess/..."
// import DonationHistory from "../components/admin-components/features/DonationHistory/..."
// import TransfusionRequest from "../components/admin-components/features/TransfusionRequest/..."
// import TransfusionProcess from "../components/admin-components/features/TransfusionProcess/..."
// import TransfusionHistory from "../components/admin-components/features/TransfusionHistory/..."
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Layout>
          <Outlet />
        </Layout>
      </PublicRoute>
      
    ),
    children: [
      { index: true, element: <GuestDashboard /> },
      //GUEST SERVICE
      { path: "service", element: <GuestService /> },
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "emergency", element: <EmergencyRequestForm /> },
      
    ],
  },

  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <LayoutAdmin/>
      </ProtectedRoute>
    ),
    children: [
      //Home Page Dashboard Admin
      { index: true, element: <div>Trang chủ Bảng điều khiển Admin</div> },

      //ADMIN CUSTOME
      { path: "profile", element: <div>Admin Profile Page</div>},
      { path: "settings", element: <div>Admin Settings Page</div> },

      //NAVIGATE
      //NAVIGATE
      //User Management
      // { path: "user-management/staff-list", element: <StaffList /> },
      { path: "user-management/member-list", element: <MemberList /> },
      //Donation
      { path: "donation-requests", element: <DonationRequestList /> },
      { path: "donation-processes", element: <DonationProcess /> },
      { path: "donation-histories", element: <DonationHistoryList /> },
      //Transfusion
      { path: "transfusion-requests-management", element: <TransfusionRequestList /> },
      { path: "transfusion-requests-management/:id", element: <TransfusionRequestDetail /> },
      { path: "transfusion-processes", element: <TransfusionProcess /> },
      // { path: "transfusion-histories", element: <TransfusionHistory /> },

      //Emergency Transfusion
      // { path: "emergency-transfusion-requests",element: <EmergencyTransfusionRequestList /> },
      // { path: "emergency-transfusion-processes",element: <EmergencyTransfusionProcess /> },
      // { path: "transfusion-histories", element: <TransfusionHistoryList /> },

      //OTHER
      { path: "event-management", element: <EventManagement/>},
      // { path: "blood-bank", element: <BloodBank/> },
      // { path: "recovery-reminders", element: <RecoveryReminder/> },
      // { path: "community-posts", element: <CommunityPost/> },
      // { path: "reports", element: <Report/> },
      // { path: "support-center", element: <SupportCenter/> },

    ],
  },

  {
    path: "/staff-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["STAFF"]}>
        <LayoutStaff/>
      </ProtectedRoute>
    ),
    children: [
      //HOME PAGE STAFF DASHBOARD
      { index: true, element: <div>Trang chủ Bảng điều khiển Staff</div> },

      //STAFF CUSTOME
      // { path: "staff-profile", element: <StaffProfile/> },
      // { path: "staff-setting", element: <StaffSetting/> },

      //NAVIGATE
      
      //Donation
      { path: "donation-requests", element: <DonationRequestList /> },
      { path: "donation-processes", element: <DonationProcess /> },
      { path: "donation-process/:id", element: <DonationProcessDetail />},
      { path: "donation-histories", element: <DonationHistoryList /> },
      //Transfusion
      { path: "transfusion-requests-management", element: <TransfusionRequestList /> },
      { path: "transfusion-requests-management/:id", element: <TransfusionRequestDetail /> },
      { path: "transfusion-processes", element: <TransfusionProcess /> },
      // { path: "transfusion-histories", element: <TransfusionHistory /> },

      //Emergency Transfusion
      { path: "emergency-transfusion-requests",element: <EmergencyTransfusionRequestList /> },
      { path: "emergency-transfusion-processes",element: <EmergencyTransfusionProcess /> },
      // { path: "transfusion-histories", element: <TransfusionHistoryList /> },

      //OTHER
      { path: "member-list", element: <MemberList /> },
      { path: "event-management", element: <EventManagement/>},
      // { path: "blood-bank", element: <BloodBank/> },
      // { path: "recovery-reminders", element: <RecoveryReminder/> },
      // { path: "community-posts", element: <CommunityPost/> },
      // { path: "reports", element: <Report/> },
      // { path: "support-center", element: <SupportCenter/> },

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

      //MEMBER CUSTOME
      { path: "member-profile", element: <MemberProfile /> },
      //SERVICE
      { path: "member-service", element: <MemberService /> },
      { path: "my-donation-request", element: <MyDonationRequest/> },
      { path: "my-donation-history", element: <MyDonationHistory/> },
      //CONTENT
      { path: "register-donation", element: <RegisterDonation /> },
      { path: "request-transfusion", element: <TransfusionRequest /> },
    ],
  },
]);

export default router;