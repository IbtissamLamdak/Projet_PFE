import { AgenceID } from '../agence/AgenceTypes';
import { CollaborateurID } from '../collaborateur/CollaborateurTypes';

export const resource = 'besoins';

export type BesoinID = number;

export interface BesoinRequestDto {
  description: string;
  dateReclamation: string;
  status: string;
  quantite: number;
  collaborateurId: CollaborateurID;
  materielId: number;
}

export interface BesoinUpdateRequestDto {
  description: string;
  dateReclamation: string;
  status: string;
  quantite: number;
  collaborateurId: CollaborateurID;
  materielId: number;
}

export interface BesoinResponseDto {
  id: BesoinID;
  description: string;
  dateReclamation: string;
  status: string;
  quantite: number;
  materiel: {
    id: number;
    nom: string;
  };
  collaborateur: {
    id: CollaborateurID;
    nom: string;
    prenom: string;
    agence: {
      id: AgenceID;
      nom: string;
    };
  };
}
