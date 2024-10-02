import React from 'react';
import { Menu, MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  FcDepartment,
  FcInTransit,
  FcMultipleDevices,
  FcDeployment,
  FcServices,
  FcPortraitMode,
  FcOrgUnit,
  FcMindMap,
  FcMultipleInputs,
  FcRules,
  FcStatistics,
  FcOpenedFolder,
  FcIdea,
  FcGenealogy,
  FcConferenceCall,
  FcKey,
} from 'react-icons/fc';
import MenuItem from 'antd/es/menu/MenuItem';
import './menu.css';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Dashboard", "/", <FcStatistics size={"2em"} />),
  { type: "divider" },
  getItem("Utilisateurs", "utilisateurs", <FcKey size={"2em"} />),
  { type: "divider" },
  getItem(
    "Collaborateurs",
    "collaborateurs",
    <FcConferenceCall size={"2em"} />
  ),
  { type: "divider" },
  getItem("Agences", "agences", <FcDepartment size={"2em"} />),
  { type: "divider" },
  getItem("plateaux", "plateaux", <FcGenealogy size={"2em"} />),
  { type: "divider" },
  getItem("Fournisseurs", "fournisseurs", <FcInTransit size={"2em"} />),
  { type: "divider" },
  getItem("Bons", "stock", <FcRules size={"2em"} />),
  { type: "divider" },
  getItem("Materiels", "", <FcIdea size={"2em"} />, [
    getItem("Consommables", "consommables", <FcMindMap size={"1.75em"} />),
    getItem("Actifs", "materiels", <FcMultipleDevices size={"1.75em"} />),
    getItem("Eléments", "elements", <FcMultipleInputs size={"1.75em"} />),
  ]),
  { type: 'divider' },
  getItem('Affectations', 'affectations', <FcPortraitMode size={'2em'} />),
  { type: 'divider' },
  getItem('Reparations', 'reparations', <FcServices size={'2em'} />),
  { type: 'divider' },
  getItem('Réclamations', 'reclamations', <FcOrgUnit size={'2em'} />, [
    getItem(
      'Maintenances',
      'maintenances',
      <FcMultipleDevices size={'1.75em'} />
    ),
    getItem('Besoins', 'besoins', <FcDeployment size={'1.75em'} />),
  ]),
  { type: 'divider' },
  getItem('Catégories', 'categories', <FcOpenedFolder size={'2em'} />),
];

const SideMenu = () => {
  const navigate = useNavigate();

  return (
    <Menu
      mode="inline"
      onClick={(item) => {
        navigate(item.key);
      }}
      style={{ height: "100vh" }}
      className="font-light"
      items={items}
    />
  );
};

export default SideMenu;
