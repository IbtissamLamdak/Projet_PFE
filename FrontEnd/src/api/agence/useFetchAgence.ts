import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { BASE_API_URL } from '../axios/AxiosConfig';
import AgenceService from '../../services/agence/AgenceService';
import {
  AgenceID,
  AgenceResponseDto,
  resource,
} from '../../services/agence/AgenceTypes';

const useFetchAgence = (id: AgenceID) => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const agenceService = new AgenceService(url, axios);

  const queryKey = [`${resource}_single`, id]; // Construct the proper query key

  const {
    data: agence,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AgenceResponseDto, Error>(queryKey, () => agenceService.get(id));

  return { agence, isLoading, isError, error, refetch };
};

export default useFetchAgence;
