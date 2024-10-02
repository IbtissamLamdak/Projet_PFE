import { useState, useRef } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Layout,
  theme,
  Select,
  Popconfirm,
  InputRef,
  Tag,
  DatePicker,
  InputNumber,
  Radio,
} from 'antd';
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/auth/useAxiosPrivate';
import { BASE_API_URL } from '../../api/axios/axios';
import { ToastContainer, toast } from 'react-toastify';
import axiosBase from 'axios';
import AgenceService from '../../services/agence/AgenceService';
import { AgenceID, AgenceResponseDto } from '../../services/agence/AgenceTypes';
import { Option } from 'antd/es/mentions';
import {
  CollaborateurID,
  CollaborateurRequestDto,
  CollaborateurResponseDto,
  resource,
} from '../../services/collaborateur/CollaborateurTypes';
import CollaborateurService from '../../services/collaborateur/CollaborateurService';
import moment from 'moment';
import ActifService from '../../services/actif/ActifService';
import ConsommableService from '../../services/consommable/ConsommableService';
import { ActifResponseDto } from '../../services/actif/ActifTypes';
import { ConsommableResponseDto } from '../../services/consommable/ConsommableTypes';
import {
  BesoinID,
  BesoinRequestDto,
  BesoinResponseDto,
  BesoinUpdateRequestDto,
} from '../../services/besoin/BesoinTypes';
import BesoinService from '../../services/besoin/BesoinService';

const Besoins = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const queryClient = useQueryClient();
  const axios = useAxiosPrivate();
  const [selectedType, setSelectedType] = useState('');
  const [showMaterielSelect, setShowMaterielSelect] = useState(true);
  const [formAdd] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const besoinService = new BesoinService(`${BASE_API_URL}/besoins`, axios);
  const collaborateurService = new CollaborateurService(
    `${BASE_API_URL}/collaborateurs`,
    axios
  );
  const actifService = new ActifService(`${BASE_API_URL}/actifs`, axios);
  const consommableService = new ConsommableService(
    `${BASE_API_URL}/consommables`,
    axios
  );

  const { isLoading: loadingBesoins, data: besoins } = useQuery<
    BesoinResponseDto[]
  >(['besoins'], () => besoinService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, {
            position: 'bottom-right',
          });
        } else {
          toast.error(error.message, { position: 'bottom-right' });
        }
      }
    },
  });
  const { isLoading: loadingCollaborateurs, data: collaborateurs } = useQuery<
    CollaborateurResponseDto[]
  >(['collaborateurs'], () => collaborateurService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, {
            position: 'bottom-right',
          });
        } else {
          toast.error(error.message, { position: 'bottom-right' });
        }
      }
    },
  });

  const { isLoading: loadingActifs, data: actifs } = useQuery<
    ActifResponseDto[]
  >(['actifs'], () => actifService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, {
            position: 'bottom-right',
          });
        } else {
          toast.error(error.message, { position: 'bottom-right' });
        }
      }
    },
  });

  const { isLoading: loadingConsommables, data: consommables } = useQuery<
    ConsommableResponseDto[]
  >(['consommables'], () => consommableService.getAll(), {
    onError: (error) => {
      if (axiosBase.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response.data.error, {
            position: 'bottom-right',
          });
        } else {
          toast.error(error.message, { position: 'bottom-right' });
        }
      }
    },
  });

  const { isLoading: addLoading, mutate: addBesoin } = useMutation(
    (besoin: BesoinRequestDto) => besoinService.create(besoin),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['besoins']);
        toast.success('Besoin ajouté avec succès', {
          position: 'bottom-right',
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: 'bottom-right',
            });
          } else {
            toast.error(error.message, { position: 'bottom-right' });
          }
        }
      },
    }
  );

  const {
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    isError: errorUpdate,
    mutate: updateBesoin,
  } = useMutation(
    ({ id, data }: { id: BesoinID; data: BesoinUpdateRequestDto }) =>
      besoinService.update(id, data),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['besoins']);
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: 'bottom-right',
            });
          } else {
            toast.error(error.message, { position: 'bottom-right' });
          }
        }
      },
    }
  );

  const { isLoading: deleteLoading, mutate: deleteBesoin } = useMutation(
    (besoinId: BesoinID) => besoinService.delete(besoinId),
    {
      onSuccess(data) {
        queryClient.invalidateQueries(['besoins']);
        toast.success('Besoin supprimé avec succès', {
          position: 'bottom-right',
        });
      },
      onError: (error) => {
        if (axiosBase.isAxiosError(error)) {
          if (error.response) {
            toast.error(error.response.data.error, {
              position: 'bottom-right',
            });
          } else {
            toast.error(error.message, { position: 'bottom-right' });
          }
        }
      },
    }
  );

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value: CollaborateurID) => <Tag color="#108ee9">#{value}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Date de réclamation',
      dataIndex: 'dateReclamation',
      key: 'dateReclamation',
      render: (date: Date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'Quantite',
      dataIndex: 'quantite',
      key: 'quantite',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Materiel',
      dataIndex: 'materiel',
      key: 'materiel',
      render: (value: { id: number; nom: string }) => <>{value.nom}</>,
    },
    {
      title: 'Collaborateur',
      dataIndex: 'collaborateur',
      key: 'collaborateur',
      render: (value: {
        id: CollaborateurID;
        nom: string;
        prenom: string;
        agence: {
          id: AgenceID;
          nom: string;
        };
      }) => (
        <>
          {value.nom} {value.prenom}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, besoin: any) => (
        <Space direction="horizontal">
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
            icon={<EyeOutlined />}
            onClick={() => handleView(besoin)}
          >
            Voir
          </Button>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
            icon={<EditOutlined />}
            onClick={() => handleEdit(besoin)}
          >
            Modifier
          </Button>
          <Popconfirm
            title="Supprimer consommalbe"
            description="Êtes-vous sûr de vouloir supprimer ce besoin"
            onConfirm={() => handleDelete(besoin)}
            okText="Oui"
            cancelText="Non"
            placement="left"
            okButtonProps={{
              loading: deleteLoading,
              style: {
                backgroundColor: '#007bff',
                border: '#007bff',
                color: '#fff',
              },
            }}
          >
            <Button
              danger
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
              icon={<DeleteOutlined />}
            >
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleFormValuesChange = (changedValues: any) => {
    const formFieldName = Object.keys(changedValues)[0];
    if (formFieldName === 'materielType') {
      formAdd.setFieldValue('materielId', null);
      const value = changedValues[formFieldName];
      setShowMaterielSelect(false);
      setSelectedType(value);
    }
  };

  const handleView = (besoin: BesoinResponseDto) => {
    Modal.info({
      title: 'Détails de besoin',
      content: (
        <div>
          <p>ID: {besoin.id}</p>
          <p>Description: {besoin.description}</p>
          <p>
            Date de réclamation:{' '}
            {moment(besoin.dateReclamation).format('YYYY-MM-DD HH:mm:ss')}
          </p>
          <p>Status: {besoin.status}</p>
          <p>Quantite: {besoin.quantite}</p>
          <p>Materiel: {besoin.materiel.nom}</p>
          <p>
            collaborateur:{' '}
            {`${besoin.collaborateur.nom} ${besoin.collaborateur.prenom}`}
          </p>
          <p>Agence: {besoin.collaborateur.agence.nom}</p>
        </div>
      ),
      okButtonProps: {
        style: {
          backgroundColor: '#007bff',
          border: '#007bff',
          color: '#fff',
          width: '20%',
          marginTop: '10px',
        },
      },
    });
  };

  const handleAdd = () => {
    setShowAddModal(true);
    formAdd.resetFields();
  };

  const handleSave = async (besoin: BesoinRequestDto) => {
    setShowAddModal(false);
    besoin.dateReclamation = moment(besoin.dateReclamation).format(
      'YYYY-MM-DD'
    );
    addBesoin(besoin);
    formAdd.resetFields();
  };

  const handleEdit = async (besoin: BesoinResponseDto) => {
    setShowUpdateModal(true);
    console.log(besoin);
    formUpdate.setFieldsValue({
      id: besoin.id,
      collaborateurId: besoin.collaborateur.id,
      dateReclamation: moment(besoin.dateReclamation),
      status: besoin.status,
      quantite: besoin.quantite,
      description: besoin.description,
    });
    console.log(formUpdate.getFieldsValue());
  };

  const handleEditSubmit = (
    besoinId: BesoinID,
    besoin: BesoinUpdateRequestDto
  ) => {
    const updatedBesoin: BesoinUpdateRequestDto = {
      description: besoin.description,
      dateReclamation: besoin.dateReclamation,
      status: besoin.status,
      quantite: besoin.quantite,
      collaborateurId: besoin.collaborateurId,
      materielId: besoin.materielId,
    };

    try {
      updateBesoin({
        id: besoinId,
        data: updatedBesoin,
      });
      toast.success('Besoin modifié avec succès', {
        position: 'bottom-right',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = (besoin: BesoinResponseDto) => {
    const id = besoin.id;
    deleteBesoin(id);
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-normal">Besoins</h1>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#008537',
              border: '#00471e',
              color: '#fff',
            }}
            onClick={handleAdd}
            icon={<PlusOutlined />}
          >
            Ajouter
          </Button>
        </div>
        <Table
          bordered
          columns={columns}
          loading={loadingBesoins}
          dataSource={besoins}
          rowKey={(besoin) => besoin.id}
          pagination={{
            defaultPageSize: 5,
            pageSizeOptions: [5, 10, 20, 30, 50, 100],
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total}`,
            position: ['bottomCenter'],
          }}
        />
        <Modal
          open={showAddModal}
          title="Ajouter besoin"
          okButtonProps={{
            style: {
              backgroundColor: '#007bff',
              border: '#007bff',
              color: '#fff',
              width: '20%',
              marginTop: '10px',
            },
          }}
          cancelButtonProps={{
            style: {
              width: '20%',
            },
          }}
          onCancel={() => {
            setShowAddModal(false);
            formAdd.resetFields();
          }}
          onOk={() => {
            formAdd
              .validateFields()
              .then((values) => {
                handleSave(values);
              })
              .catch((info) => console.log(info));
          }}
        >
          <Form
            form={formAdd}
            layout="vertical"
            onValuesChange={handleFormValuesChange}
          >
            <Form.Item
              name="collaborateurId"
              label="Collaborateur"
              rules={[
                { required: true, message: 'Veuillez entrer collaborateur' },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Sélectionner un collaborateur"
                loading={loadingCollaborateurs}
              >
                {collaborateurs?.map((collaborateur) => {
                  return (
                    <Option
                      value={collaborateur.id.toString()}
                      key={collaborateur.id.toString()}
                    >
                      {`${collaborateur.nom} ${collaborateur.prenom}`}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="materielType" label="Type de Materiel">
              <Radio.Group>
                <Radio value="actif">Matériels Actifs</Radio>
                <Radio value="consommable">Matériels Consommables</Radio>
              </Radio.Group>
            </Form.Item>
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
                    return children.toLowerCase().includes(input.toLowerCase());
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
            <Form.Item
              name="dateReclamation"
              label="Date de réclamation"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer date de réclamation',
                },
              ]}
            >
              <DatePicker format={'YYYY-MM-DD'} className="w-full" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status de réclamation"
              rules={[
                { required: true, message: 'Veuillez sélectionner status' },
              ]}
            >
              <Select allowClear>
                <Select.Option key={'OUVERT'}>OUVERT</Select.Option>
                <Select.Option key={'EN_COURS'}>EN_COURS</Select.Option>
                <Select.Option key={'RESOLU'}>RESOLU</Select.Option>
                <Select.Option key={'FERME'}>FERME</Select.Option>
                <Select.Option key={'ANNULE'}>ANNULE</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantite"
              label="Quantite"
              rules={[
                { required: true, message: 'Veuillez entrer le quantite' },
              ]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Veuillez entrer description' },
              ]}
            >
              <Input.TextArea
                autoSize
                minLength={5}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={showUpdateModal}
          title="Modifier besoin"
          onCancel={() => {
            setShowUpdateModal(false);
            formUpdate.resetFields();
          }}
          onOk={() => {
            formUpdate
              .validateFields()
              .then((values) => {
                handleEditSubmit(values.id, values);
                setShowUpdateModal(false);
              })
              .catch((info) => console.log(info));
          }}
        >
          <Form
            form={formUpdate}
            layout="vertical"
            onValuesChange={handleFormValuesChange}
          >
            <Form.Item name="id" label="id" hidden>
              <InputNumber disabled />
            </Form.Item>
            <Form.Item
              name="collaborateurId"
              label="Collaborateur"
              rules={[
                { required: true, message: 'Veuillez entrer collaborateur' },
              ]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Sélectionner un collaborateur"
                loading={loadingCollaborateurs}
              >
                {collaborateurs?.map((collaborateur) => {
                  return (
                    <Select.Option
                      value={collaborateur.id.toString()}
                      key={collaborateur.id.toString()}
                    >
                      {`${collaborateur.nom} ${collaborateur.prenom}`}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="materielType" label="Type de Materiel">
              <Radio.Group>
                <Radio value="actif">Matériels Actifs</Radio>
                <Radio value="consommable">Matériels Consommables</Radio>
              </Radio.Group>
            </Form.Item>
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
                    return children.toLowerCase().includes(input.toLowerCase());
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
            <Form.Item
              name="dateReclamation"
              label="Date de réclamation"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer date de réclamation',
                },
              ]}
            >
              <DatePicker format={'YYYY-MM-DD'} className="w-full" />
            </Form.Item>
            <Form.Item
              name="status"
              label="Status de réclamation"
              rules={[
                { required: true, message: 'Veuillez sélectionner status' },
              ]}
            >
              <Select allowClear>
                <Select.Option key={'OUVERT'}>OUVERT</Select.Option>
                <Select.Option key={'EN_COURS'}>EN_COURS</Select.Option>
                <Select.Option key={'RESOLU'}>RESOLU</Select.Option>
                <Select.Option key={'FERME'}>FERME</Select.Option>
                <Select.Option key={'ANNULE'}>ANNULE</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="quantite"
              label="Quantite"
              rules={[
                { required: true, message: 'Veuillez entrer le quantite' },
              ]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: 'Veuillez entrer description' },
              ]}
            >
              <Input.TextArea
                autoSize
                minLength={5}
                maxLength={100}
                showCount
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Besoins;
