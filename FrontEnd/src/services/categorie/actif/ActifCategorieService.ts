import GenericCrudService from '../../crud/GenericCrudService';
import {
  ActifCategorieID,
  ActifCategorieRequestDto,
  ActifCategorieUpdateRequestDto,
  ActifCategorieResponseDto,
} from './ActifCategorieTypes';

class ActifCategorieService extends GenericCrudService<
  ActifCategorieRequestDto,
  ActifCategorieUpdateRequestDto,
  ActifCategorieResponseDto,
  ActifCategorieID
> {}

export default ActifCategorieService;
