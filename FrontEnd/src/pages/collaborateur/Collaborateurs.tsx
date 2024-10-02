import { useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Layout,
  theme,
  Select,
  Popconfirm,
  InputRef,
  Tag,
  DatePicker,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";
import { BASE_API_URL } from "../../api/axios/axios";
import { ToastContainer, toast } from "react-toastify";
import axiosBase from "axios";
import AgenceService from "../../services/agence/AgenceService";
import { AgenceResponseDto } from "../../services/agence/AgenceTypes";
import { Option } from "antd/es/mentions";
import {
  CollaborateurID,
  CollaborateurRequestDto,
  CollaborateurResponseDto,
  CollaborateurUpdateRequestDto,
  resource,
} from "../../services/collaborateur/CollaborateurTypes";
import CollaborateurService from "../../services/collaborateur/CollaborateurService";
import moment from "moment";

const Collaborateurs = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const collaborateurService = new CollaborateurService(
    `${BASE_API_URL}/${resource}`,
    axios
  );
  const agenceService = new AgenceService(`${BASE_API_URL}/agences`, axios);

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

  const { isLoading, data: collaborateurs } = useQuery<
    CollaborateurResponseDto[]
  >(["collaborateurs"], () => collaborateurService.getAll(), {
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
  });

  const { isLoading: addLoading, mutate: addCollaborateur } = useMutation(
    (collaborateur: CollaborateurRequestDto) =>
      collaborateurService.create(collaborateur),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["collaborateurs"]);
        toast.success("Collaborateur ajouté avec succès", {
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
    isError: errorUpdate,
    mutate: updateCollaborateur,
  } = useMutation(
    ({ id, data }: { id: CollaborateurID; data: CollaborateurRequestDto }) =>
      collaborateurService.update(id, data),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["collaborateurs"]);
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

  const { isLoading: deleteLoading, mutate: deleteCollaborateur } = useMutation(
    (collaborateurId: CollaborateurID) =>
      collaborateurService.delete(collaborateurId),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["collaborateurs"]);
        toast.success("Collaborateur supprimé avec succès", {
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (value: CollaborateurID) => <Tag color="#108ee9">#{value}</Tag>,
    },
    {
      title: "Cin",
      dataIndex: "CIN",
      key: "CIN",
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Prenom",
      dataIndex: "prenom",
      key: "prenom",
    },
    {
      title: "Date d'embauche",
      dataIndex: 'dateEmbauche',
      key: 'dateEmbauche',
      render: (date: Date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: "Poste",
      dataIndex: "poste",
      key: "poste",
    },
    {
      title: "Specialite",
      dataIndex: "specialite",
      key: "specialite",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telephone",
      dataIndex: "telephone",
      key: "telephone",
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      key: "adresse",
    },
    {
      title: "Agence",
      dataIndex: "agence",
      key: "agence",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, consommable: any) => (
        <Space direction="horizontal">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(consommable)}
          ></Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(consommable)}
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
            <Button icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (collaborateur: CollaborateurResponseDto) => {
    Modal.info({
      title: "Détails de collaborateur",
      content: (
        <div>
          <p>ID: {collaborateur.id}</p>
          <p>Cin: {collaborateur.CIN}</p>
          <p>Nom: {collaborateur.nom}</p>
          <p>Prenom: {collaborateur.prenom}</p>
          <p>Date d'embauche: {collaborateur.dateEmbauche}</p>
          <p>Poste: {collaborateur.poste}</p>
          <p>Specialite: {collaborateur.specialite}</p>
          <p>Email: {collaborateur.email}</p>
          <p>Telephone: {collaborateur.telephone}</p>
          <p>Adresse: {collaborateur.adresse}</p>
          <p>Agence: {collaborateur.agence}</p>
        </div>
      ),
      okButtonProps: {
        style: {
          backgroundColor: "#007bff",
          border: "#007bff",
          color: "#fff",
          width: "20%",
          marginTop: "10px",
        },
      },
    });
  };

  const handleAdd = () => {
    setShowAddModal(true);
    formAdd.resetFields();
  };

  const handleSave = async (collaborateur: CollaborateurRequestDto) => {
    setShowAddModal(false);
    collaborateur.dateEmbauche = moment(collaborateur.dateEmbauche).format(
      "YYYY-MM-DD"
    );
    addCollaborateur(collaborateur);
    formAdd.resetFields();
  };

  const handleEdit = async (collaborateur: CollaborateurResponseDto) => {
    setShowUpdateModal(true);
    formUpdate.setFieldsValue(collaborateur);
    formUpdate.setFieldValue(
      "dateEmbauche",
      moment(collaborateur.dateEmbauche)
    );
  };

  const handleEditSubmit = (
    collaborateurId: CollaborateurID,
    collaborateur: CollaborateurUpdateRequestDto
  ) => {
    const updatedCollaborateur: CollaborateurRequestDto = {
      CIN: collaborateur.CIN,
      nom: collaborateur.nom,
      prenom: collaborateur.prenom,
      dateEmbauche: collaborateur.dateEmbauche,
      poste: collaborateur.poste,
      specialite: collaborateur.specialite,
      email: collaborateur.email,
      telephone: collaborateur.telephone,
      adresse: collaborateur.adresse,
      agenceId: collaborateur.agenceId,
    };

    updateCollaborateur({
      id: collaborateurId,
      data: updatedCollaborateur,
    });
  };

  const handleDelete = (collaborateur: CollaborateurResponseDto) => {
    const id = collaborateur.id;
    deleteCollaborateur(id);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">Collaborateurs</h1>
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
          dataSource={collaborateurs}
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
          title="Ajouter collaborateur"
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
            formAdd
              .validateFields()
              .then((values) => {
                handleSave(values);
              })
              .catch((info) => console.log(info));
          }}
        >
          <Form form={formAdd} layout="vertical">
            <Form.Item
              name="CIN"
              label="Cin"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer cin",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="prenom"
              label="Prenom"
              rules={[{ required: true, message: "Veuillez entrer le prenom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateEmbauche"
              label="Date d'embauche"
              rules={[
                { required: true, message: 'Veuillez entrer date d"embauche' },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="poste"
              label="Poste"
              rules={[{ required: true, message: "Veuillez entrer poste" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="specialite"
              label="Specialite"
              rules={[
                { required: true, message: "Veuillez entrer specialite" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer email",
                },
                {
                  type: "email",
                  message: "Veuillez entrer a valid email",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="telephone"
              label="Telephone"
              rules={[{ required: true, message: "Veuillez entrer telephone" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="adresse"
              label="Adresse"
              rules={[{ required: true, message: "Veuillez entrer adresse" }]}
            >
              <Input />
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
          </Form>
        </Modal>
        <Modal
          open={showUpdateModal}
          title="Modifier collaborateur"
          onCancel={() => {
            setShowUpdateModal(false);
            formUpdate.resetFields();
          }}
          onOk={() => {
            formUpdate
              .validateFields()
              .then((values) => {
                handleEditSubmit(Number(values.id), values);
                setShowUpdateModal(false);
              })
              .catch((info) => console.log(info));

            if (!updateLoading) {
              if (updateSuccess && !errorUpdate) {
                toast.success("Collaborateur modifié avec succès", {
                  position: "bottom-right",
                });
              }
            }
          }}
        >
          <Form form={formUpdate} layout="vertical">
            <Form.Item name="id" label="id" hidden>
              <InputNumber disabled />
            </Form.Item>
            <Form.Item
              name="CIN"
              label="Cin"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer cin",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="prenom"
              label="Prenom"
              rules={[{ required: true, message: "Veuillez entrer le prenom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="dateEmbauche"
              label="Date d'embauche"
              rules={[
                { required: true, message: 'Veuillez entrer date d"embauche' },
              ]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="poste"
              label="Poste"
              rules={[{ required: true, message: "Veuillez entrer poste" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="specialite"
              label="Specialite"
              rules={[
                { required: true, message: "Veuillez entrer specialite" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Veuillez entrer email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="telephone"
              label="Telephone"
              rules={[{ required: true, message: "Veuillez entrer telephone" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="adresse"
              label="Adresse"
              rules={[{ required: true, message: "Veuillez entrer adresse" }]}
            >
              <Input />
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
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Collaborateurs;
