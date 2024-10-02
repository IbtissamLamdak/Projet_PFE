import { CollaborateurID } from '../collaborateur/CollaborateurTypes';

export const resource = 'utilisateurs';

export type UtilisateurID = number;

export interface UtilisateurBase {
  username: string;
  email: string;
  role: string;
}

export interface UtilisateurRequestDto extends UtilisateurBase {
  password: string;
}

export interface UtilisateurUpdateRequestDto extends UtilisateurBase {
  isActif: boolean;
}

export interface UtilisateurResponseDto extends UtilisateurBase {
  id: number;
  isActif: boolean;
}

export interface ResetPasswordDto {
  newPassword: string;
  confirmNewPassword: string;
}

export interface AssignColabDto {
  collaborateurId: CollaborateurID;
}
