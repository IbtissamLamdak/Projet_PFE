import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_API_URL } from '../axios/AxiosConfig';
import AgenceService from '../../services/agence/AgenceService';
import {
  AgenceRequestDto,
  AgenceResponseDto,
  resource,
} from '../../services/agence/AgenceTypes';

const useCreateAgence = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const agenceService = new AgenceService(url, axios);

  const queryClient = useQueryClient();

  const createUserMutationFunction = (user: AgenceRequestDto) =>
    agenceService.create(user);

  const createUserMutationOptions = {
    onSuccess: (data: AgenceResponseDto) => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const createMutation = useMutation<
    AgenceResponseDto,
    Error,
    AgenceRequestDto
  >(createUserMutationFunction, createUserMutationOptions);

  return createMutation;
};

export default useCreateAgence;
