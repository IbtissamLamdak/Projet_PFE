import GenericCrudService from '../crud/GenericCrudService';
import {
  ConsommableID,
  ConsommableRequestDto,
  ConsommableResponseDto,
  ConsommableUpdateRequestDto,
} from './ConsommableTypes';

class ConsommableService extends GenericCrudService<
  ConsommableRequestDto,
  ConsommableUpdateRequestDto,
  ConsommableResponseDto,
  ConsommableID
> {}

export default ConsommableService;
