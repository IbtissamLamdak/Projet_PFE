import { useMutation } from '@tanstack/react-query';
import { axiosPrivate, BASE_API_URL } from '../axios/axios';

const useLogout = () => {
  const url = `${BASE_API_URL}/auth/logout`;

  const logoutUser = async () => {
    const response = await axiosPrivate.post(url);
    return response.data;
  };

  const {
    mutate: logout,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation(logoutUser);

  return {
    logout,
    isLoading,
    isSuccess,
    isError,
    error,
  };
};

export default useLogout;
