import GenericCrudService from '../crud/GenericCrudService';
import {
  AgenceID,
  AgenceRequestDto,
  AgenceUpdateRequestDto,
  AgenceResponseDto,
} from './AgenceTypes';

class AgenceService extends GenericCrudService<
  AgenceRequestDto,
  AgenceUpdateRequestDto,
  AgenceResponseDto,
  AgenceID
> {}

export default AgenceService;
