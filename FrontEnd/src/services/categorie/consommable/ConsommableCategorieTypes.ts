export const resource = 'consommable_categorie';

export type CategorieID = number;

export interface CategorieRequestDto {
  nom: string;
}

export interface CategorieUpdateRequestDto {
  nom: string;
}

export interface CategorieResponseDto {
  id: CategorieID;
  nom: string;
}
