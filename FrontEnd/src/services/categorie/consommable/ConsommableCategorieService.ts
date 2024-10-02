import GenericCrudService from '../../crud/GenericCrudService';
import {
  CategorieID,
  CategorieRequestDto,
  CategorieUpdateRequestDto,
  CategorieResponseDto,
} from './ConsommableCategorieTypes';

class ConsommableCategorieService extends GenericCrudService<
  CategorieRequestDto,
  CategorieUpdateRequestDto,
  CategorieResponseDto,
  CategorieID
> {}

export default ConsommableCategorieService;
