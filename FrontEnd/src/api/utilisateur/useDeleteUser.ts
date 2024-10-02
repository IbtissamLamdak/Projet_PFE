import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UtilisateurID,
  resource,
} from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';

const useDeleteUser = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);

  const queryClient = useQueryClient();

  const deleteUserMutationFunction = (id: UtilisateurID) =>
    userService.delete(id);

  const deleteUserMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const deleteMutation = useMutation<void, Error, UtilisateurID>(
    deleteUserMutationFunction,
    deleteUserMutationOptions
  );

  return deleteMutation;
};

export default useDeleteUser;
