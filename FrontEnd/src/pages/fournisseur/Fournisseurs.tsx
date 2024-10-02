import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Layout,
  Pagination,
  theme,
} from "antd";
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const { Content } = Layout;

interface Fournisseur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  ville: string;
}

const Fournisseur = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const api = useAxiosPrivate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<Fournisseur[]>([]);
  const [filteredData, setFilteredData] = useState<Fournisseur[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const columns = [
    {
      title: "Nom",
      dataIndex: "nom",
      key: "nom",
    },
    {
      title: "Prénom",
      dataIndex: "prenom",
      key: "prenom",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Numéro de téléphone",
      dataIndex: "tel",
      key: "tel",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      key: "ville",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Fournisseur) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            Voir
          </Button>

          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            Modifier
          </Button>

          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchFournisseurs();
  }, []);

  const fetchFournisseurs = async () => {
    try {
      const response = await api.get<Fournisseur[]>("/fournisseurs");
      const data = response.data;
      setDataSource(data);
      setFilteredData(data);
    } catch (error) {
      // Handle the error
    }
  };

  const handleView = (id: string) => {
    const item = dataSource.find((record) => record.id === id);
    Modal.info({
      title: "Détails du fournisseur",
      content: (
        <div>
          <p>Nom: {item?.nom}</p>
          <p>Prénom: {item?.prenom}</p>
          <p>Email: {item?.email}</p>
          <p>Numéro de téléphone: {item?.tel}</p>
          <p>Ville: {item?.ville}</p>
        </div>
      ),
    });
  };

  const handleAdd = () => {
    setModalVisible(true);
    setEditingKey(null); // Reset editing key when adding a new supplier
    form.resetFields(); // Reset form fields
  };

  const handleSave = async (values: Fournisseur) => {
    try {
      let response;

      if (editingKey) {
        response = await api.put(`/fournisseurs/${editingKey}`, values);
      } else {
        response = await api.post("/fournisseurs", values);
      }

      const savedFournisseur = response.data;
      const newData = [...dataSource];

      if (editingKey) {
        const index = newData.findIndex((item) => item.id === editingKey);
        if (index > -1) {
          newData[index] = { id: savedFournisseur.id, ...savedFournisseur };
        }
      } else {
        newData.push({ id: savedFournisseur.id, ...savedFournisseur });
      }

      setDataSource(newData);
      setFilteredData(newData);
      setEditingKey(null);
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Handle the error
    }
  };

  const handleEdit = (id: string) => {
    const item = dataSource.find((record) => record.id === id);
    if (item) {
      form.setFieldsValue({
        id: item.id,
        nom: item.nom,
        prenom: item.prenom,
        email: item.email,
        tel: item.tel,
        ville: item.ville,
      });
      setEditingKey(id);
      setModalVisible(true);
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    setPageSize(pageSize || 10);
  };

  const paginatedData = dataSource.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/fournisseurs/${id}`);
      const newData = dataSource.filter((record) => record.id !== id);
      setDataSource(newData);
      setFilteredData(newData);
    } catch (error) {
      // Handle the error
    }
  };

  const handleSearch = (value: string) => {
    const filtered = dataSource.filter((record) => {
      const fullName = `${record.nom} ${record.prenom}`;
      return fullName.toLowerCase().includes(value.toLowerCase());
    });
    setFilteredData(filtered);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3 ">
          <h1 className="text-2xl font-normal">
            Liste des fournisseurs
            <Input.Search
              placeholder="Nom ou prénom"
              onSearch={handleSearch}
              style={{ width: 200, marginLeft: 16 }}
            />
          </h1>
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
          dataSource={filteredData}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.id}
        />
        <Pagination
          style={{ marginTop: "10px", textAlign: "center" }}
          current={currentPage}
          pageSize={pageSize}
          total={dataSource.length}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
        />
        <Modal
          visible={modalVisible}
          title={editingKey ? "Modifier fournisseur" : "Ajouter fournisseur"}
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
              name="nom"
              label="Nom"
              rules={[{ required: true, message: "Veuillez entrer le nom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="prenom"
              label="Prénom"
              rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Veuillez entrer l'email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="tel"
              label="Numéro de téléphone"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le numéro de téléphone",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ville"
              label="Ville"
              rules={[{ required: true, message: "Veuillez entrer la ville" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Fournisseur;
