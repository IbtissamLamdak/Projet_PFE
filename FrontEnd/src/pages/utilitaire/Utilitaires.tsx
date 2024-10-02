import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Layout,
  List,
  Modal,
  Row,
  Tag,
  Typography,
  theme,
} from 'antd';
import { PlusOutlined, MinusOutlined, EditOutlined } from '@ant-design/icons';
import ConsommableCategorieService from '../../services/categorie/consommable/ConsommableCategorieService';
import { BASE_API_URL } from '../../api/axios/axios';
import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import ActifCategorieService from '../../services/categorie/actif/ActifCategorieService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CategorieID,
  CategorieRequestDto,
  CategorieResponseDto,
  CategorieUpdateRequestDto,
} from '../../services/categorie/consommable/ConsommableCategorieTypes';
import axiosBase from 'axios';
import { toast } from 'react-toastify';
import {
  ActifCategorieID,
  ActifCategorieRequestDto,
  ActifCategorieResponseDto,
  ActifCategorieUpdateRequestDto,
} from '../../services/categorie/actif/ActifCategorieTypes';
import { useState } from 'react';

const { Text } = Typography;

const Utilitaires = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();
  const [consommableCategorieForm] = Form.useForm();
  const [actifCategorieForm] = Form.useForm();
  const [formUpdateCategorie] = Form.useForm();
  const [showUpdateActifModal, setShowUpdateActifModal] = useState(false);
  const [showUpdateConsommableModal, setShowUpdateConsommableModal] =
    useState(false);
  const consommableCategorieService = new ConsommableCategorieService(
    `${BASE_API_URL}/consommables/categories`,
    axios
  );
  const actifCategorieService = new ActifCategorieService(
    `${BASE_API_URL}/actifs/categories`,
    axios
  );

  const {
    isLoading: loadingConsommableCategories,
    data: consommableCategories,
  } = useQuery<CategorieResponseDto[]>(
    ['consommable_categories'],
    () => consommableCategorieService.getAll(),
    {
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

  const { isLoading: loadingActifCategories, data: actifCategories } = useQuery<
    CategorieResponseDto[]
  >(['actif_categories'], () => actifCategorieService.getAll(), {
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
  });

  const { isLoading: addActifCategoryLoading, mutate: addActifCategory } =
    useMutation(
      (category: ActifCategorieRequestDto) =>
        actifCategorieService.create(category),
      {
        onSuccess(data) {
          queryClient.invalidateQueries(['actif_categories']);
          toast.success('Actif Catégorie ajouté avec succès', {
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
    isLoading: addConsommableCategoryLoading,
    mutate: addConsommableCategory,
  } = useMutation(
    (category: CategorieRequestDto) =>
      consommableCategorieService.create(category),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['consommable_categories']);
        toast.success('Consommable Catégorie ajouté avec succès', {
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
    isLoading: loadingUpdateActifCategory,
    mutate: updateActifCategory,
    isSuccess: sucessUpdateActifCategory,
  } = useMutation(
    ({
      id,
      category,
    }: {
      id: ActifCategorieID;
      category: ActifCategorieUpdateRequestDto;
    }) => actifCategorieService.update(id, category),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['actif_categories']);
        toast.success('Acitf Catégorie modifié avec succès', {
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
    isLoading: loadingUpdateConsommableCategory,
    mutate: updateConsommableCategory,
    isSuccess: successUpdateConsommableCategory,
  } = useMutation(
    ({
      id,
      category,
    }: {
      id: CategorieID;
      category: CategorieUpdateRequestDto;
    }) => consommableCategorieService.update(id, category),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['consommable_categories']);
        toast.success('Consommable Catégorie modifié avec succès', {
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

  const { isLoading: loadingDeleteActifCategory, mutate: deleteActifCategory } =
    useMutation((id: ActifCategorieID) => actifCategorieService.delete(id), {
      onSuccess(data) {
        queryClient.invalidateQueries(['actif_categories']);
        toast.success('Acitf Catégorie supprimé avec succès', {
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
    });

  const {
    isLoading: loadingDeleteConsommableCategory,
    mutate: deleteConsommableCategory,
  } = useMutation((id: CategorieID) => consommableCategorieService.delete(id), {
    onSuccess(data) {
      queryClient.invalidateQueries(['consommable_categories']);
      toast.success('Consommable Catégorie supprimé avec succès', {
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
          toast.error(error.message, {
            position: 'bottom-right',
          });
        }
      }
    },
  });

  const handleAddActifCategory = (data: ActifCategorieRequestDto) => {
    addActifCategory(data);
    actifCategorieForm.resetFields();
  };

  const handleAddConsommableCategory = (data: CategorieRequestDto) => {
    addConsommableCategory(data);
    consommableCategorieForm.resetFields();
  };

  const handleEditActifCategory = (
    actifCategory: ActifCategorieResponseDto
  ) => {
    updateActifCategory({ id: actifCategory.id, category: actifCategory });
  };

  const handleDeleteActifCategory = (
    actifCategory: ActifCategorieResponseDto
  ) => {
    deleteActifCategory(actifCategory.id);
  };

  const handleEditConsommableCategory = (
    consommableCategory: CategorieResponseDto
  ) => {
    console.log(consommableCategory);

    updateConsommableCategory({
      id: consommableCategory.id,
      category: consommableCategory,
    });
  };

  const handleDeleteConsommableCategory = (
    consommableCategory: CategorieResponseDto
  ) => {
    deleteConsommableCategory(consommableCategory.id);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-normal">Utilitaires</h1>
      </div>
      <Row gutter={16}>
        <Col span={12}>
          <Card className="border-1 border-zinc-400">
            <h1 className="text-lg font-normal">Consommable catégories</h1>
            <div className="mt-3">
              <Form
                form={consommableCategorieForm}
                onFinish={handleAddConsommableCategory}
                layout="horizontal"
              >
                <div className="flex gap-3">
                  <Form.Item
                    className="flex-1"
                    name="nom"
                    rules={[
                      {
                        required: true,
                        message: 'Veuillez entrer catégorie',
                      },
                    ]}
                  >
                    <Input.TextArea
                      size="middle"
                      placeholder="Veuillez entrer une nouvelle consommable catégorie"
                      autoSize
                      minLength={1}
                      maxLength={20}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={addConsommableCategoryLoading}
                      style={{
                        backgroundColor: '#007bff',
                        border: '#007bff',
                        color: '#fff',
                      }}
                      htmlType="submit"
                      className="flex items-center justify-center"
                      icon={<PlusOutlined />}
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-thin text-lg">
                list of consommable categories :
              </span>
              <List
                loading={loadingConsommableCategories}
                dataSource={consommableCategories}
                pagination={{
                  defaultPageSize: 5,
                  pageSizeOptions: [5, 10],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total}`,
                  position: 'bottom',
                }}
                renderItem={(consommableCategory) => (
                  <List.Item
                    actions={[
                      <Button
                        key="edit_button"
                        htmlType="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#008537',
                          border: '#00471e',
                          color: '#fff',
                        }}
                        icon={<EditOutlined />}
                        onClick={() => {
                          formUpdateCategorie.setFieldsValue(
                            consommableCategory
                          );
                          setShowUpdateConsommableModal(true);
                        }}
                      />,
                      <Button
                        key="delete_button"
                        htmlType="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#dc3545',
                          border: '#dc3545',
                          color: '#fff',
                        }}
                        icon={<MinusOutlined />}
                        onClick={() =>
                          handleDeleteConsommableCategory(consommableCategory)
                        }
                      />,
                    ]}
                  >
                    <div className="flex gap-3 items-center justify-center">
                      <Tag color="#f50">#{consommableCategory.id}</Tag>
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {consommableCategory.nom}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card className="border-1 border-zinc-400">
            <h1 className="text-lg font-normal">Actif catégories</h1>
            <div className="mt-3">
              <Form
                form={actifCategorieForm}
                layout="horizontal"
                onFinish={handleAddActifCategory}
              >
                <div className="flex gap-3">
                  <Form.Item
                    className="flex-1"
                    name="nom"
                    rules={[
                      {
                        required: true,
                        message: 'Veuillez entrer catégorie',
                      },
                    ]}
                  >
                    <Input.TextArea
                      size="middle"
                      placeholder="Veuillez entrer une nouvelle actif catégorie"
                      autoSize
                      minLength={1}
                      maxLength={20}
                      showCount
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      loading={addActifCategoryLoading}
                      style={{
                        backgroundColor: '#007bff',
                        border: '#007bff',
                        color: '#fff',
                      }}
                      htmlType="submit"
                      className="flex items-center justify-center"
                      icon={<PlusOutlined />}
                    />
                  </Form.Item>
                </div>
              </Form>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-thin text-lg">
                list of actif categories :
              </span>
              <List
                loading={loadingActifCategories}
                dataSource={actifCategories}
                pagination={{
                  defaultPageSize: 5,
                  pageSizeOptions: [5, 10],
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Total ${total}`,
                  position: 'bottom',
                }}
                renderItem={(actifCategory) => (
                  <List.Item
                    actions={[
                      <Button
                        key="edit_button"
                        htmlType="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#008537',
                          border: '#00471e',
                          color: '#fff',
                        }}
                        icon={<EditOutlined />}
                        onClick={() => {
                          formUpdateCategorie.setFieldsValue(actifCategory);
                          setShowUpdateActifModal(true);
                        }}
                      />,
                      <Button
                        key="delete_button"
                        htmlType="button"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#dc3545',
                          border: '#dc3545',
                          color: '#fff',
                        }}
                        icon={<MinusOutlined />}
                        onClick={() => handleDeleteActifCategory(actifCategory)}
                      />,
                    ]}
                  >
                    <div className="flex gap-3 items-center justify-center">
                      <Tag color="#f50" className="text-base">
                        #{actifCategory.id}
                      </Tag>
                      <Text className="text-base bg-slate-100 p-2 w-full border rounded-md">
                        {actifCategory.nom}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        open={showUpdateConsommableModal}
        title="Modifier catégorie"
        onCancel={() => {
          setShowUpdateConsommableModal(false);
          formUpdateCategorie.resetFields();
        }}
        onOk={() => {
          formUpdateCategorie
            .validateFields()
            .then((values: CategorieResponseDto) => {
              handleEditConsommableCategory(values);
              setShowUpdateConsommableModal(false);
              formUpdateCategorie.resetFields();
            });
          if (!loadingConsommableCategories) {
            if (successUpdateConsommableCategory) {
              toast.success('Consommable catégorie modifié avec succès', {
                position: 'bottom-right',
              });
            }
          }
        }}
        okButtonProps={{
          style: {
            backgroundColor: '#007bff',
            border: '#007bff',
            color: '#fff',
            width: '20%',
            marginTop: '10px',
          },
        }}
        cancelButtonProps={{
          style: {
            width: '20%',
          },
        }}
      >
        <Form form={formUpdateCategorie}>
          <div className="flex gap-3 mt-5">
            <Form.Item name="id" label="ID" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item
              className="flex-1"
              name="nom"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer catégorie',
                },
              ]}
            >
              <Input.TextArea
                allowClear
                size="large"
                placeholder="Veuillez entrer une nouvelle actif catégorie"
                autoSize
                minLength={1}
                maxLength={20}
                showCount
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        open={showUpdateActifModal}
        title="Modifier catégorie"
        onCancel={() => {
          setShowUpdateActifModal(false);
          formUpdateCategorie.resetFields();
        }}
        onOk={() => {
          formUpdateCategorie
            .validateFields()
            .then((values: ActifCategorieResponseDto) => {
              handleEditActifCategory(values);
              setShowUpdateActifModal(false);
              formUpdateCategorie.resetFields();
            });
          if (!loadingUpdateActifCategory) {
            if (sucessUpdateActifCategory) {
              toast.success('Actif catégorie modifié avec succès', {
                position: 'bottom-right',
              });
            }
          }
        }}
        okButtonProps={{
          style: {
            backgroundColor: '#007bff',
            border: '#007bff',
            color: '#fff',
            width: '20%',
            marginTop: '10px',
          },
        }}
        cancelButtonProps={{
          style: {
            width: '20%',
          },
        }}
      >
        <Form form={formUpdateCategorie} layout="horizontal">
          <div className="flex gap-3 mt-5">
            <Form.Item
              className="flex-1"
              name="nom"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer catégorie',
                },
              ]}
            >
              <Input.TextArea
                allowClear
                size="large"
                placeholder="Veuillez entrer une nouvelle actif catégorie"
                autoSize
                minLength={1}
                maxLength={20}
                showCount
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Utilitaires;
