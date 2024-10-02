import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Layout,
  Select,
  theme,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const { Option } = Select;

function Elements() {
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const api = useAxiosPrivate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string | number>("");
  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const ColumnFilter =
    (dataIndex: string) =>
    ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) =>
      (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      );

  const columns = [
    {
      title: "Série Element",
      dataIndex: "numeroSerie",
      key: "numeroSerie",
      filterDropdown: ColumnFilter("numeroSerie"),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: string | number | boolean, record: any) =>
        record.numeroSerie
          ? record.numeroSerie
              .toString()
              .toLowerCase()
              .includes(String(value).toLowerCase())
          : false,
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      filterDropdown: ColumnFilter("status"),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: string | number | boolean, record: any) =>
        record.numeroSerie
          ? record.status
              .toString()
              .toLowerCase()
              .includes(String(value).toLowerCase())
          : false,
    },
    {
      title: "Nom Actif",
      dataIndex: "actifNom",
      key: "actifNom",
      filterDropdown: ColumnFilter("actifNom"),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: string | number | boolean, record: any) =>
        record.numeroSerie
          ? record.actifNom
              .toString()
              .toLowerCase()
              .includes(String(value).toLowerCase())
          : false,
    },
    {
      title: "Numéro Bon",
      dataIndex: "numeroBon",
      key: "numeroBon",
      filterDropdown: ColumnFilter("numeroBon"),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value: string | number | boolean, record: any) =>
        record.numeroSerie
          ? record.numeroBon
              .toString()
              .toLowerCase()
              .includes(String(value).toLowerCase())
          : false,
    },
    {
      title: "Date Prise Bon",
      dataIndex: "bonDatePrise",
      key: "bonDatePrise",
    },
  ];

  const fetchElements = async () => {
    try {
      const response = await api.get("/elements");
      setDataSource(response.data);
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  const handleSave = async (values: any) => {
    try {
      if (editingKey) {
        await api.put(
          `/actifs/${values.actifId}/elements/${editingKey}`,
          values
        );
      } else {
        await api.post(`/actifs/${values.actifId}/elements`, values);
      }
      setModalVisible(false);
      setEditingKey("");
      form.resetFields();
      await fetchElements();
    } catch (error) {
      console.error("Error saving element:", error);
    }
  };

  const showModal = (record: any) => {
    setEditingKey(record.key);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: string
  ) => {
    confirm();
    setFilters((prevFilters) => ({
      ...prevFilters,
      [dataIndex]: selectedKeys[0],
    }));
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setFilters({});
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <h2 className="text-2xl font-normal">Listes des élements</h2>

        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          rowKey={(record) => record.key}
          onChange={(pagination, filters, sorter) => {}}
        />
        <Modal
          visible={modalVisible}
          title={editingKey ? "Modifier Element" : "Ajouter Element"}
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
        ></Modal>
      </div>
    </Layout>
  );
}

export default Elements;
