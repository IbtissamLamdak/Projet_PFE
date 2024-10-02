import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resource } from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';

const useVerifyEmail = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);
  const queryClient = useQueryClient();

  const verifyEmailMutationFunction = ({ token }: { token: string }) =>
    userService.verifyEmail(token);

  const verifyEmailMutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([resource]);
    },
  };

  const verifyEmailMutation = useMutation<string, Error, { token: string }>(
    verifyEmailMutationFunction,
    verifyEmailMutationOptions
  );

  return verifyEmailMutation;
};

export default useVerifyEmail;
