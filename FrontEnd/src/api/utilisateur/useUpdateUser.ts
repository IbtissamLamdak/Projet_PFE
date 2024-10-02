import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UtilisateurID,
  UtilisateurResponseDto,
  UtilisateurUpdateRequestDto,
  resource,
} from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';

const useUpdateUser = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);
  const queryClient = useQueryClient();

  const updateUserMutationFunction = ({
    id,
    item,
  }: {
    id: UtilisateurID;
    item: UtilisateurUpdateRequestDto;
  }) => userService.update(id, item);

  const updateUserMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const updateMutation = useMutation<
    UtilisateurResponseDto,
    Error,
    { id: UtilisateurID; item: UtilisateurUpdateRequestDto }
  >(updateUserMutationFunction, updateUserMutationOptions);

  return updateMutation;
};

export default useUpdateUser;
