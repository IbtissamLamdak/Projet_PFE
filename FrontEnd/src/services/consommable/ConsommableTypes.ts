import { AgenceID } from '../agence/AgenceTypes';

export const resource = 'consommables';

export type ConsommableID = number;

export interface ConsommableRequestDto {
  nom: string;
  description: string;
  marque: string;
  quantite: number;
  agenceId: AgenceID;
  consommableCategorie: string;
}

export interface ConsommableUpdateRequestDto {
  nom: string;
  description: string;
  marque: string;
  quantite: number;
  agenceId: AgenceID;
  consommableCategorie: string;
}

export interface ConsommableResponseDto {
  id: ConsommableID;
  nom: string;
  description: string;
  marque: string;
  quantite: number;
  agence: string;
  agenceId: AgenceID;
  consommableCategorie: string;
}
