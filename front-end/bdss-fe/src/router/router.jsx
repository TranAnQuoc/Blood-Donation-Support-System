import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from '../layouts/Layout.jsx';
import LayoutAdmin from '../layouts/LayoutAdmin.jsx';
import LayoutStaff from '../layouts/LayoutStaff.jsx';
import LoginForm from '../components/authen-form/LoginForm.jsx';
import RegisterForm from '../components/authen-form/RegisterForm.jsx';
import ProtectedRoute from '../components/ProtectedRoute';
import RegisterDonation from '../components/member-features/RegisterDonation';
import MemberDashboard from '../pages/MemberDashboard.jsx';
import DonationRequestList from '../components/staff-components/mainContent/DonationRequestList';
import DonationProcess from '../components/staff-components/mainContent/DonationProcess';
import DonationHistoryList from '../components/staff-components/mainContent/DonationHistoryList';



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
      { path: "register", element: <RegisterForm /> }
    ]
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
    ]
  },
  {
    path: "/staff",
    element: (
      <ProtectedRoute allowedRoles={["STAFF"]}>
        <LayoutStaff>
          <Outlet />
        </LayoutStaff>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <div>Trang chủ Bảng điều khiển Staff</div> },
            { path: 'donation-requests', element: <DonationRequestList /> },
            { path: 'donation-processes', element: <DonationProcess /> },
+           { path: 'donation-histories', element: <DonationHistoryList /> },
    ]
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
    ]
  }
]);

export default router;