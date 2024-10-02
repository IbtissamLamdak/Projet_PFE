import { AgenceID } from '../agence/AgenceTypes';
import { ActifCategorieID } from '../categorie/actif/ActifCategorieTypes';

export const resource = 'actifs';

export type ActifID = number;

export interface ActifRequestDto {
  nom: string;
  description: string;
  marque: string;
  quantite: number;
  modele: string;
  actifCategorie: ActifCategorieID;
  agenceId: AgenceID;
  quantiteDisponible: number;
}

export interface ActifUpdateRequestDto {
  nom: string;
  description: string;
  marque: string;
  quantite: number;
  modele: string;
  actifCategorie: ActifCategorieID;
  agenceId: AgenceID;
  quantiteDisponible: number;
}

export interface ActifResponseDto {
  id: ActifID;
  nom: string;
  description: string;
  marque: string;
  quantite: number;
  agence: string;
  quantiteDisponible: number;
  actifCategorie: string;
  modele: string;
}
