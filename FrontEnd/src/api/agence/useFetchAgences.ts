import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useQuery } from '@tanstack/react-query';
import { BASE_API_URL } from '../axios/AxiosConfig';
import { AgenceResponseDto, resource } from '../../services/agence/AgenceTypes';
import AgenceService from '../../services/agence/AgenceService';
import { QueryKey } from '@tanstack/react-query';

const useFetchAgences = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const agenceService = new AgenceService(url, axios);

  const queryKey: QueryKey = [resource];

  const getAgences = async () => agenceService.getAll();

  const {
    data: agences,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<AgenceResponseDto[]>(queryKey, getAgences);

  return { agences, isLoading, isError, error, refetch };
};

export default useFetchAgences;
