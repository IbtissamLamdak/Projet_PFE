import { UserInfoDtoResponse } from '../../api/auth/useFetchInfo';
import GenericCrudService from '../crud/GenericCrudService';
import {
  UtilisateurID,
  UtilisateurRequestDto,
  UtilisateurUpdateRequestDto,
  UtilisateurResponseDto,
  ResetPasswordDto,
  AssignColabDto,
} from './UtilisateurTypes';

class UtilisateurService extends GenericCrudService<
  UtilisateurRequestDto,
  UtilisateurUpdateRequestDto,
  UtilisateurResponseDto,
  UtilisateurID
> {
  async resetPassword(
    id: UtilisateurID,
    data: ResetPasswordDto
  ): Promise<string> {
    return this.request<string>(
      `${this.baseUrl}/${id}/reset-password`,
      'patch',
      data
    );
  }

  async verifyEmail(token: string): Promise<string> {
    return this.request<string>(`${this.baseUrl}/verify?token=${token}`, 'get');
  }

  async assignCollaborateur(
    utilisateurId: UtilisateurID,
    data: AssignColabDto
  ): Promise<string> {
    return this.request<string>(
      `${this.baseUrl}/${utilisateurId}/assign-collaborateur`,
      'patch',
      data
    );
  }
}

export default UtilisateurService;
