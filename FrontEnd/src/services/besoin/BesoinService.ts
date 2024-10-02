import GenericCrudService from '../crud/GenericCrudService';
import {
  BesoinID,
  BesoinRequestDto,
  BesoinResponseDto,
  BesoinUpdateRequestDto,
} from './BesoinTypes';

class BesoinService extends GenericCrudService<
  BesoinRequestDto,
  BesoinUpdateRequestDto,
  BesoinResponseDto,
  BesoinID
> {}

export default BesoinService;
