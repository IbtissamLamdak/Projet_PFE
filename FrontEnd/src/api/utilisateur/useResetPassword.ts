import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ResetPasswordDto,
  UtilisateurID,
  resource,
} from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';

const useResetPassword = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);
  const queryClient = useQueryClient();

  const resetPasswordMutationFunction = ({
    id,
    data,
  }: {
    id: UtilisateurID;
    data: ResetPasswordDto;
  }) => userService.resetPassword(id, data);

  const resetPasswordMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const resetPasswordMutation = useMutation<
    string,
    Error,
    { id: UtilisateurID; data: ResetPasswordDto }
  >(resetPasswordMutationFunction, resetPasswordMutationOptions);

  return resetPasswordMutation;
};

export default useResetPassword;
