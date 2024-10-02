import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useQuery, QueryFunctionContext } from '@tanstack/react-query';
import {
  UtilisateurID,
  UtilisateurResponseDto,
  resource,
} from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';

const useFetchUser = (id: UtilisateurID) => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);

  const queryKey = [`${resource}_single`, id]; // Construct the proper query key

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UtilisateurResponseDto, Error>(queryKey, () =>
    userService.get(id)
  );

  return { user, isLoading, isError, error, refetch };
};

export default useFetchUser;
