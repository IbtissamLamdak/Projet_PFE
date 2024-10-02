import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/auth/useAuth';

type RequireAuthProps = {
  allowedRoles: Array<string>;
  children?: React.ReactNode;
};

const ProtectedRoute = ({ allowedRoles, children }: RequireAuthProps) => {
  const { auth } = useAuth();
  const location = useLocation();
  console.log('start');

  const isLoggedIn = !!auth?.accessToken;
  console.log(isLoggedIn);

  if (!isLoggedIn)
    return <Navigate to="/login" state={{ from: location }} replace />;
  console.log(auth);

  if (!auth.role)
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  console.log('mid');

  const userRole = auth.role;

  let isAuthorized = false;
  console.log('before loop');

  allowedRoles.forEach((role) => {
    if (role === userRole) isAuthorized = true;
  });
  console.log('after loop');

  console.log(isAuthorized);
  console.log(userRole);

  if (!isAuthorized)
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
