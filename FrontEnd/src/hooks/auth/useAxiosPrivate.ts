import { axiosPrivate } from '../../api/axios/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';
import useLogout from '../../api/auth/useLogout';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { logout, isLoading, isSuccess } = useLogout();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuth((prevAuth) => ({ ...prevAuth, accessToken: token }));
    }
  }, [setAuth]);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error?.response?.status === 403 ||
            error?.response?.status === 401) &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          try {
            console.log('refresh token');
            const newAccessToken = await refresh();
            localStorage.setItem('access_token', newAccessToken);
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            setAuth({});
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
