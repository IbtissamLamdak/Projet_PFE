import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import {
  UtilisateurResponseDto,
  resource,
} from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';
import { QueryKey } from '@tanstack/react-query';

const useFetchUsers = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);

  const queryKey: QueryKey = [resource];

  const getUsers = async () => userService.getAll();

  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UtilisateurResponseDto[]>(queryKey, getUsers);

  return { users, isLoading, isError, error, refetch };
};

export default useFetchUsers;
