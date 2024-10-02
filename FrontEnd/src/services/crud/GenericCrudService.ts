import { AxiosInstance } from 'axios';

export interface GenericCrudServiceInterface<
  RequestCreateDTO,
  RequestUpdateDTO,
  ResponseDto,
  ID
> {
  create(data: RequestCreateDTO): Promise<ResponseDto>;
  get(id: ID): Promise<ResponseDto>;
  getAll(): Promise<ResponseDto[]>;
  update(id: ID, data: RequestUpdateDTO): Promise<ResponseDto>;
  delete(id: ID): Promise<void>;
}

class GenericCrudService<RequestCreateDTO, RequestUpdateDTO, ResponseDto, ID>
  implements
    GenericCrudServiceInterface<
      RequestCreateDTO,
      RequestUpdateDTO,
      ResponseDto,
      ID
    >
{
  constructor(protected baseUrl: string, protected axios: AxiosInstance) {}

  protected async request<T>(
    url: string,
    method: string,
    data?: any
  ): Promise<T> {
    const response = await this.axios.request<T>({
      url,
      method,
      data,
    });
    return response.data;
  }

  async create(data: RequestCreateDTO): Promise<ResponseDto> {
    return this.request<ResponseDto>(this.baseUrl, 'post', data);
  }

  async get(id: ID): Promise<ResponseDto> {
    return this.request<ResponseDto>(`${this.baseUrl}/${id}`, 'get');
  }

  async getAll(): Promise<ResponseDto[]> {
    const response = await this.axios.get<ResponseDto[]>(this.baseUrl);
    return response.data;
  }

  async update(id: ID, data: RequestUpdateDTO): Promise<ResponseDto> {
    return this.request<ResponseDto>(`${this.baseUrl}/${id}`, 'put', data);
  }

  async delete(id: ID): Promise<void> {
    await this.request<void>(`${this.baseUrl}/${id}`, 'delete');
  }
}

export default GenericCrudService;
