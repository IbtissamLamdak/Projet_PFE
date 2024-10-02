import React, { useState, useEffect } from "react";
import moment from "moment";
import "moment/locale/fr";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  Layout,
  DatePicker,
  theme,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

enum ReparationStatus {
  EN_ATTENTE = "EN_ATTENTE",
  EN_COURS = "EN_COURS",
  COMPLETE = "COMPLETE",
  ANNULE = "ANNULE",
}

interface ReparationItem {
  id: number;
  NumeroSerie: string;

  description: string;
  dateDebut: string;
  dateFin: string;
  status: string;
  NomTechnicien: string;
  TelephoneTechnicien: string;
  Solution: string;
  maintenance_id: number;
}

const Reparations = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const api = useAxiosPrivate();
  const [form] = Form.useForm();
  const [data, setData] = useState<ReparationItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReparationItem | null>(null);

  const columns = [
    {
      title: "Serie matériel",
      dataIndex: "NumeroSerie",
      key: "NumeroSerie",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date Début",
      dataIndex: "dateDebut",
      key: "dateDebut",
    },
    {
      title: "Date Fin",
      dataIndex: "dateFin",
      key: "dateFin",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Nom du Technicien",
      dataIndex: "NomTechnicien",
      key: "NomTechnicien",
    },
    {
      title: "Téléphone du Technicien",
      dataIndex: "TelephoneTechnicien",
      key: "TelephoneTechnicien",
    },
    {
      title: "Solution",
      dataIndex: "Solution",
      key: "Solution",
    },
    {
      title: "ID Maintenance",
      dataIndex: "maintenance_id",
      key: "maintenance_id",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, item: ReparationItem) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(item)}>
            Modifier
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer?"
            onConfirm={() => handleDelete(item.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button icon={<DeleteOutlined />} danger>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fetchReparations = async () => {
    try {
      const response = await api.get(`/reparations`);
      const data = response.data;
      setData(data);
    } catch (error) {
      console.error("Error fetching repair items:", error);
    }
  };

  useEffect(() => {
    fetchReparations();
  }, []);

  const handleEdit = (item: ReparationItem) => {
    console.log(item);
    setSelectedItem(item);
    setModalVisible(true);

    form.setFieldsValue({
      NumeroSerie: item.NumeroSerie,
      description: item.description,
      dateDebut: moment(item.dateDebut),
      dateFin: moment(item.dateFin),
      status: item.status,
      NomTechnicien: item.NomTechnicien,
      TelephoneTechnicien: item.TelephoneTechnicien,
      Solution: item.Solution,
      maintenance_id: item.maintenance_id,
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/reparations/${id}`);
      fetchReparations();
    } catch (error) {
      console.error("Error deleting repair item:", error);
    }
  };

  const handleSave = async (values: ReparationItem) => {
    try {
      if (selectedItem) {
        // Update existing repair item
        await api.put(`/reparations/${selectedItem.id}`, values);
      } else {
        // Create new repair item
        await api.post(`/reparations`, values);
      }

      fetchReparations();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving repair item:", error);
    }
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">Réparations</h1>
          <Button
            type="primary"
            onClick={() => {
              setSelectedItem(null);
              setModalVisible(true);
            }}
            icon={<PlusOutlined />}
            style={{
              backgroundColor: "green",
              borderColor: "green",
              color: "white",
            }}
          >
            Ajouter
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(item) => item.id.toString()}
        />

        <Modal
          title={selectedItem ? "Modifier Réparation" : "Ajouter Réparation"}
          okButtonProps={{
            style: {
              backgroundColor: "#007bff",
              border: "#007bff",
              color: "#fff",
              width: "20%",
              marginTop: "10px",
            },
          }}
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={() => {
            form.validateFields().then((values) => {
              handleSave(values);
              form.resetFields();
              setModalVisible(false);
            });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Numero Serie matériel"
              name="NumeroSerie"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer Numero Serie",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la description",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Date Début"
              name="dateDebut"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la date de début",
                },
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DDTHH:mm"
              />
            </Form.Item>
            <Form.Item
              label="Date Fin"
              name="dateFin"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la date de fin",
                },
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DDTHH:mm"
              />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le statut",
                },
              ]}
            >
              <Select>
                {Object.values(ReparationStatus).map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Nom du Technicien"
              name="NomTechnicien"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom du technicien",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Téléphone du Technicien"
              name="TelephoneTechnicien"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le téléphone du technicien",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Solution"
              name="Solution"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la solution",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="ID de Maintenance"
              name="maintenance_id"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer l'ID de maintenance",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Reparations;
