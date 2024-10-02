import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Layout,
  theme,
  Tag,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import useFetchUsers from "../../api/utilisateur/useFetchUsers";
import useCreateUser from "../../api/utilisateur/useCreateUser";
import useUpdateUser from "../../api/utilisateur/useUpdateUser";
import useDeleteUser from "../../api/utilisateur/useDeleteUser";
import useResetPassword from "../../api/utilisateur/useResetPassword";
import {
  AssignColabDto,
  ResetPasswordDto,
  UtilisateurID,
  UtilisateurRequestDto,
  UtilisateurResponseDto,
  UtilisateurUpdateRequestDto,
} from "../../services/utilisateur/UtilisateurTypes";
import { BASE_API_URL } from "../../api/axios/axios";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";
import CollaborateurService from "../../services/collaborateur/CollaborateurService";
import { CollaborateurResponseDto } from "../../services/collaborateur/CollaborateurTypes";
import axiosBase from "axios";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UtilisateurService from "../../services/utilisateur/UtilisateurService";

const { Option } = Select;

function Utilisateurs() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const [assignColabForm] = Form.useForm();
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [modalAssignColabVisible, setModalAssignColabVisible] = useState(false);
  const [modalChangePasswordVisible, setModalChangePasswordVisible] =
    useState(false);
  const [editingKey, setEditingKey] = useState<string>("");
  const { users, isLoading, refetch } = useFetchUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resetPassword = useResetPassword();
  const axios = useAxiosPrivate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const collaborateurService = new CollaborateurService(
    `${BASE_API_URL}/collaborateurs`,
    axios
  );
  const utilisateurService = new UtilisateurService(
    `${BASE_API_URL}/utilisateurs`,
    axios
  );

  const { isLoading: isLoadingCollaborateurs, data: collaborateurs } = useQuery<
    CollaborateurResponseDto[]
  >(["collaborateurs"], () => collaborateurService.getAll(), {
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

  const {
    isLoading: assignCollabLoading,
    mutate: assignCollab,
    isSuccess: successASsignCollab,
  } = useMutation(
    ({ id, data }: { id: UtilisateurID; data: AssignColabDto }) =>
      utilisateurService.assignCollaborateur(id, data),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["utilisateurs"]);
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
      render: (value: UtilisateurID) => <Tag color="#108ee9">#{value}</Tag>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (value: string) => {
        if (value === "ADMIN") {
          return <Tag color="red">{value}</Tag>;
        } else if (value === "MANAGER") {
          return <Tag color="purple">{value}</Tag>;
        } else if (value === "USER") {
          return <Tag color="green">{value}</Tag>;
        } else {
          return <Tag>{value}</Tag>;
        }
      },
    },
    {
      title: "Actif",
      dataIndex: "isActif",
      key: "isActif",
      render: (isActif: boolean) =>
        isActif ? (
          <Tag color="#00be0d">Oui</Tag>
        ) : (
          <Tag color="#ff0000">Non</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space direction="horizontal">
          <Button
            icon={<SyncOutlined />}
            onClick={() => handleChangePassword(record.id, record)}
          >
            Changer password
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleAssigbColabForm(record)}
          >
            Attribuer un collaborateur
          </Button>

          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id, record)}
          >
            Modifier
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setModalAddVisible(true);
  };

  const handleSave = async (values: UtilisateurRequestDto) => {
    const utilisateur = values;
    createUser.mutateAsync(utilisateur);
  };

  const handleEdit = (id: UtilisateurID, item: UtilisateurUpdateRequestDto) => {
    updateForm.setFieldsValue(item);
    setModalUpdateVisible(true);
    setEditingKey(item.email);
    updateUser.mutate({ id, item });
  };

  const handleChangePassword = async (id: number, record: ResetPasswordDto) => {
    resetPasswordForm.setFieldsValue(record);
    setEditingKey(id + "");
    setModalChangePasswordVisible(true);
    const obj = record;

    const resetPassword = async () => {
      try {
        await axios.patch(
          `${BASE_API_URL}/utilisateurs/${id}/reset-password`,
          obj
        );
        setEditingKey("");
        setModalChangePasswordVisible(false);
        resetPasswordForm.resetFields();
      } catch (err) {
        console.error(err);
      }
    };

    resetPassword();
  };

  const handleAssigbColabForm = (record: UtilisateurResponseDto) => {
    assignColabForm.setFieldsValue(record);
    setModalAssignColabVisible(true);
  };

  const handleAssignColab = (userId: number, record: AssignColabDto) => {
    const data = {
      collaborateurId: record.collaborateurId,
    };

    assignCollab({ id: userId, data });

    assignColabForm.resetFields();
  };

  const handleDelete = async (record: UtilisateurResponseDto) => {
    deleteUser.mutateAsync(record.id);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">Utilisateurs</h1>
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
          dataSource={users}
          loading={isLoading}
          columns={columns}
          rowKey={(record) => record.id}
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
          open={modalAddVisible}
          title="Ajouter utilisateur"
          onCancel={() => {
            setModalAddVisible(false);
            setEditingKey("");
            form.resetFields();
          }}
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                handleSave(values);
                setModalAddVisible(false);
                form.resetFields();
              })
              .catch((info) => console.log("Validation Failed", info));
          }}
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
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Veuillez entrer username" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "Veuillez entrer valide email",
                },
                {
                  required: true,
                  message: "Veuillez entrer email",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Veuillez entrer password" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[
                { required: true, message: "Veuillez sélectionner le rôle" },
              ]}
            >
              <Select placeholder="Sélectionner un rôle">
                <Option value="ADMIN">admin</Option>
                <Option value="MANAGER">cellule environnement</Option>
                <Option value="USER">collaborateur</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={modalUpdateVisible}
          title="Modifier utilisateur"
          onCancel={() => {
            setModalUpdateVisible(false);
            setEditingKey("");
            updateForm.resetFields();
          }}
          onOk={() => {
            updateForm
              .validateFields()
              .then((values) => {
                handleEdit(Number(values.id), values);
                setModalUpdateVisible(false);
              })
              .catch((info) => console.log("Validation Failed", info));
          }}
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
        >
          <Form form={updateForm} layout="vertical">
            <Form.Item name="id" label="ID" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Veuillez entrer username" }]}
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
              name="isActif"
              label="Actif"
              rules={[
                { required: true, message: 'Veuillez sélectionner l"état' },
              ]}
            >
              <Select>
                <Option value="true">Oui</Option>
                <Option value="false">Non</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="role"
              label="Rôle"
              rules={[
                { required: true, message: "Veuillez sélectionner le rôle" },
              ]}
            >
              <Select>
                USER
                <Option value="ADMIN">admin</Option>
                <Option value="MANAGER">cellule environnement</Option>
                <Option value="USER">collaborateur</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={modalChangePasswordVisible}
          title="Changer password"
          onCancel={() => {
            setModalChangePasswordVisible(false);
            setEditingKey("");
            resetPasswordForm.resetFields();
          }}
          onOk={() => {
            resetPasswordForm
              .validateFields()
              .then((values) => {
                handleChangePassword(Number(values.id), values);
              })
              .catch((info) => console.log("Validation Failed", info));
          }}
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
        >
          <Form form={resetPasswordForm} layout="vertical" scrollToFirstError>
            <Form.Item name="id" label="ID" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Nouveau password"
              rules={[
                { required: true, message: "Veuillez entrer nouveau password" },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmNewPassword"
              label="Confirme passwrod"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Veuillez entrer nouveau password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "Le nouveau mot de passe que vous avez saisi ne correspond pas!"
                      )
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={modalAssignColabVisible}
          title="Attribuer un collaborateur"
          onCancel={() => {
            setModalAssignColabVisible(false);
            setEditingKey("");
            assignColabForm.resetFields();
          }}
          onOk={() => {
            assignColabForm
              .validateFields()
              .then((values) => {
                handleAssignColab(Number(values.id), values);
                setModalAssignColabVisible(false);
              })
              .catch((info) => console.log("Validation Failed", info));
            if (!assignCollabLoading && successASsignCollab) {
              if (successASsignCollab) {
                toast.success("Collaborateur attribué avec succès", {
                  position: "bottom-right",
                });
              }
            }
          }}
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
        >
          <Form form={assignColabForm} layout="vertical" scrollToFirstError>
            <Form.Item name="id" label="ID" hidden>
              <Input disabled />
            </Form.Item>
            <Form.Item name="collaborateurId" label="Collaborateur">
              <Select
                placeholder="Sélectionner une agence"
                allowClear
                loading={isLoadingCollaborateurs}
              >
                {collaborateurs?.map((collaborateur) => {
                  return (
                    <Option
                      value={collaborateur.id.toString()}
                      key={collaborateur.id.toString()}
                    >
                      {`${collaborateur.CIN} - ${collaborateur.nom} ${collaborateur.prenom}`}
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
}

export default Utilisateurs;
