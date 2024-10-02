import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Layout,
  DatePicker,
  notification,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";
import { Store } from "antd/es/form/interface";

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ReclamationItem {
  id: number;
  description: string;
  date_maintenance: string;
  status: string;
  numero_serie: string;
  collaborateur_id: number;
}
enum MaintenanceType {
  OUVERT = "OUVERT ",
  EN_COURS = "EN_COURS",
  RESOLU = "RESOLU",
  ANNULE = "ANNULE",
  FERME = "FERME",
}
interface CollaborateursDtoResponse {
  id: number;
  CIN: string;
  nom: string;
  prenom: string;
  dateEmbauche: string; // You might need to adjust the type to match the actual type
  poste: string;
  specialite: string;
  email: string;
  telephone: string;
  adresse: string;
  agence: string;
}
interface ElementDtoResponse {
  numeroSerie: string;
  actifId: number;
  actifNom: string;
  numeroBon: string;
  bonDatePrise: string; // Change the type to match the actual type
}

const Reclamations = () => {
  const api = useAxiosPrivate();
  const [data, setData] = useState<ReclamationItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ReclamationItem | null>(null);
  const [collaborators, setCollaborators] = useState<CollaborateursDtoResponse[]>([]);
  const [numeroSeries, setNumeroSeries] = useState<string[]>([]);
const [isEditing, setIsEditing] = useState(false);

  const [form] = Form.useForm();



  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get("/collaborateurs");
        setCollaborators(response.data);
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      }
    };
  
    fetchCollaborators();
  }, []); 
  useEffect(() => {
    const fetchNumeroSeries = async () => {
      try {
        const response = await api.get("/elements"); // Adjust the URL as needed
        const numeroSerieList = response.data.map((element: ElementDtoResponse) => element.numeroSerie);
        setNumeroSeries(numeroSerieList);
      } catch (error) {
        console.error("Error fetching numeroSeries:", error);
      }
    };
  
    fetchNumeroSeries();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleAdd = async (values: ReclamationItem) => {
    try {
      console.log(values);
      const response = await api.post(`/maintenances`, values);
      setData([...data, response.data]);
  
      form.resetFields();
      setIsModalVisible(false);
      notification.success({
        message: "maintenance ajoutée avec succès",
      });
    } catch (error: any) {
      console.log(error);
      
      console.error("Error adding reclamation:", error.response.data.message);
      notification.error({
        message: "Erreur lors de l'ajout de  maintenance",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "collaborateur_id",
      dataIndex: "collaborateur_id",
      key: "collaborateur_id",
    },
    {
      title: "numero_serie",
      dataIndex: "numero_serie",
      key: "numero_serie",
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date Maintenance",
      dataIndex: "date_maintenance",
      key: "date_maintenance",
      render:  (date: string) => moment(date).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, item: ReclamationItem) => (
        <Space>
      <Button icon={<EditOutlined />} onClick={() => handleEditClick(item)}>
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

  useEffect(() => {
    fetchReclamations();
  }, []);

  const fetchReclamations = async () => {
    try {
      const response = await api.get(`/maintenances`);
      const data = response.data;
      setData(data);
    } catch (error) {
      console.error("Error fetching reclamation items:", error);
    }
  };

  const updateMaintenance = async (maintenanceId: number, maintenance: any) => {
    try {
      const response = await api.put(`/maintenances/${maintenanceId}`, maintenance);
      
      const updatedData = data.map((record) =>
        record.id === editingRecord!.id ? response.data : record
      );
      setData(updatedData);
  
      notification.success({
        message: "maintenance modifiée avec succès",
      });
    } catch (error: any) {
      console.error("Error editing reclamation:", error.response.data.message);
      notification.error({
        message: "Erreur lors de la modification de  maintenance",
      });
    }
  }

  const handleEdit = (values: any) => {    

    const updatedMaintenance = {
      collaborateur_id :values?.collaborateur_id,
      description:values?.description,
      numero_serie:values?.numero_serie,
      status:values?.status,
      date_maintenance: moment(values?.date_maintenance).format("YYYY-MM-DDTHH:mm:ss").toString(),
    }
    
    console.log("values", updatedMaintenance);

    updateMaintenance(editingRecord!.id, updatedMaintenance)

    form.resetFields();
    setIsModalVisible(false);
    setIsEditing(false);
  };
  
  const handleEditClick = (item: ReclamationItem) => {
    setIsEditing(true);

    form.setFieldsValue({
      collaborateur_id :item?.collaborateur_id,
      description:item?.description,
      numero_serie:item?.numero_serie,
      status:item?.status,
      date_maintenance:  moment(item?.date_maintenance).format("YYYY-MM-DDTHH:mm:ss").toString(),
    });
    
     // Set initial values for the form fields
    setEditingRecord(item);
    showModal();
  };
  const handleDelete = async (id: number) => {
  try {
    // Send DELETE request to remove the maintenance record
    await api.delete(`/maintenances/${id}`);

    // Update the data in the state by removing the deleted record
    const updatedData = data.filter((record) => record.id !== id);
    setData(updatedData);

    notification.success({
      message: "maintenance supprimée avec succès",
    });
  } catch (error: any) {
    console.error("Error deleting reclamation:", error.response.data.message);
    notification.error({
      message: "Erreur lors de la suppression de la maintenance",
    });
  }
};

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">maintenances</h1>
          <Button type="default" onClick={showModal}  >
            Ajouter maintenance
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          rowKey={(item) => item.id.toString()}
          pagination={
            {position: ['bottomCenter'] , defaultPageSize: 10, pageSizeOptions: [5,10,20,30], showQuickJumper: true, showSizeChanger: true, showTotal: (total) => `Total ${total} maintenances`}
          } 
        />

        <Modal
          title="Ajouter maintenance"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form}
    layout="vertical"
    initialValues={isEditing ? (editingRecord as Store) : undefined} // Populate form for editing
    onFinish={
      isEditing ? handleEdit : handleAdd
    }
    >
            <Form.Item
              label="numero_serie"
              name="numero_serie"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer Numero Serie",
                },
              ]}
            >
               <Select
    showSearch
    placeholder="Sélectionner une série de matériel"
    filterOption={(input, option) =>
      (option?.props?.children as string)
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0
    }
  >
    {numeroSeries.map((numeroSerie) => (
      <Option key={numeroSerie} value={numeroSerie}>
        {numeroSerie}
      </Option>
    ))}
  </Select>
            </Form.Item>
            <Form.Item
              label="collaborateur_id"
              name="collaborateur_id"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer collaborateur_id",
                },
              ]}
            >
             <Select
    showSearch
    placeholder="Sélectionner un collaborateur"
    filterOption={(input, option) =>
      option?.props?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    {collaborators.map((collaborator) => (
      <Option key={collaborator.id} value={collaborator.id}>
        {`${collaborator.nom} ${collaborator.prenom}`}
      </Option>
    ))}
  </Select>
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
                {Object.values(MaintenanceType).map((status) => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
            <Form.Item
      label="Date Maintenance"
      name="date_maintenance"
      rules={[
        { required: true, message: "Date Maintenance is required" },
      ]}
    >
      
    </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
              {isEditing ? "Modifier" : "Ajouter"}
              </Button>
              <Button
                htmlType="button"
                onClick={handleCancel}
                style={{ marginLeft: 10 }}
              >
                Annuler
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Reclamations;
