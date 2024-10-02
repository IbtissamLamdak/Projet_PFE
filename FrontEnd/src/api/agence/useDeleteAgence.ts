import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_API_URL } from '../axios/AxiosConfig';
import AgenceService from '../../services/agence/AgenceService';
import { AgenceID, resource } from '../../services/agence/AgenceTypes';

const useDeleteAgence = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const agenceService = new AgenceService(url, axios);

  const queryClient = useQueryClient();

  const deleteUserMutationFunction = (id: AgenceID) => agenceService.delete(id);

  const deleteUserMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const deleteMutation = useMutation<void, Error, AgenceID>(
    deleteUserMutationFunction,
    deleteUserMutationOptions
  );

  return deleteMutation;
};

export default useDeleteAgence;
