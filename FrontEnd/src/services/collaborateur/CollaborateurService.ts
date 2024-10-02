import GenericCrudService from '../crud/GenericCrudService';
import {
  CollaborateurID,
  CollaborateurRequestDto,
  CollaborateurResponseDto,
  CollaborateurUpdateRequestDto,
} from './CollaborateurTypes';

class CollaborateurService extends GenericCrudService<
  CollaborateurRequestDto,
  CollaborateurUpdateRequestDto,
  CollaborateurResponseDto,
  CollaborateurID
> {}

export default CollaborateurService;
