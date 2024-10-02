import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Space,
  Layout,
  Menu,
  Select,
  Radio,
  Pagination,
  theme,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

const { Content } = Layout;

interface StockItem {
  key: string;
  numeroBon: string;
  materiel: string;
  materielId: number;
  prix: number;
  quantiteDemande: number;
  dateLivraison: string;
  fournisseur: string;
  fournisseurId: number;
  fournisseurNom: string;
  fournisseurPrenom: string;
}

interface Actif {
  id: number;
  nom: string;
}

interface Consommable {
  id: number;
  nom: string;
}

function Stock() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const api = useAxiosPrivate();
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<StockItem[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [showMaterielSelect, setShowMaterielSelect] = useState(true);
  const [actifs, setActifs] = useState<Actif[]>([]);
  const [consommables, setConsommables] = useState<Consommable[]>([]);
  const [selectedType, setSelectedType] = useState('');

  const [supplierList, setSupplierList] = useState<
    {
      id: number;
      nom: string;
      prenom: string;
    }[]
  >([]);
  const [selectedSupplier, setSelectedSupplier] = useState<{
    id: number;
    nom: string;
    prenom: string;
  } | null>(null);

  useEffect(() => {
    fetchStockData();
    fetchSupplierList();
  }, []);

  const fetchStockData = () => {
    api
      .get("/bons")
      .then((response) => {
        setDataSource(
          response.data.map((item: StockItem) => ({
            ...item,
            key: item.numeroBon,
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching stock data:', error);
      });
  };

  const fetchSupplierList = () => {
    api
      .get("/fournisseurs")
      .then((response) => {
        setSupplierList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching supplier list:', error);
      });
  };

  const fetchConsommables = async () => {
    try {
      const response = await api.get("/consommables");
      setConsommables(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchActifs = async () => {
    try {
      const response = await api.get("/actifs");
      setActifs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchConsommables();
    fetchActifs();
  }, []);

  const handleAdd = () => {
    setShowMaterielSelect(true);
    setModalVisible(true);
    setEditingKey('new');
    form.resetFields();
  };

  const handleSave = (key: string) => {
    form.validateFields().then(async (values) => {
      console.log(values);
      try {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
          const item = newData[index];
          await api.put(`/bons/${item.numeroBon}`, values);
          // newData[index] = { ...item, ...values };
        } else {
          const response = await api.post("/bons", values);
          const newItem: StockItem = {
            ...values,
            key: response.data.numeroBon,
          };
          console.log(newItem);
          // newData.push(newItem);
          setSelectedSupplier(null);
        }

        // setDataSource(newData);
        setEditingKey("");
        setModalVisible(false);
        form.resetFields();
        fetchStockData();
      } catch (error) {
        console.error("Error saving item:", error);
      }
    });
  };

  const handleDelete = async (record: StockItem) => {
    try {
      await api.delete(`/bons/${record.numeroBon}`);
      fetchStockData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCancel = () => {
    setEditingKey('');
    setSelectedItem(null);
    setSelectedSupplier(null);
    setModalVisible(false);
    form.resetFields();
  };

  const renderSupplierMenu = (currentSupplierId: number) => (
    <Menu>
      {supplierList.map((supplier) => (
        <Menu.Item key={supplier.id}>
          <Button
            onClick={() => handleSupplierSelect(supplier.id)}
            type={supplier.id === currentSupplierId ? 'primary' : 'default'}
          >
            {supplier.nom}
          </Button>
        </Menu.Item>
      ))}
    </Menu>
  );

  const handleSupplierSelect = (id: number) => {
    const selectedSupplier = supplierList.find(
      (supplier) => supplier.id === id
    );
    if (selectedSupplier) {
      setSelectedSupplier(selectedSupplier);
    }
  };

  const handleFormValuesChange = (changedValues: any) => {
    const formFieldName = Object.keys(changedValues)[0];
    if (formFieldName === 'materielType') {
      form.setFieldValue('materielId', null);
      const value = changedValues[formFieldName];
      setShowMaterielSelect(false);
      setSelectedType(value);
    }
  };

  const handleSupplierSearch = (searchText: string) => {};
  const handleEdit = (record: StockItem) => {
    setEditingKey(record.key);
    setSelectedItem(record);
    setModalVisible(true);
    console.log('edit function');
    console.log(record);
    form.setFieldsValue({
      dateLivraison: moment(record.dateLivraison),
      numeroBon: record.numeroBon,
      fournisseurId: record.fournisseurId,
      prix: record.prix,
      materielType: selectedType,
      materielId: record.materielId,
      quantiteDemande: record.quantiteDemande,
    });

    if (
      record.materielId &&
      actifs.some((actif) => actif.id === record.materielId)
    ) {
      setSelectedType('actif');
    } else if (
      record.materielId &&
      consommables.some((consommable) => consommable.id === record.materielId)
    ) {
      setSelectedType('consommable');
    } else {
      setSelectedType('');
    }

    setShowMaterielSelect(record.materielId !== null);
  };

  const columns = [
    {
      title: 'Date de livraison',
      dataIndex: 'dateLivraison',
      key: 'dateLivraison',
    },
    {
      title: 'N° Bon de livraison',
      dataIndex: 'numeroBon',
      key: 'numeroBon',
    },
    {
      title: 'Fournisseur',
      dataIndex: 'fournisseur',
      key: 'fournisseur',
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      key: 'prix',
    },
    {
      title: 'Materiel',
      dataIndex: 'materiel',
      key: 'designation',
    },
    {
      title: 'Quantité',
      dataIndex: 'quantiteDemande',
      key: 'quantiteDemande',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: StockItem) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
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

  return (
    <Layout style={{ background: colorBgContainer }}>
      <Content>
        <div>
          <div className="flex items-center justify-between mb-3 ">
            <h1 className="text-2xl font-normal">Liste des bons</h1>
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
            pagination={false}
            rowKey={(record) => record.key}
          />
          <Pagination
            style={{ marginTop: "10px", textAlign: "center" }}
            pageSize={10}
            showSizeChanger
            showQuickJumper
          />
          <Modal
            visible={modalVisible}
            title={editingKey ? "Ajouter Bon" : "Modifier Bon"}
            okButtonProps={{
              style: {
                backgroundColor: "#007bff",
                border: "#007bff",
                color: "#fff",
                width: "20%",
                marginTop: "10px",
              },
            }}
            onCancel={handleCancel}
            onOk={() => {
              handleSave(editingKey);
              setModalVisible(false);
            }}
          >
            <Form form={form} onValuesChange={handleFormValuesChange}>
              <Form.Item name="dateLivraison" label="Date de livraison">
                <DatePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DDTHH:mm"
                />
              </Form.Item>
              <Form.Item name="numeroBon" label="N° Bon de livraison">
                <Input />
              </Form.Item>
              <Form.Item label="Fournisseur" name="fournisseurId">
                <Select
                  showSearch
                  placeholder="Sélectionner un fournisseur"
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (option && typeof option.children === 'string') {
                      const children = option.children as string;
                      return children
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }
                    return false;
                  }}
                >
                  {supplierList.map((supplier) => (
                    <Select.Option key={supplier.id} value={supplier.id}>
                      {`${supplier.nom} ${supplier.prenom}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="prix" label="Prix">
                <InputNumber />
              </Form.Item>
              <Form.Item name="materielType" label="Type de Materiel">
                <Radio.Group>
                  <Radio value="actif">Matériels Actifs</Radio>
                  <Radio value="consommable">Matériels Consommables</Radio>
                </Radio.Group>
              </Form.Item>
              {/* <Form.Item name="materielId" label="Materiel">
                <InputNumber />
              </Form.Item> */}
              {/**/}
              <Form.Item
                label={`Matériel ${selectedType}`}
                name="materielId"
                hidden={showMaterielSelect}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder={`Sélectionner un matériel ${selectedType}`}
                  optionFilterProp="children"
                  filterOption={(input, option) => {
                    if (option && typeof option.children === 'string') {
                      const children = option.children as string;
                      return children
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }
                    return false;
                  }}
                >
                  {selectedType && selectedType === 'actif'
                    ? actifs?.map((actif) => (
                        <Select.Option key={actif.id} value={actif.id}>
                          {actif.id} - {actif.nom}
                        </Select.Option>
                      ))
                    : consommables?.map((consommable) => (
                        <Select.Option
                          key={consommable.id}
                          value={consommable.id}
                        >
                          {consommable.id} - {consommable.nom}
                        </Select.Option>
                      ))}
                </Select>
              </Form.Item>

              <Form.Item name="quantiteDemande" label="Quantité">
                <InputNumber min={0} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Content>
    </Layout>
  );
}

export default Stock;
