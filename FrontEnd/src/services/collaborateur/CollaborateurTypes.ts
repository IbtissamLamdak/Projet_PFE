import { AgenceID } from '../agence/AgenceTypes';

export const resource = 'collaborateurs';

export type CollaborateurID = number;

export interface CollaborateurRequestDto {
  CIN: string;
  nom: string;
  prenom: string;
  dateEmbauche: string;
  poste: string;
  specialite: string;
  email: string;
  telephone: string;
  adresse: string;
  agenceId: AgenceID;
}

export interface CollaborateurUpdateRequestDto {
  CIN: string;
  nom: string;
  prenom: string;
  dateEmbauche: string;
  poste: string;
  specialite: string;
  email: string;
  telephone: string;
  adresse: string;
  agenceId: AgenceID;
}

export interface CollaborateurResponseDto {
  id: CollaborateurID;
  CIN: string;
  nom: string;
  prenom: string;
  dateEmbauche: string;
  poste: string;
  specialite: string;
  email: string;
  telephone: string;
  adresse: string;
  agence: string;
  agenceId: AgenceID;
}
