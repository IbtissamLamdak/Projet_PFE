import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Space,
  Popconfirm,
  Layout,
  message,
  theme,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const { Option } = Select;

interface AffectationDtoResponse {
  id: number;
  date_debut: string;
  date_fin: string;
  NumeroSerie: string;
  AgenceNom: string;
  PlateauNom: string;
  nom: string;
  Prenom: string;
  plateau_id: number;
  AgenceID: number;
  collaborateurId: number;
}
interface ElementDtoResponse {
  numeroSerie: string;
  actifId: number;
  actifNom: string;
  numeroBon: string;
  bonDatePrise: string; // Change the type to match the actual type
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
interface AgenceDtoResponse {
  id: number;
  nom: string;
  localisation: string;
  adresse: string;
  ville: string;
  pays: string;
  longitude: number;
  latitude: number;
  description: string;
}

interface PlateauDtoResponse {
  id: number;
  name: string;
  floor: number;
  capacity: number;
  hasMeetingRoom: boolean;
  hasKitchen: boolean;
  hasRestroom: boolean;
}

function Affectation() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const api = useAxiosPrivate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<AffectationDtoResponse[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<number | string>("");
  const [numeroSeries, setNumeroSeries] = useState<string[]>([]);
  const [collaborators, setCollaborators] = useState<
    CollaborateursDtoResponse[]
  >([]);
  const [selectedAgence, setSelectedAgence] = useState<number | null>(null);
  const [plateausForSelectedAgence, setPlateausForSelectedAgence] = useState<
    PlateauDtoResponse[]
  >([]);
  const [agences, setAgences] = useState<AgenceDtoResponse[]>([]);

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
    // Fetch data from the backend API when the component mounts
    const fetchData = async () => {
      try {
        const response = await api.get("/affectations"); // Adjust the URL as needed
        setDataSource(response.data);
      } catch (error) {
        console.error("Error fetching affectations:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchNumeroSeries = async () => {
      try {
        const response = await api.get("/elements"); // Adjust the URL as needed
        const numeroSerieList = response.data.map(
          (element: ElementDtoResponse) => element.numeroSerie
        );
        setNumeroSeries(numeroSerieList);
      } catch (error) {
        console.error("Error fetching numeroSeries:", error);
      }
    };

    fetchNumeroSeries();
  }, []);

  const dataSourceWithCombinedNom = dataSource.map((item) => ({
    ...item,
    combinedNom: `${item.nom} ${item.Prenom}`,
  }));
  const columns = [
    {
      title: "Série Matériel",
      dataIndex: "NumeroSerie",
      key: "NumeroSerie",
    },
    {
      title: "Date Affectation",
      dataIndex: "date_debut",
      key: "date_debut",
      render: (date: Date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Date Fin Affectation",
      dataIndex: "date_fin",
      key: "date_fin",
      render: (date: Date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: "Agence",
      dataIndex: "AgenceNom",
      key: "AgenceNom",
    },
    {
      title: "Plateau",
      dataIndex: "PlateauNom",
      key: "PlateauNom",
    },
    {
      title: "Nom",
      dataIndex: "combinedNom",
      key: "combinedNom",
      render: (_: any, record: AffectationDtoResponse) =>
        `${record.nom} ${record.Prenom}`,
    },

    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: AffectationDtoResponse) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            Voir
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)} // Pass the id here
            color="blue"
          >
            Modifier
          </Button>
          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette affectation ?"
            onConfirm={() => handleDelete(record.id)} // Pass the id here
            okText="Oui"
            color="blue"
            cancelText="Non"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                console.log(record);
                handleDelete(record.id);
              }}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (key: number) => {
    const item = dataSource.find((record) => record.id === key);
    if (!item) return;
    Modal.info({
      title: "Détails de l'affectation",
      content: (
        <div>
          <p>Série Matériel: {item.NumeroSerie}</p>
          <p>
            Date Affectation: {moment(item.date_debut).format("DD/MM/YYYY")}
          </p>
          <p>
            Date Fin Affectation: {moment(item.date_fin).format("DD/MM/YYYY")}
          </p>
          <p>Agence: {item.AgenceNom}</p>
          <p>Plateau: {item.PlateauNom}</p>
          <p>Nom: {item.nom}</p>
          <p>Prenom: {item.Prenom}</p>
        </div>
      ),
    });
  };
  const handleAgenceChange = async (agenceId: number) => {
    setSelectedAgence(agenceId);
    try {
      const response = await api.get(`/agences/${agenceId}/plateaux`);
      setPlateausForSelectedAgence(response.data); // This line is correct
    } catch (error) {
      console.error("Error fetching plateaux:", error);
    }
  };

  const handleAdd = () => {
    form.resetFields(); // Reset the form fields
    setEditingKey(""); // Clear the editing key
    setModalVisible(true);
  };

  const handleSave = async (values: any) => {
    try {
      // If editingKey is present, find its index
      const index =
        editingKey !== ""
          ? dataSource.findIndex((item) => item.id === editingKey)
          : -1;

      if (index > -1) {
        // Editing an existing affectation
        console.log(editingKey);
        const updatedData = await api.put(
          `/affectations/${editingKey}`,
          values
        );
        const newData = dataSource.map((item) =>
          item.id === editingKey ? updatedData.data : item
        );
        setDataSource(newData);
        message.success("Affectation modifiée avec succès.");
      } else {
        // Adding a new affectation
        const response = await api.post("/affectations", values);
        setDataSource([...dataSource, response.data]);
        message.success("Affectation ajoutée avec succès.");
      }

      setEditingKey("");
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving affectation:", error);
      message.error(
        "Une erreur est survenue lors de la sauvegarde de l'affectation."
      );
    }
  };

  const handleEdit = (key: number) => {
    setEditingKey(key); // Set the editingKey to the ID of the element being edited

    // Find the element to edit by ID
    const itemToEdit = dataSource.find((record) => record.id === key);
    console.log(key);
    // Set form fields using the values from the element to edit
    form.setFieldsValue({
      NumeroSerie: itemToEdit?.NumeroSerie,
      date_debut: moment(itemToEdit?.date_debut),
      date_fin: moment(itemToEdit?.date_fin),
      plateau_id: itemToEdit?.plateau_id, // Use the actual value for plateau_id
      collaborateurId: itemToEdit?.collaborateurId, // Use the actual value for collaborateurId
    });

    setModalVisible(true); // Show the modal
  };

  const handleDelete = async (key: number) => {
    console.log(key);
    try {
      // Delete the affectation from the backend
      await api.delete(`/affectations/${key}`);

      // Update the dataSource to remove the deleted record
      const newData = dataSource.filter((record) => record.id !== key);
      setDataSource(newData);

      message.success("Affectation deleted successfully.");
    } catch (error) {
      console.error("Error deleting affectation:", error);
      message.error("An error occurred while deleting the affectation.");
    }
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">Affectations </h1>
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
          dataSource={dataSource}
          columns={columns}
          pagination={{
            position: ["bottomCenter"],
            defaultPageSize: 10,
            pageSizeOptions: [5, 10, 20, 30],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} affectations`,
          }}
          rowKey={(record) => record.id}
        />
        <Modal
          visible={modalVisible}
          title={editingKey ? "Modifier affectation" : "Ajouter affectation"}
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
            setModalVisible(false);
            setEditingKey("");
            form.resetFields();
          }}
          onOk={() => {
            form.validateFields().then((values) => {
              handleSave(values);
            });
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="NumeroSerie"
              label="Série Matériel"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner la série de matériel",
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
              name="date_debut"
              label="Date Affectation"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la date d'affectation",
                },
              ]}
            >
              <DatePicker
                showTime={{ format: "HH:mm" }}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </Form.Item>
            <Form.Item
              name="date_fin"
              label="Date Fin Affectation"
              rules={[
                {
                  required: false,
                  message: "Veuillez entrer la date de fin d'affectation",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item
              name="AgenceId"
              label="Agence"
              rules={[
                { required: true, message: "Veuillez sélectionner une agence" },
              ]}
            >
              <Select
                showSearch
                placeholder="Sélectionner une agence"
                onChange={(value: number) => handleAgenceChange(value)}
              >
                {agences.map((agence) => (
                  <Option key={agence.id} value={agence.id}>
                    {agence.nom}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {selectedAgence !== null && (
              <Form.Item
                name="plateau_id"
                label="Plateau"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un plateau",
                  },
                ]}
              >
                <Select showSearch placeholder="Sélectionner un plateau">
                  {plateausForSelectedAgence.map((plateau) => (
                    <Option key={plateau.id} value={plateau.id}>
                      {plateau.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="collaborateurId"
              label="Nom"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner le collaborateur",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Sélectionner un collaborateur"
                filterOption={(input, option) =>
                  option?.props?.children
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {collaborators.map((collaborator) => (
                  <Option key={collaborator.id} value={collaborator.id}>
                    {`${collaborator.nom} ${collaborator.prenom}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
}

export default Affectation;
