import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  Input,
  Space,
  Table,
  Modal,
  InputNumber,
  Select,
  message,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import type { TableColumnsType } from "antd";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

interface DataType {
  key: React.Key;
  id: number;
  agence: string;
  NomMateriel: string;
  Categorie: string;
  type: string;
  marque: string;
  quantiteTotal: string;
}
interface AgenceDtoResponse {
  id: number;
  nom: string;
  localisation: string;
  adresse: string;
  ville: string;
  pays: string;
  longitude: BigInteger;
  latitude: BigInteger;
  description: string;
}
interface ExpandedDataType {
  key: React.Key;
  date: string;
  numeroSerie: string;
  status: string;
  numeroBon: string;
}
interface ActifCategorieDto {
  id: number;
  nom: string;
}
const elementStatusOptions = [
  "DISPONIBLE",
  "ATTRIBUÉ",
  "MAINTENANCE",
  "EN_RÉPARATION",
  "ÉLIMINÉ",
];
interface BonDtoResponse {
  numeroBon: string;
}
const App: React.FC = () => {
  const api = useAxiosPrivate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [expandedFormVisible, setExpandedFormVisible] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [expandedData, setExpandedData] = useState<{
    [key: string]: ExpandedDataType[];
  }>({});
  const [currentRecord, setCurrentRecord] = useState<DataType | null>(null);
  const [editElementModalVisible, setEditElementModalVisible] = useState(false);
  const [currentElement, setCurrentElement] = useState<ExpandedDataType | null>(
    null
  );
  const [agences, setAgences] = useState<AgenceDtoResponse[]>([]);
  const [categories, setCategories] = useState<ActifCategorieDto[]>([]);
  const [isNewCategorySelected, setIsNewCategorySelected] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);
  const [numeroBons, setNumeroBons] = useState<string[]>([]);

  const handleCategorySelect = (value: string) => {
    if (value === "__NEW__") {
      setIsNewCategorySelected(true);
    } else {
      setIsNewCategorySelected(false);
    }
  };

  useEffect(() => {
    api
      .get("/bons")
      .then((response) => {
        const fetchedNumeroBons = response.data.map(
          (bon: BonDtoResponse) => bon.numeroBon
        );
        setNumeroBons(fetchedNumeroBons);
      })
      .catch((error) => {
        message.error("Error fetching numeroBons:", error.message);
      });
  }, []);
  useEffect(() => {
    // Fetch categories data
    api
      .get("/actifs/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        message.error("Error fetching categories data:", error.message);
      });
  }, []);

  useEffect(() => {
    // Fetch actif data
    api
      .get("/actifs")
      .then(async (response) => {
        setData(response.data);

        // Fetch expanded data for each actif
        const expandedDataPromises = response.data.map((actif: DataType) => {
          return api.get(`/actifs/${actif.id}/elements`);
        });

        const expandedDataResponses = await Promise.all(expandedDataPromises);

        const newExpandedData = expandedDataResponses.reduce(
          (acc, response, index) => {
            const actifId = response.config.url.split("/")[2];
            acc[actifId] = response.data;
            return acc;
          },
          {}
        );

        setExpandedData(newExpandedData);
      })
      .catch((error) => {
        message.error("Error fetching actif data:", error.message);
      });
  }, []);

  useEffect(() => {
    // Fetch agences data
    api
      .get("/agences")
      .then((response) => {
        setAgences(response.data);
      })
      .catch((error) => {
        message.error("Error fetching agences data:", error.message);
      });
  }, []);

  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const showAddExpandedForm = () => {
    setExpandedFormVisible(true);
  };

  const handleAddCancel = () => {
    setIsModalVisible(false);
    setCurrentRecord(null);
  };

  const handleAddSubmit = async (values: any) => {
    if (values.actifCategorie === "__NEW__") {
      try {
        const newCategory = values.newCategory;

        // Send a POST request to create a new Actif Category
        const categoryResponse = await api.post("/actifs/categories", {
          nom: newCategory,
        });

        // Update the state with the newly created category
        setCategories([...categories, categoryResponse.data]);

        // Set the new category as selected
        values.actifCategorie = categoryResponse.data.nom;

        // Continue with submitting the form
        submitNewActif(values);
        message.success("nouvelle category ajoutée avec succès.");
      } catch (error: any) {
        message.error("Error creating category:", error.message);
        console.log("Error creating category:");
        // Handle the error, show an error message, etc.
      }
    } else {
      // Continue with submitting the form
      submitNewActif(values);
    }
  };

  const submitNewActif = (values: any) => {
    const agenceId = values.agenceId;
    delete values.agenceId;

    api
      .post("/actifs", { ...values, agenceId })
      .then((response) => {
        // Update the state with the newly created actif
        const newActif = response.data; // Assuming your API returns the created actif data
        setData([...data, newActif]); // Update the state with the new actif
        setIsModalVisible(false);
        // Close the modal
        message.success("actif ajoutée avec succès ");
      })
      .catch((error) => {
        message.error("Error creating actif:", error.message);
        if (error.response) {
          message.error("Response data:", error.response.data.message);
          console.log("Response status:", error.response.status);
          console.log("Response headers:", error.response.headers);
        }
        // ... your existing error handling ...
      });
  };
  const handleEditElementSubmit = (values: any) => {
    if (currentRecord && currentElement) {
      const actifId = currentRecord.id;
      const numeroSerie = currentElement.numeroSerie; // Use "serie" here
      const updatedStatus = values.status;

      const requestData = {
        status: updatedStatus,
      };

      // Send a PUT request to update the element's status
      api
        .put(`/actifs/${actifId}/elements/${numeroSerie}`, requestData)
        .then((response) => {
          // Update the expandedData state to reflect the updated status
          const newExpandedData = { ...expandedData };
          newExpandedData[actifId] = newExpandedData[actifId].map((item) =>
            item.numeroSerie === numeroSerie
              ? { ...item, status: updatedStatus }
              : item
          );
          setExpandedData(newExpandedData);
          setEditElementModalVisible(false);
          message.success("element modifiée avec succès");
        })
        .catch((error) => {
          message.error(
            "Error dans modification d'element:",
            error.response.data.message
          );
        });
    }
  };

  const handleAddExpandedSubmit = (values: any) => {
    if (currentRecord) {
      const actifId = currentRecord.id;
      const requestData = {
        numeroSerie: values.numeroSerie,
        status: values.status,
        bonNumero: values.bonNumero,
      };

      // Send a POST request to create an element for the actif
      api
        .post(`/actifs/${actifId}/elements`, requestData)
        .then((response) => {
          // Update the expandedData state to include the new element
          const newElement = response.data;
          const newExpandedData = { ...expandedData };
          newExpandedData[actifId] = [
            ...(newExpandedData[actifId] || []),
            newElement,
          ];
          setExpandedData(newExpandedData);

          message.success("Element ajoutée avec succés");
        })
        .catch((error) => {
          message.error(
            "Error dans l'ajout d'element:",
            error.response.data.message
          );
        });
    }
  };

  const handleEdit = (record: DataType) => {
    setCurrentRecord(record);
    setIsEditModalVisible(true); // Set the Edit modal visibility to true
  };
  const handleEditSubmit = (values: any) => {
    if (currentRecord) {
      const agenceId = values.agenceId;
      delete values.agenceId;

      const updateValues = { ...values, id: currentRecord.id, agenceId };
      api
        .put(`/actifs/${currentRecord.id}`, updateValues)
        .then((response) => {
          // Update the state with the updated actif
          const updatedActif = response.data; // Assuming your API returns the updated actif data
          const updatedData = data.map((item) =>
            item.id === currentRecord.id ? updatedActif : item
          );
          setData(updatedData); // Update the state with the updated actif data
          setIsEditModalVisible(false);
          message.success("actif modifier avec succés"); // Close the edit modal
        })
        .catch((error) => {
          message.error(
            "Error dans la modification d'actif:",
            error.response.data.message
          );
          if (error.response) {
            console.log("Response data:", error.response.data);
            console.log("Response status:", error.response.status);
            console.log("Response headers:", error.response.headers);
          }
          // ... your existing error handling ...
        });
    }
  };

  const handleDelete = (record: DataType) => {
    // Send a DELETE request to delete the actif
    api
      .delete(`/actifs/${record.id}`)
      .then((response) => {
        // Remove the deleted actif from the data array
        const newData = data.filter((item) => item.id !== record.id);
        setData(newData);
        console.log("Before message.success()");

        message.success("actif supprimé avec succés");
        console.log("After message.success()");
      })
      .catch((error) => {
        console.error(
          "Error dans la supprission d'actif",
          error.response.data.message
        );
      });
  };

  const handleEditElement = (
    record: DataType,
    elementRecord: ExpandedDataType
  ) => {
    // Set the current record and element data to be edited
    setCurrentRecord(record);
    setCurrentElement(elementRecord);

    // Open the modal for editing the element's status
    setEditElementModalVisible(true);
  };

  const handleDeleteElement = (
    record: DataType,
    elementRecord: ExpandedDataType
  ) => {
    console.log(record);
    console.log(elementRecord);

    if (record) {
      const actifId = record.id;
      const numeroSerie = elementRecord.numeroSerie; // Use "serie" here

      console.log("Deleting element with actifId:", actifId);
      console.log("Deleting element with numeroSerie:", numeroSerie);

      // Send a DELETE request to delete the element
      api
        .delete(`/actifs/${actifId}/elements/${numeroSerie}`)
        .then((response) => {
          // Update the expandedData state to remove the deleted element
          const newExpandedData = { ...expandedData };
          newExpandedData[actifId] = newExpandedData[actifId].filter(
            (item) => item.numeroSerie !== numeroSerie
          );
          setExpandedData(newExpandedData);
          message.success("element supprimé avec succés");
        })
        .catch((error) => {
          message.error(
            `Error dans la supprission d'element :s ${error.response.data.message}`
          );
        });
    }
  };

  const expandedRowRender = (record: DataType) => {
    const columns: TableColumnsType<ExpandedDataType> = [
      {
        title: "Date prise bon",
        dataIndex: "bonDatePrise",
        key: "date",
        render: (value) => {
          const indexOfT = value.indexOf("T");
          return value.substring(0, indexOfT);
        },
      },
      { title: "Série Element", dataIndex: "numeroSerie", key: "numeroSerie" },
      { title: "actif Nom", dataIndex: "actifNom", key: "actifNom" },
      { title: "status", dataIndex: "status", key: "status" },
      { title: "numero Bon", dataIndex: "numeroBon", key: "numeroBon" },

      {
        title: "Actions",
        key: "action",
        render: (_, elementRecord: ExpandedDataType) => (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditElement(record, elementRecord)}
            >
              Modifier Élément
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteElement(record, elementRecord)}
              danger
            >
              Supprimer Élément
            </Button>
          </Space>
        ),
      },
    ];

    const expandedRowData = expandedData[record.id] || [];

    return (
      <div>
        <Table
          columns={columns}
          dataSource={expandedRowData}
          pagination={{
            pageSize: 3,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} Elements`,
          }}
        />
      </div>
    );
  };

  const columns: TableColumnsType<DataType> = [
    { title: "Agence", dataIndex: "agence", key: "agence" },
    { title: "Nom matériel", dataIndex: "nom", key: "nom" },
    { title: "Catégorie", dataIndex: "actifCategorie", key: "actifCategorie" },
    { title: "modele", dataIndex: "modele", key: "modele" },
    { title: "Quantité Total", dataIndex: "quantite", key: "quantite" },

    { title: "Marque", dataIndex: "marque", key: "marque" },
    {
      title: "Quantite Disponible",
      dataIndex: "quantiteDisponible",
      key: "quantiteDisponible",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },

    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => {
              setCurrentRecord(record);
              showAddExpandedForm();
            }}
          >
            Ajouter un élément
          </Button>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            Modifier
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            danger
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];
  const handleExpand = (expanded: boolean, record: DataType) => {
    if (expanded) {
      setExpandedRowKeys([record.key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-normal">Matériels Actifs</h1>
        <Button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#008537",
            border: "#00471e",
            color: "#fff",
          }}
          onClick={showAddModal}
          icon={<PlusOutlined />}
        >
          Ajouter
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data.map((record) => ({ ...record, key: record.id }))} // Assign the key property
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
          expandedRowKeys: expandedRowKeys,
          onExpand: (expanded, record) => handleExpand(expanded, record),
        }}
        pagination={{
          position: ["bottomCenter"],
          defaultPageSize: 5,
          pageSizeOptions: [5, 10, 20, 30],
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} Actifs`,
        }}
      />

      <Modal
        title="Ajouter un actif"
        visible={isModalVisible}
        onCancel={handleAddCancel}
        footer={null}
      >
        <Form onFinish={handleAddSubmit}>
          {/* Form fields for adding */}
          <Form.Item label="Nom matériel" name="nom">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Marque" name="marque">
            <Input />
          </Form.Item>
          <Form.Item label="Agence" name="agenceId">
            <Select>
              {agences.map((agence) => (
                <Select.Option key={agence.id} value={agence.id}>
                  {agence.nom}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Quantité Total" name="quantite">
            <InputNumber />
          </Form.Item>
          <Form.Item label="Modèle" name="modele">
            <Input />
          </Form.Item>
          <Form.Item label="Catégorie" name="actifCategorie">
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.props?.children
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) ?? false
              }
              onSelect={(value) => handleCategorySelect(value)}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.nom}>
                  {category.nom}
                </Select.Option>
              ))}
              <Select.Option key="__NEW__" value="__NEW__">
                + Add New Category
              </Select.Option>
            </Select>
          </Form.Item>

          {/* Conditional input field for new category */}
          {isNewCategorySelected && (
            <Form.Item label="New Catégory" name="newCategory">
              <Input />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Ajouter un élément étendu"
        open={expandedFormVisible}
        onCancel={() => setExpandedFormVisible(false)}
        footer={null}
      >
        <Form onFinish={handleAddExpandedSubmit}>
          {/* Form fields for expanded data */}
          <Form.Item
            label="Numéro de série"
            name="numeroSerie"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le numéro de série",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status">
            <Select>
              {elementStatusOptions.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Numéro de bon"
            name="bonNumero"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le numéro de bon",
              },
            ]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.props?.children
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) ?? false
              }
            >
              {numeroBons.map((numeroBon) => (
                <Select.Option key={numeroBon} value={numeroBon}>
                  {numeroBon}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Modifier Élément"
        visible={editElementModalVisible}
        onCancel={() => setEditElementModalVisible(false)}
        footer={null}
      >
        <Form
          onFinish={handleEditElementSubmit}
          initialValues={
            currentElement ? { status: currentElement.status } : undefined
          }
        >
          {/* Form field for editing element's status */}
          <Form.Item label="Status" name="status">
            <Select>
              {elementStatusOptions.map((status) => (
                <Select.Option key={status} value={status}>
                  {status}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              Modifier
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Modifier Actif"
        visible={isEditModalVisible} // Use isEditModalVisible here
        onCancel={() => setIsEditModalVisible(false)} // Close the Edit modal
        footer={null}
      >
        {currentRecord && (
          <Form onFinish={handleEditSubmit} initialValues={currentRecord}>
            {/* Form fields for editing */}
            <Form.Item label="Agence" name="agenceId">
              <Select>
                {agences.map((agence) => (
                  <Select.Option key={agence.id} value={agence.id}>
                    {agence.nom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Nom matériel" name="nom">
              <Input />
            </Form.Item>
            <Form.Item label="Marque" name="marque">
              <Input />
            </Form.Item>

            <Form.Item label="Catégorie" name="actifCategorie">
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.props?.children
                    ?.toLowerCase()
                    .includes(input.toLowerCase()) ?? false
                }
                onSelect={(value) => handleCategorySelect(value)}
              >
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.nom}>
                    {category.nom}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Quantité Total" name="quantite">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item label="Modèle" name="modele">
              <Input />
            </Form.Item>

            <Form.Item label="Quantité Disponible" name="quantiteDisponible">
              <Input />
            </Form.Item>
            <Form.Item label="description" name="description">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: "green", borderColor: "green" }}
              >
                Modifier
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default App;
