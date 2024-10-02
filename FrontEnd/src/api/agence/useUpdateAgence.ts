import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_API_URL } from '../axios/AxiosConfig';
import {
  AgenceID,
  AgenceRequestDto,
  AgenceResponseDto,
  AgenceUpdateRequestDto,
  resource,
} from '../../services/agence/AgenceTypes';
import AgenceService from '../../services/agence/AgenceService';

const useUpdateAgence = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const agenceService = new AgenceService(url, axios);

  const queryClient = useQueryClient();

  const updateUserMutationFunction = ({
    id,
    item,
  }: {
    id: AgenceID;
    item: AgenceUpdateRequestDto;
  }) => agenceService.update(id, item);

  const updateUserMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const updateMutation = useMutation<
    AgenceResponseDto,
    Error,
    { id: AgenceID; item: AgenceUpdateRequestDto }
  >(updateUserMutationFunction, updateUserMutationOptions);

  return updateMutation;
};

export default useUpdateAgence;
