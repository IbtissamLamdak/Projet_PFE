import {
  Breadcrumb,
  Button,
  Card,
  Layout,
  Result,
  Skeleton,
  theme,
  Typography,
  Form,
  Input,
  Space,
  InputNumber,
  Select,
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsommableService from '../../services/consommable/ConsommableService';
import { BASE_API_URL } from '../../api/axios/axios';
import {
  ConsommableID,
  ConsommableResponseDto,
  ConsommableUpdateRequestDto,
  resource,
} from '../../services/consommable/ConsommableTypes';
import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosBase from 'axios';
import { useForm } from 'antd/es/form/Form';
import AgenceService from '../../services/agence/AgenceService';
import ConsommableCategorieService from '../../services/categorie/consommable/ConsommableCategorieService';
import { AgenceResponseDto } from '../../services/agence/AgenceTypes';
import { toast } from 'react-toastify';
import { CategorieResponseDto } from '../../services/categorie/consommable/ConsommableCategorieTypes';

const { Content } = Layout;
const { Text } = Typography;

const Consommable = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const axios = useAxiosPrivate();
  const consommableService = new ConsommableService(
    `${BASE_API_URL}/${resource}`,
    axios
  );
  const agenceService = new AgenceService(`${BASE_API_URL}/agences`, axios);
  const categorieService = new ConsommableCategorieService(
    `${BASE_API_URL}/consommables/categories`,
    axios
  );
  const [formConsommable] = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { isLoading: isLoadingAgences, data: agences } = useQuery<
    AgenceResponseDto[]
  >(['agences'], () => agenceService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, { position: 'bottom-right' });
        } else {
          toast.error(error.message, { position: 'bottom-right' });
        }
      }
    },
  });

  const { isLoading: isLoadingCategories, data: categories } = useQuery<
    CategorieResponseDto[]
  >(['consommable_categories'], () => categorieService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, { position: 'bottom-right' });
        } else {
          toast.error(error.message, { position: 'bottom-right' });
        }
      }
    },
  });

  const { isLoading: isLoadingConsommable, data: consommable } =
    useQuery<ConsommableResponseDto>(
      ['consommable_single'],
      () => consommableService.get(Number(id)),
      {
        onError: (error) => {
          if (axiosBase.isAxiosError(error)) {
            if (error.response) {
              setErrorMsg(error.response.data.error);
            } else {
              setErrorMsg(error.message);
            }
          }
        },
      }
    );

  const {
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    mutate: updateConsommable,
  } = useMutation(
    ({ id, data }: { id: ConsommableID; data: ConsommableUpdateRequestDto }) =>
      consommableService.update(id, data),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['consommable_single']);
        toast.success('Consommable modifié avec succès', {
          position: 'bottom-right',
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: 'bottom-right',
            });
          } else {
            toast.error(error.message, { position: 'bottom-right' });
          }
        }
      },
    }
  );

  const {
    isLoading: deleteLoading,
    mutate: deleteConsommable,
    isSuccess: deleteSuccess,
  } = useMutation(
    (consommableId: ConsommableID) => consommableService.delete(consommableId),
    {
      onSuccess(data) {
        queryClient.invalidateQueries([
          'consommables',
          'consommable_singleconsommable_single',
        ]);
        toast.success('Consommable supprimé avec succès', {
          position: 'bottom-right',
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: 'bottom-right',
            });
          } else {
            toast.error(error.message, { position: 'bottom-right' });
          }
        }
      },
    }
  );

  const handleUpdate = () => {
    const consommableId = Number(id);
    formConsommable.validateFields().then((values) => {
      updateConsommable({ id: consommableId, data: values });
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    const consommableId = Number(id);
    deleteConsommable(consommableId);
    navigate('/consommables', { replace: true });
    window.location.reload();
  };

  const items = [
    {
      title: 'Consommables',
    },
    {
      title: <span>{id}</span>,
    },
  ];

  return (
    <Layout className="min-h-full" style={{ background: colorBgContainer }}>
      <Content className="flex flex-col gap-5">
        <div className="flex justify-start gap-1 items-center">
          <Button
            type="default"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              navigate('/consommables', { replace: false });
            }}
          />
          <Breadcrumb className="text-lg" items={items} />
        </div>
        {errorMsg ? (
          <Result
            status="warning"
            title={errorMsg}
            extra={
              <Button type="default" onClick={() => navigate(-1)}>
                page précédente
              </Button>
            }
          />
        ) : (
          <Skeleton
            loading={isLoadingConsommable}
            active={isLoadingConsommable}
          >
            {consommable && (
              <Card className=" border-slate-400">
                <Form
                  className="flex flex-row flex-wrap"
                  layout="vertical"
                  form={formConsommable}
                  initialValues={consommable}
                >
                  <Form.Item
                    className="flex flex-col w-full md:w-1/2 p-2"
                    name="nom"
                    label={
                      <Text className="text-xl font-semibold">
                        Nom consommable :
                      </Text>
                    }
                  >
                    {isEditing ? (
                      <Input />
                    ) : (
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommable.nom}
                      </Text>
                    )}
                  </Form.Item>
                  <Form.Item
                    className="flex flex-col w-full md:w-1/2 p-2"
                    name="marque"
                    label={
                      <Text className="text-xl font-semibold">Marque :</Text>
                    }
                  >
                    {isEditing ? (
                      <Input />
                    ) : (
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommable.marque}
                      </Text>
                    )}
                  </Form.Item>
                  <Form.Item
                    className="flex flex-col w-full md:w-1/2 p-2"
                    name="quantite"
                    label={
                      <Text className="text-xl font-semibold">Quantité :</Text>
                    }
                  >
                    {isEditing ? (
                      <InputNumber style={{ width: '100%' }} min={0} />
                    ) : (
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommable.quantite}
                      </Text>
                    )}
                  </Form.Item>
                  <Form.Item
                    className="flex flex-col w-full md:w-1/2 p-2"
                    name="agenceId"
                    label={
                      <Text className="text-xl font-semibold">Agence :</Text>
                    }
                  >
                    {isEditing ? (
                      <Select
                        allowClear
                        showSearch
                        placeholder="Sélectionner une agence"
                        loading={isLoadingAgences}
                      >
                        {agences?.map((agence) => (
                          <Select.Option
                            key={agence.id.toString()}
                            value={agence.id.toString()}
                          >
                            {agence.nom} - {agence.ville}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommable.agence}
                      </Text>
                    )}
                  </Form.Item>
                  <Form.Item
                    className="flex flex-col w-full md:w-1/2 p-2"
                    name="consommableCategorie"
                    label={
                      <Text className="text-xl font-semibold">Catégorie :</Text>
                    }
                  >
                    {isEditing ? (
                      <Select
                        allowClear
                        showSearch
                        placeholder="Sélectionner une catégorie"
                        loading={isLoadingCategories}
                      >
                        {categories?.map((categorie) => (
                          <Select.Option
                            key={categorie.id.toString()}
                            value={categorie.nom}
                          >
                            {categorie.nom}
                          </Select.Option>
                        ))}
                      </Select>
                    ) : (
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommable.consommableCategorie}
                      </Text>
                    )}
                  </Form.Item>
                  <Form.Item
                    className="flex flex-col w-full md:w-1/2 p-2"
                    name="description"
                    label={
                      <Text className="text-xl font-semibold">
                        Description :
                      </Text>
                    }
                  >
                    {isEditing ? (
                      <Input.TextArea minLength={5} maxLength={100} showCount />
                    ) : (
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommable.description}
                      </Text>
                    )}
                  </Form.Item>
                  {isEditing ? (
                    <div className="flex w-full items-center align-middle gap-5 justify-center">
                      <Button
                        className="flex p-5 justify-center items-center text-base w-32"
                        onClick={handleUpdate}
                        style={{
                          backgroundColor: '#007bff',
                          border: '#007bff',
                          color: '#fff',
                        }}
                      >
                        Sauvegarder
                      </Button>
                      <Button
                        className="flex p-5 items-center text-base w-32"
                        onClick={() => setIsEditing(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#dc3545',
                          border: '#dc3545',
                          color: '#fff',
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  ) : (
                    <div className="flex w-full items-center align-middle gap-5 justify-center">
                      <Button
                        onClick={() => {
                          setIsEditing(true);
                        }}
                        className="flex p-5 items-center justify-center text-base w-28"
                        style={{
                          backgroundColor: '#007bff',
                          border: '#007bff',
                          color: '#fff',
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        className="flex p-5 items-center text-base w-28"
                        onClick={handleDelete}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#dc3545',
                          border: '#dc3545',
                          color: '#fff',
                        }}
                      >
                        Supprimer
                      </Button>
                    </div>
                  )}
                </Form>
              </Card>
            )}
          </Skeleton>
        )}
      </Content>
    </Layout>
  );
};

export default Consommable;
