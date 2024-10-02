import { useState } from "react";
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
  Tag,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  AgenceID,
  AgenceRequestDto,
  AgenceResponseDto,
  AgenceUpdateRequestDto,
} from "../../services/agence/AgenceTypes";
import useCreateAgence from "../../api/agence/useCreateAgence";
import useUpdateAgence from "../../api/agence/useUpdateAgence";
import useDeleteAgence from "../../api/agence/useDeleteAgence";
import AgenceService from "../../services/agence/AgenceService";
import { BASE_API_URL } from "../../api/axios/axios";
import axiosBase from "axios";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";

function Agences() {
  const axios = useAxiosPrivate();
  const [form] = Form.useForm();
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const createAgence = useCreateAgence();
  const updateAgence = useUpdateAgence();
  const deleteAgence = useDeleteAgence();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const agenceService = new AgenceService(`${BASE_API_URL}/agences`, axios);

  const { isLoading, data: agences } = useQuery<AgenceResponseDto[]>(
    ["agences"],
    () => agenceService.getAll(),
    {
      select: (data) => {
        console.log(data);
        return data;
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, { position: "top-right" });
          } else {
            toast.error(error.message);
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
      render: (value: AgenceID) => <Tag color="#108ee9">#{value}</Tag>,
    },
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Localisation",
      dataIndex: "localisation",
      key: "localisation",
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      key: "adresse",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
    },
    {
      title: "Pays",
      dataIndex: "pays",
      key: "pays",
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      key: "longitude",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AgenceResponseDto) => (
        <Space size={"small"} direction="horizontal">
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          ></Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id, record)}
          ></Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          ></Button>
        </Space>
      ),
    },
  ];

  const handleView = (agence: AgenceResponseDto) => {
    Modal.info({
      title: "Détails de l'agence",
      content: (
        <div>
          <p>ID: {agence?.id}</p>
          <p>Nom: {agence?.nom}</p>
          <p>localisation: {agence?.localisation}</p>
          <p>adresse: {agence?.adresse}</p>
          <p>ville: {agence?.ville}</p>
          <p>pays: {agence?.pays}</p>
          <p>longitude: {agence?.longitude}</p>
          <p>latitude: {agence?.latitude}</p>
          <p>description: {agence?.description}</p>
        </div>
      ),
    });
  };

  const handleAdd = () => {
    setModalAddVisible(true);
  };

  const handleSave = (values: AgenceRequestDto) => {
    const agence = values;
    createAgence.mutateAsync(agence);
  };

  const handleEdit = async (id: AgenceID, item: AgenceUpdateRequestDto) => {
    setModalUpdateVisible(true);
    form.setFieldsValue(item);
    updateAgence.mutateAsync({ id, item });
  };

  const handleDelete = async (record: AgenceResponseDto) => {
    deleteAgence.mutateAsync(record.id);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3 ">
          <h1 className="text-2xl font-normal">Agences</h1>
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
          size="middle"
          bordered
          loading={isLoading}
          dataSource={agences}
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
          title="Ajouter agence"
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
            setModalAddVisible(false);
            form.resetFields();
          }}
          onOk={() => {
            form.validateFields().then((values) => {
              handleSave(values);
              setModalAddVisible(false);
              form.resetFields();
            });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Veuillez entrer nome" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="localisation"
              label="Localisation"
              rules={[
                { required: true, message: "Veuillez entrer localisation" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="adresse"
              label="Adresse"
              rules={[{ required: true, message: "Veuillez entrer adresse" }]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="ville"
              label="Ville"
              rules={[{ required: true, message: "Veuillez entrer ville" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pays"
              label="Pays"
              rules={[{ required: true, message: "Veuillez entrer pays" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ required: true, message: "Veuillez entrer longitude" }]}
            >
              <InputNumber<string> style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: "Veuillez entrer latitude" }]}
            >
              <InputNumber<string> style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Veuillez entrer description" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={modalUpdateVisible}
          title="Modifier agence"
          onCancel={() => {
            setModalUpdateVisible(false);
            form.resetFields();
          }}
          onOk={() => {
            form.validateFields().then((values) => {
              handleEdit(Number(values.id), values);
              setModalUpdateVisible(false);
              form.resetFields();
            });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="id" label="ID">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Veuillez entrer nome" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="localisation"
              label="Localisation"
              rules={[
                { required: true, message: "Veuillez entrer localisation" },
              ]}
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
              name="ville"
              label="Ville"
              rules={[{ required: true, message: "Veuillez entrer ville" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pays"
              label="Pays"
              rules={[{ required: true, message: "Veuillez entrer pays" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ required: true, message: "Veuillez entrer longitude" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ required: true, message: "Veuillez entrer latitude" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Veuillez entrer description" },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default Agences;
