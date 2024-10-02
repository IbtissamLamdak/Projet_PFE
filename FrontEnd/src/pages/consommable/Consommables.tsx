import { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Layout,
  theme,
  InputNumber,
  Select,
  Popconfirm,
  Divider,
  InputRef,
  Tag,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  ConsommableID,
  ConsommableRequestDto,
  ConsommableResponseDto,
  ConsommableUpdateRequestDto,
  resource,
} from "../../services/consommable/ConsommableTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ConsommableService from "../../services/consommable/ConsommableService";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";
import { BASE_API_URL } from "../../api/axios/axios";
import { ToastContainer, toast } from "react-toastify";
import axiosBase from "axios";
import AgenceService from "../../services/agence/AgenceService";
import { AgenceResponseDto } from "../../services/agence/AgenceTypes";
import { Option } from "antd/es/mentions";
import ConsommableCategorieService from "../../services/categorie/consommable/ConsommableCategorieService";
import {
  CategorieRequestDto,
  CategorieResponseDto,
} from "../../services/categorie/consommable/ConsommableCategorieTypes";
import { useNavigate } from "react-router-dom";

const Consommables = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const inputRef = useRef<InputRef>(null);
  const consommableService = new ConsommableService(
    `${BASE_API_URL}/${resource}`,
    axios
  );
  const agenceService = new AgenceService(`${BASE_API_URL}/agences`, axios);
  const categorieService = new ConsommableCategorieService(
    `${BASE_API_URL}/consommables/categories`,
    axios
  );

  const { isLoading: isLoadingAgences, data: agences } = useQuery<
    AgenceResponseDto[]
  >(["agences"], () => agenceService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, { position: "bottom-right" });
        } else {
          toast.error(error.message, { position: "bottom-right" });
        }
      }
    },
  });

  const { isLoading: isLoadingCategories, data: categories } = useQuery<
    CategorieResponseDto[]
  >(["consommable_categories"], () => categorieService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, { position: "bottom-right" });
        } else {
          toast.error(error.message, { position: "bottom-right" });
        }
      }
    },
  });

  const { isLoading, data: consommables } = useQuery<ConsommableResponseDto[]>(
    ["consommables"],
    () => consommableService.getAll(),
    {
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: "bottom-right",
            });
          } else {
            toast.error(error.message, { position: "bottom-right" });
          }
        }
      },
    }
  );

  const { isLoading: addLoading, mutate: addConsommable } = useMutation(
    (consommable: ConsommableRequestDto) =>
      consommableService.create(consommable),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["consommables"]);
        toast.success("Consommable ajouté avec succès", {
          position: "bottom-right",
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: "bottom-right",
            });
          } else {
            toast.error(error.message, { position: "bottom-right" });
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
        queryClient.invalidateQueries(["consommables"]);
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: "bottom-right",
            });
          } else {
            toast.error(error.message, { position: "bottom-right" });
          }
        }
      },
    }
  );

  const { isLoading: deleteLoading, mutate: deleteConsommable } = useMutation(
    (consommableId: ConsommableID) => consommableService.delete(consommableId),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["consommables"]);
        toast.success("Consommable supprimé avec succès", {
          position: "bottom-right",
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: "bottom-right",
            });
          } else {
            toast.error(error.message, { position: "bottom-right" });
          }
        }
      },
    }
  );

  const { isLoading: addCategoryLoading, mutate: addCategory } = useMutation(
    (category: CategorieRequestDto) => categorieService.create(category),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["consommable_categories"]);
        toast.success("Catégorie ajouté avec succès", {
          position: "bottom-right",
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: "bottom-right",
            });
          } else {
            toast.error(error.message, { position: "bottom-right" });
          }
        }
      },
    }
  );

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(event.target.value);
  };

  const addItem = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    addCategory({ nom: newCategory });
    setNewCategory("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: ConsommableID) => <Tag color="#108ee9">#{value}</Tag>,
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Marque",
      dataIndex: "marque",
      key: "marque",
    },
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
    },
    {
      title: "Agence",
      dataIndex: "agence",
      key: "agence",
    },
    {
      title: "Catégorie",
      dataIndex: "consommableCategorie",
      key: "consommableCategorie",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, consommable: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(consommable)}
          >
            Voir
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(consommable.id, consommable)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer consommalbe"
            description="Êtes-vous sûr de vouloir supprimer ce consommable"
            onConfirm={() => handleDelete(consommable)}
            okText="Oui"
            cancelText="Non"
            placement="left"
            okButtonProps={{
              loading: deleteLoading,
              style: {
                backgroundColor: "#007bff",
                border: "#007bff",
                color: "#fff",
              },
            }}
          >
            <Button icon={<DeleteOutlined />}>Supprimer</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (consommable: ConsommableResponseDto) => {
    if (consommable?.id) {
      navigate(`/consommables/${consommable.id}`);
    }
  };

  const handleAdd = () => {
    setShowAddModal(true);
    formAdd.resetFields();
  };

  const handleSave = async (consommable: ConsommableRequestDto) => {
    setShowAddModal(false);
    if (typeof consommable.quantite === "undefined") consommable.quantite = 0;
    addConsommable(consommable);
    formAdd.resetFields();
  };

  const handleEdit = async (
    consommableId: ConsommableID,
    consommable: ConsommableResponseDto
  ) => {
    setShowUpdateModal(true);
    formUpdate.setFieldsValue(consommable);

    const updatedConsommable = {
      nom: consommable.nom,
      description: consommable.description,
      marque: consommable.marque,
      quantite: consommable.quantite,
      agenceId: consommable.agenceId,
      consommableCategorie: consommable.consommableCategorie,
    };

    console.log(consommable);

    updateConsommable({
      id: consommableId,
      data: updatedConsommable,
    });
  };

  const handleDelete = (consommable: ConsommableResponseDto) => {
    const id = consommable.id;
    deleteConsommable(id);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">Consommables</h1>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#008537",
              border: "#00471e",
              color: "#fff",
            }}
            onClick={handleAdd}
            icon={<PlusOutlined />}
          >
            Ajouter
          </Button>
        </div>
        <Table
          bordered
          columns={columns}
          loading={isLoading}
          dataSource={consommables}
          rowKey={(consommable) => consommable.id}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: [5, 10, 20, 30, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total}`,
            position: ["bottomCenter"],
          }}
        />
        <Modal
          open={showAddModal}
          title="Ajouter consommable"
          okButtonProps={{
            style: {
              backgroundColor: "#007bff",
              border: "#007bff",
              color: "#fff",
              width: "20%",
              marginTop: "10px",
            },
          }}
          cancelButtonProps={{
            style: {
              width: "20%",
            },
          }}
          onCancel={() => {
            setShowAddModal(false);
            formAdd.resetFields();
          }}
          onOk={() => {
            formAdd.validateFields().then((values) => {
              handleSave(values);
            });
          }}
        >
          <Form form={formAdd} layout="vertical">
            <Form.Item
              name="nom"
              label="Nom consommable"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom du consommable",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="marque"
              label="Marque"
              rules={[{ required: true, message: "Veuillez entrer la marque" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="quantite" label="Quantité">
              <InputNumber defaultValue={0} min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="agenceId"
              label="Agence"
              rules={[{ required: true, message: "Veuillez entrer l'agence" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Sélectionner une agence"
                loading={isLoadingAgences}
              >
                {agences?.map((agence) => {
                  return (
                    <Option
                      value={agence.id.toString()}
                      key={agence.id.toString()}
                    >
                      {agence.nom}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="consommableCategorie"
              label="Catégorie"
              rules={[
                { required: true, message: "Veuillez entrer la catégorie" },
              ]}
            >
              <Select
                placement="bottomLeft"
                allowClear
                showSearch
                placeholder="Sélectionner une catégorie"
                loading={isLoadingCategories}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <div
                      style={{ padding: "0 8px 4px" }}
                      className="flex gap-2"
                    >
                      <Input
                        placeholder="Veuillez entrer une nouvelle catégorie"
                        ref={inputRef}
                        value={newCategory}
                        onChange={onNameChange}
                      />
                      <Button
                        className="flex items-center justify-center"
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={addItem}
                      />
                    </div>
                  </>
                )}
              >
                {categories?.map((categorie) => {
                  return (
                    <Option value={categorie.nom} key={categorie.id.toString()}>
                      {categorie.nom}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Veuillez entrer la description" },
              ]}
            >
              <Input.TextArea
                autoSize
                minLength={5}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={showUpdateModal}
          title="Modifier consommable"
          okButtonProps={{
            style: {
              backgroundColor: "#007bff",
              border: "#007bff",
              color: "#fff",
              width: "20%",
              marginTop: "10px",
            },
          }}
          onCancel={() => {
            setShowUpdateModal(false);
            formUpdate.resetFields();
          }}
          onOk={() => {
            formUpdate.validateFields().then((values) => {
              handleEdit(Number(values.id), values);
              setShowUpdateModal(false);
            });
            if (!updateLoading && updateSuccess) {
              if (updateSuccess) {
                toast.success("Consommable modifié avec succès", {
                  position: "bottom-right",
                });
              }
            }
          }}
        >
          <Form form={formUpdate} layout="vertical">
            <Form.Item name="id" label="ID" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="nom"
              label="Nom consommable"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom du consommable",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="marque"
              label="Marque"
              rules={[{ required: true, message: "Veuillez entrer la marque" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="quantite" label="Quantité">
              <InputNumber defaultValue={0} min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="agenceId"
              label="Agence"
              rules={[{ required: true, message: "Veuillez entrer l'agence" }]}
            >
              <Select
                placeholder="Sélectionner une agence"
                loading={isLoadingAgences}
              >
                {agences?.map((agence) => {
                  return (
                    <Option
                      value={agence.id.toString()}
                      key={agence.id.toString()}
                    >
                      {agence.nom}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="consommableCategorie"
              label="Catégorie"
              rules={[
                { required: true, message: "Veuillez entrer la catégorie" },
              ]}
            >
              <Select
                placeholder="Sélectionner une catégorie"
                loading={isLoadingCategories}
                showSearch
              >
                {categories?.map((categorie) => {
                  return (
                    <Option value={categorie.nom} key={categorie.id.toString()}>
                      {categorie.nom}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Veuillez entrer la description" },
              ]}
            >
              <Input.TextArea
                autoSize
                minLength={5}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <ToastContainer position="bottom-right" />
    </Layout>
  );
};

export default Consommables;
