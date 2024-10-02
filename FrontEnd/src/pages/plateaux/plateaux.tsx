import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Layout,
  Checkbox,
  Select,
  theme,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const { Column } = Table;
const { Option } = Select;
interface Plateau {
  id: number;
  name: string;
  floor: number;
  capacity: number;
  hasMeetingRoom: boolean;
  hasKitchen: boolean;
  hasRestroom: boolean;
  agenceId: number;
  agenceNom: string;
}
interface AgenceDtoResponse {
  id: number;
  nom: string;
}

function Plateaux() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const api = useAxiosPrivate();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [plateaux, setPlateaux] = useState<Plateau[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [agences, setAgences] = useState<AgenceDtoResponse[]>([]);
  useEffect(() => {
    const fetchAgences = async () => {
      try {
        const response = await api.get("/agences");
        setAgences(response.data);
      } catch (error) {
        console.error("Error fetching agences:", error);
      }
    };

    fetchAgences();
  }, []);
  useEffect(() => {
    fetchPlateaux();
  }, []);

  const fetchPlateaux = async () => {
    try {
      const response = await api.get("/plateaux");
      setPlateaux(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des plateaux");
    } finally {
      setIsLoading(false);
    }
  };

  const addPlateau = async (values: Plateau) => {
    try {
      await api.post(`/agences/${values.agenceId}/plateaux`, values);
      toast.success("Plateau ajouté avec succès");
      fetchPlateaux();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du plateau");
    }
  };

  const updatePlateau = async (values: Plateau) => {
    try {
      await api.put(`/plateaux/${values.id}`, values);
      toast.success("Plateau mis à jour avec succès");
      fetchPlateaux();
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du plateau");
    }
  };

  const showModal = (record?: Plateau) => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleFormSubmit = async (values: Plateau) => {
    console.log(values.id);
    if (values.id) {
      updatePlateau(values);
    } else {
      addPlateau(values);
    }
  };
  const deletePlateau = async (id: number) => {
    try {
      await api.delete(`/plateaux/${id}`);
      toast.success("Plateau supprimé avec succès");
      fetchPlateaux();
    } catch (error) {
      toast.error("Erreur lors de la suppression du plateau");
    }
  };
  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3 ">
          <h1 className="text-2xl font-normal">Plateaux</h1>
          <Button
            onClick={() => showModal()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#008537",
              border: "#00471e",
              color: "#fff",
            }}
            icon={<PlusOutlined />}
          >
            Ajouter
          </Button>
        </div>
        {/*  */}
        <Table dataSource={plateaux} loading={isLoading} bordered>
          <Column title="Agence" dataIndex="agenceNom" key="agenceNom" />
          <Column title="Nom de plateaux" dataIndex="name" key="name" />
          <Column title="Étage" dataIndex="floor" key="floor" />
          <Column
            title="Salle de réunion"
            dataIndex="hasMeetingRoom"
            key="hasMeetingRoom"
            render={(hasMeetingRoom) => (hasMeetingRoom ? "Oui" : "Non")}
          />
          <Column
            title="Cuisine"
            dataIndex="hasKitchen"
            key="hasKitchen"
            render={(hasKitchen) => (hasKitchen ? "Oui" : "Non")}
          />
          <Column
            title="Toilettes"
            dataIndex="hasRestroom"
            key="hasRestroom"
            render={(hasRestroom) => (hasRestroom ? "Oui" : "Non")}
          />

          <Column
            title="Capacité des personnes"
            dataIndex="capacity"
            key="capacity"
          />
          <Column
            title="Actions"
            key="actions"
            render={(_, record: Plateau) => (
              <Space size={"small"} direction="horizontal">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => showModal(record)}
                >
                  Modifier
                </Button>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => deletePlateau(record.id)}
                >
                  Supprimer
                </Button>
              </Space>
            )}
          />
        </Table>
        <Modal
          title={
            form.getFieldValue("id") ? "Modifier Plateau" : "Ajouter Plateau"
          }
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setModalVisible(false)}>
              Annuler
            </Button>,
            <Button
              style={{
                backgroundColor: "#007bff",
                border: "#007bff",
                color: "#fff",
                width: "20%",
                marginTop: "10px",
              }}
              key="submit"
              onClick={() => form.submit()}
            >
              OK
            </Button>,
          ]}
        >
          <Form form={form} onFinish={handleFormSubmit} layout="vertical">
            <Form.Item
              name="agenceId"
              label="Agence"
              rules={[
                { required: true, message: "Veuillez sélectionner une agence" },
              ]}
            >
              <Select showSearch placeholder="Sélectionner une agence">
                {agences.map((agence) => (
                  <Option key={agence.id} value={agence.id}>
                    {agence.nom}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="name"
              label="Nom de plateau"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="floor"
              label="Étage"
              rules={[{ required: true, message: "Veuillez entrer l'étage" }]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="capacity"
              label="Capacité"
              rules={[
                { required: true, message: "Veuillez entrer la capacité" },
              ]}
            >
              <InputNumber />
            </Form.Item>
            <Form.Item
              name="hasMeetingRoom"
              label="Salle de réunion"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              name="hasKitchen"
              label="Cuisine"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
            <Form.Item
              name="hasRestroom"
              label="Toilettes"
              valuePropName="checked"
            >
              <Checkbox />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}

export default Plateaux;
