import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  UtilisateurRequestDto,
  UtilisateurResponseDto,
  resource,
} from '../../services/utilisateur/UtilisateurTypes';
import UtilisateurService from '../../services/utilisateur/UtilisateurService';
import { BASE_API_URL } from '../axios/AxiosConfig';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useCreateUser = () => {
  const axios = useAxiosPrivate();
  const url = `${BASE_API_URL}/${resource}`;
  const userService = new UtilisateurService(url, axios);

  const queryClient = useQueryClient();

  const createUserMutationFunction = (user: UtilisateurRequestDto) =>
    userService.create(user);

  const createUserMutationOptions = {
    onSuccess: (data: UtilisateurResponseDto) => {
      queryClient.invalidateQueries([resource]);
      toast.success('Utilisateur ajouté avec succès');
    },
    onError: (error: any) => {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: 'top-right',
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: 'top-right',
        });
      }
    },
  };

  const createMutation = useMutation<
    UtilisateurResponseDto,
    Error,
    UtilisateurRequestDto
  >(createUserMutationFunction, createUserMutationOptions);

  return createMutation;
};

export default useCreateUser;
