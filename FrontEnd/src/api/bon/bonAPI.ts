export const BASE_URL_API = 'http://localhost:8080/api/bons';

export interface Stock {
 
  Id: string;
  key: string;
  dateLivraison: string;
  numeroBon: string;
  fournisseurId: string;
  designation: string;
  quantiteDemande: number;
  prix: string;
}



export type AddStock = Omit<Stock, 'id'>;
