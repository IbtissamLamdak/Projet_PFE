import GenericCrudService from '../crud/GenericCrudService';
import {
  ActifID,
  ActifRequestDto,
  ActifResponseDto,
  ActifUpdateRequestDto,
} from './ActifTypes';

class ActifService extends GenericCrudService<
  ActifRequestDto,
  ActifUpdateRequestDto,
  ActifResponseDto,
  ActifID
> {}

export default ActifService;
