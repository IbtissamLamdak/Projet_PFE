

export const BASE_URL_API = 'http://localhost:8080/api/elements';

export interface elements {
 
  numeroSerie: string;
  status: string;
  actifId: string;
  actifNom: string;
  numeroBon: string;
  bonDatePrise: number;

}



export type Addelements = Omit<elements, 'id'>;
