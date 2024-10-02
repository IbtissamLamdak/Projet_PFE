export const BASE_URL_API = 'http://localhost:8080/api/fournisseurs';

export interface Fournisseur {
  id: number;
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  pays: string;
  email:string;
  tel:string;


}

export type AddFournisseur = Omit<Fournisseur, 'id'>;
