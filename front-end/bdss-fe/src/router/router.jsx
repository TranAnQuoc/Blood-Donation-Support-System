import { createBrowserRouter, Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute.jsx";

//LAYOUT
import Layout from "../layouts/Layout.jsx";
import LayoutAdmin from "../layouts/LayoutAdmin.jsx";
import LayoutStaff from "../layouts/LayoutStaff.jsx";

//AUTH
import LoginForm from "../components/authen-form/LoginForm/LoginForm.jsx";
import RegisterForm from "../components/authen-form/RegisterForm/RegisterForm.jsx";
import ForgotPassword from "../components/authen-form/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "../components/authen-form/ResetPassword/ResetPassword.jsx";

//GUEST
import GuestDashboard from "../pages/Home/GuestDashboard.jsx";
import GuestService from "../pages/Service/GuestService.jsx";
import SearchMatchBlood from "../components/common/SearchMatchBlood/SearchMatchBlood.jsx";//ALSO GUEST
import EmergencyRequestLookup from "../components/common/EmergencyRequestLookup/EmergencyRequestLookup.jsx";

//MEMBER
import Community from "../pages/Community/CommonCommunity.jsx"; //ALSO GUEST
import AboutUs from "../pages/AboutUs/CommonAboutUs.jsx"; //ALSO GUEST
import MemberDashboard from "../pages/Home/MemberDashboard.jsx";
import MemberService from "../pages/Service/MemberService.jsx";
import MemberProfile from "../components/member-components/mainContent/MemberProfile";
import RegisterDonation from "../components/member-components/features/RegisterDonation/RegisterDonation.jsx";
import MyDonationRequest from "../components/member-components/features/MyDonationRequest/MyDonationRequest.jsx";
import MyDonationProcess from "../components/member-components/features/MyDonationProcess/index.jsx"
import MyDonationHistory from "../components/member-components/features/MyDonationHistory/MyDonationHistory.jsx";
import TransfusionRequest from "../components/member-components/features/TransfusionRequest/TransfusionRequest.jsx";
import EmergencyRequestForm from '../components/common/EmergencyRequestForm/EmergencyRequestForm.jsx';
import StatusDonationSetup from '../pages/Community/StatusDonationSetting.jsx'
import BloodTracking from "../components/member-components/features/BloodTracking/index.jsx"
import DonationSurvey from "../components/member-components/features/DonationSurvey/index.jsx"
import TransfusionRequestView from "../components/member-components/features/TransfusionRequestView/index.jsx"

//STAFF
import StaffDashboard from "../components/staff-components/features/StaffDashboard/StaffDashboard.jsx"
import StaffProfile from "../components/staff-components/mainContent/StaffProfile/StaffProfile.jsx";
import MemberList from "../components/staff-components/features/MemberList/MemberList.jsx";
import DonationRequestList from "../components/staff-components/features/DonationRequestList/DonationRequestList.jsx";
import DonationProcess from "../components/staff-components/features/DonationProcess/DonationProcess.jsx";
import DonationProcessDetail from "../components/staff-components/features/DonationProcessDetail/DonationProcessDetail.jsx";
import DonationHistoryList from "../components/staff-components/features/DonationHistoryList/DonationHistoryList.jsx";
import TransfusionRequestList from "../components/admin-components/features/TransfusionRequest/TransfusionRequest.jsx";
import TransfusionRequestDetail from "../components/staff-components/features/TransfusionRequestDetail/TransfusionRequestDetail.jsx";
import TransfusionProcess from "../components/staff-components/features/TransfusionProcess/TransfusionProcess.jsx";
import TransfusionHistoryList from "../components/staff-components/features/TransfusionHistoryList/TransfusionHistoryList.jsx";
import EmergencyTransfusionRequestList from "../components/staff-components/features/EmergencyTransfusionRequestList/EmergencyTransfusionRequestList.jsx";
import EmergencyTransfusionProcess from "../components/staff-components/features/EmergencyTransfusionProcess/EmergencyTransfusionProcess.jsx";
import EmergencyTransfusionHistory from "../components/staff-components/features/EmergencyTransfusionHistory/EmergencyTransfusionHistory.jsx"
import EventManagement from "../components/staff-components/features/EventManagement/EventManagement.jsx";
import BloodStorageStaff from "../components/staff-components/features/BloodStorage/view/BloodStorage.jsx";
import BloodStorageCreateForm from "../components/staff-components/features/BloodStorage/create/BloodStorageCreate.jsx"
import BloodStorageHistory from "../components/staff-components/features/BloodStorageHistory/index.jsx";
import EmergencyCallStaff from "../components/staff-components/features/EmergencyHotline/index.jsx"


//ADMIN
import AdminDashboard from "../components/admin-components/features/AdminDashboard/AdminDashboard.jsx"
import AdminProfile from "../components/admin-components/mainContent/AdminProfile/AdminProfile.jsx";
import AdminList from "../components/admin-components/features/UserManagement/AdminList.jsx";
import StaffList from "../components/admin-components/features/UserManagement/StaffList.jsx";
import MemberListForAdmin from "../components/admin-components/features/UserManagement/MemberListForAdmin.jsx";
import CreateAccountForm from "../components/admin-components/features/UserManagement/CreateAccountForm.jsx";
import DonationRequestListAdmin from "../components/admin-components/features/DonationRequest/DonationRequest.jsx"
import DonationProcessAdmin from "../components/admin-components/features/DonationProcess/DonationProcess.jsx"
// import DonationHistory from "../components/admin-components/features/DonationHistory/..."
// import TransfusionRequest from "../components/admin-components/features/TransfusionRequest/..."
// import TransfusionProcess from "../components/admin-components/features/TransfusionProcess/..."
// import TransfusionHistory from "../components/admin-components/features/TransfusionHistory/..."
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."
// import DonationRequest from "../components/admin-components/features/DonationRequest/..."
import EventListAdmin from "../components/admin-components/features/EventListAdmin/EventListAdmin.jsx"
import BloodStorageAdmin from "../components/admin-components/features/BloodStorage/view/BloodStorage.jsx";
import BloodStorageHistoryAdmin from "../components/admin-components/features/BloodStorageHistory/index.jsx";
import EmergencyTransfusionProcessAdmin from "../components/admin-components/features/EmergencyTransfusionProcess/EmergencyTransfusionProcess.jsx"
import EmergencyTransfusionHistoryListAdmin from "../components/admin-components/features/EmergencyTransfusionHistory/EmergencyTransfusionHistory.jsx"
import EmergencyCall from "../components/admin-components/features/EmergencyHotline/index.jsx"


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
      //AUTH
      { path: "login", element: <LoginForm /> },
      { path: "register", element: <RegisterForm /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      //GUEST SERVICE
      { path: "service", element: <GuestService /> },
      { path: "emergency", element: <EmergencyRequestForm /> },
      { path: "community", element: <Community /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "SearchMatchBlood", element: <SearchMatchBlood /> },
      { path: "emergency-lookup", element: <EmergencyRequestLookup />},
    ],
  },

  {
    path: "/admin-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <LayoutAdmin />
      </ProtectedRoute>
    ),
    children: [
      //Admin Dashboard
      { index: true, element: <AdminDashboard /> },

      //ADMIN CUSTOME
      { path: "admin-profile", element: <AdminProfile /> },
      { path: "settings", element: <div>Admin Settings Page</div> },

      //User Management
      { path: "user-management/create-account", element: <CreateAccountForm /> },
      { path: "user-management/admin-list", element: <AdminList /> },
      { path: "user-management/staff-list", element: <StaffList /> },
      { path: "user-management/member-list", element: <MemberListForAdmin /> },
      //Donation
      { path: "donation-requests", element: <DonationRequestListAdmin /> },
      { path: "donation-processes", element: <DonationProcessAdmin /> },
      { path: "donation-histories", element: <DonationHistoryList /> },
      //Transfusion
      { path: "transfusion-requests-management", element: <TransfusionRequestList /> },
      { path: "transfusion-requests-management/:id",element: <TransfusionRequestDetail /> },
      { path: "transfusion-processes", element: <TransfusionProcess /> },
      
      // { path: "transfusion-histories", element: <TransfusionHistory /> },

      // Emergency Transfusion
      { path: "emergency-transfusion-processes",element: <EmergencyTransfusionProcessAdmin /> },
      { path: "emergency-histories", element: <EmergencyTransfusionHistoryListAdmin /> },

      //BloodStorage
      { path: "blood-storage", element: <BloodStorageAdmin /> },
      { path: "blood-storage-history", element: <BloodStorageHistoryAdmin /> },

      //OTHER
      { path: "event-list-admin", element: <EventListAdmin /> },
      { path: "emergencyCall", element: <EmergencyCall /> },
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
        <LayoutStaff />
      </ProtectedRoute>
    ),
    children: [
      //STAFF DASHBOARD
      { index: true, element: <StaffDashboard /> },

      //STAFF CUSTOME
      { path: "staff-profile", element: <StaffProfile/> },
      // { path: "staff-setting", element: <StaffSetting/> },

      //Donation
      { path: "donation-requests", element: <DonationRequestList /> },
      { path: "donation-processes", element: <DonationProcess /> },
      { path: "donation-processes/:id", element: <DonationProcessDetail /> },
      { path: "donation-histories", element: <DonationHistoryList /> },
      //Transfusion
      { path: "transfusion-requests-management", element: <TransfusionRequestList /> },
      { path: "transfusion-requests-management/:id", element: <TransfusionRequestDetail /> },
      { path: "transfusion-processes", element: <TransfusionProcess /> },
      // { path: "transfusion-histories", element: <TransfusionHistory /> },

      //Emergency Transfusion
      { path: "emergency-transfusion-requests",element: <EmergencyTransfusionRequestList /> },
      { path: "emergency-transfusion-processes",element: <EmergencyTransfusionProcess /> },
      { path: "emergency-histories", element: <EmergencyTransfusionHistory /> },

      //BloodStorage
      { path: "blood-storage", element: <BloodStorageStaff /> },
      { path: "blood-storage/create", element: <BloodStorageCreateForm /> },
      { path: "blood-storage-history", element: <BloodStorageHistory/> },

      //OTHER
      { path: "member-list", element: <MemberList /> },
      { path: "event-management", element: <EventManagement /> },
      { path: "emergencyCall", element: <EmergencyCallStaff /> },
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
      { path: "community", element: (
        <>
          <StatusDonationSetup />
          <Community />
        </>
      ), },
      { path: "about-us", element: <AboutUs /> },
      //SERVICE
      { path: "member-service", element: <MemberService /> },
      { path: "my-donation-request", element: <MyDonationRequest /> },
      { path: "donate/survey/:scheduleId", element: <DonationSurvey /> },
      { path: "my-donation-process", element: <MyDonationProcess /> },
      { path: "my-donation-history", element: <MyDonationHistory /> },
      { path: "emergency", element: <EmergencyRequestForm /> },
      { path: "blood-tracking", element: <BloodTracking /> },
      
      //CONTENT
      // { path: "about-us", element: <About Us /> },
      { path: "register-donation", element: <RegisterDonation /> },
      { path: "request-transfusion", element: <TransfusionRequest /> },
      { path: "request-transfusion-view", element: <TransfusionRequestView /> },
      { path: "SearchMatchBlood", element: <SearchMatchBlood /> },
    ],
  },
]);

export default router;
