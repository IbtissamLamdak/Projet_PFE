export const resource = 'agences';

export type AgenceID = number;

export interface AgenceBase {
  nom: string;
  localisation: string;
  adresse: string;
  ville: string;
  pays: string;
  longitude: number;
  latitude: number;
  description: string;
}

export interface AgenceRequestDto extends AgenceBase {}

export interface AgenceUpdateRequestDto extends AgenceBase {}

export interface AgenceResponseDto extends AgenceBase {
  id: AgenceID;
}
