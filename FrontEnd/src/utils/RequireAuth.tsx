import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/auth/useAuth';

type RequireAuthProps = {
  allowedRoles: Array<string>;
  children?: React.ReactNode;
};

const RequireAuth: React.FC<RequireAuthProps> = ({
  allowedRoles,
  children,
}) => {
  const { auth } = useAuth();
  const location = useLocation();

  // const isAllowed = auth?.role && allowedRoles.includes(auth.role);
  const isLoggedIn = auth?.accessToken;

  // return isAllowed ? (
  //   <Outlet />
  // ) : auth?.accessToken ? (
  //   <Navigate to={'/unauthorized'} state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/login" state={{ from: location }} replace />
  // );

  return isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
