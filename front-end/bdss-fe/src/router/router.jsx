import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from '../layouts/Layout.jsx';
import LayoutAdmin from '../layouts/LayoutAdmin.jsx';
import LayoutStaff from '../layouts/LayoutStaff.jsx';
import LoginForm from '../components/authen-form/LoginForm.jsx';
import RegisterForm from '../components/authen-form/RegisterForm.jsx';
import ProtectedRoute from '../components/ProtectedRoute';
import RegisterDonation from '../components/member-features/RegisterDonation';
import MemberDashboard from '../pages/MemberDashboard.jsx';


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
      // các route con của staff
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