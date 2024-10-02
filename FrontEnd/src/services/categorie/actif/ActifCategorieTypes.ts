export const resource = 'actif_categorie';

export type ActifCategorieID = number;

export interface ActifCategorieRequestDto {
  nom: string;
}

export interface ActifCategorieUpdateRequestDto {
  nom: string;
}

export interface ActifCategorieResponseDto {
  id: ActifCategorieID;
  nom: string;
}
