import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { BASE_API_URL } from '../axios/AxiosConfig';

export type UserInfoDtoResponse = {
  username: string;
  email: string;
  role: string;
  isActif: boolean;
  nom: string;
  prenom: string;
  telephone: string;
  cin: string;
  adresse: string;
  post: string;
  specialite: string;
};

const useFetchInfo = () => {
  const axios = useAxiosPrivate();
  const resource = 'auth_info';
  const url = `${BASE_API_URL}/auth/info`;

  const getInfo = async () => {
    const response = await axios.get<UserInfoDtoResponse>(url);
    return response.data;
  };

  const {
    data: userInfo,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useQuery<UserInfoDtoResponse, Error>([resource], getInfo);

  return { userInfo, isLoading, isError, error, isSuccess, refetch };
};

export default useFetchInfo;
