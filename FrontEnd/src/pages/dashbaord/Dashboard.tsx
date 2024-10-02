import React, { useEffect, useState } from "react";
import {
  Card,
  Space,
  Statistic,
  Table,
  Typography,
  List,
  Badge,
  Layout,
  theme,
} from "antd";
import { Bar } from "react-chartjs-2";
import useAxiosPrivate from "../../hooks/auth/useAxiosPrivate";

import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  AppstoreAddOutlined,
  ShakeOutlined,
} from "@ant-design/icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
interface DashboardProps {}

interface DataResponse {
  actifs: number;
  consommables: number;
}

function Dashboard({}: DashboardProps) {
  const axios = useAxiosPrivate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [conso, setConso] = useState<number>(0);
  const [actif, setActif] = useState<number>(0);
  const [element, setElement] = useState<number>(0);

  const [orders, setOrders] = useState<number>(0);
  const [inventory, setInventory] = useState<number>(0);
  const [customers, setCustomers] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);
  const [maintenance, setMaintenance] = useState<number>(0);

  const [data, setData] = useState<DataResponse>({
    actifs: 0,
    consommables: 0,
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/consommables")
      .then((response) => {
        const consommables = response.data;
        setConso(consommables.length);
      })
      .catch((error) => {
        console.error("Error fetching agencies:", error);
      });
    axios
      .get("http://localhost:8080/api/actifs")
      .then((response) => {
        const actifs = response.data;
        setActif(actifs.length);
      })
      .catch((error) => {
        console.error("Error fetching agencies:", error);
      });
    axios
      .get("http://localhost:8080/api/elements")
      .then((response) => {
        const element = response.data;
        setElement(element.length);
      })
      .catch((error) => {
        console.error("Error fetching agencies:", error);
      });
    axios
      .get("http://localhost:8080/api/agences")
      .then((response) => {
        const agences = response.data;
        setInventory(agences.length);
      })
      .catch((error) => {
        console.error("Error fetching agencies:", error);
      });
    axios
      .get("http://localhost:8080/api/collaborateurs")
      .then((response) => {
        const users = response.data;
        setCustomers(users.length);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    axios
      .get("http://localhost:8080/api/fournisseurs")
      .then((response) => {
        const fournisseur = response.data;
        setRevenue(fournisseur.length);
      })
      .catch((error) => {
        console.error("Error fetching agencies:", error);
      });

    axios
      .get("http://localhost:8080/api/maintenances")
      .then((response) => {
        const rep = response.data;
        setMaintenance(rep.length);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    axios
      .get("http://localhost:8080/api/actifs")
      .then((response) => {
        setData((prevData) => ({ ...prevData, actifs: response.data.length }));
      })
      .catch((error) => {
        console.error("Error fetching actifs:", error);
      });

    axios
      .get("http://localhost:8080/api/consommables")
      .then((response) => {
        setData((prevData) => ({
          ...prevData,
          consommables: response.data.length,
        }));
      })
      .catch((error) => {
        console.error("Error fetching consommables:", error);
      });
  }, []);

  const dataChart = {
    labels: ["Actifs", "Consommables"],
    datasets: [
      {
        label: "Nombre",
        data: [data.actifs, data.consommables],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      <Space size={20} direction="vertical">
        <h1 className="text-2xl font-normal">Dashboard</h1>
        <Space direction="horizontal">
          <DashboardCard
            icon={
              <AppstoreAddOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Consommables"}
            value={conso}
          />
          <DashboardCard
            icon={
              <ShoppingCartOutlined
                style={{
                  color: "green",
                  backgroundColor: "rgba(0,255,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Matériels Actifs"}
            value={actif}
          />
          <DashboardCard
            icon={
              <ShakeOutlined
                style={{
                  color: "orange",
                  backgroundColor: "rgba(255,165,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Elements"}
            value={element}
          />
          <DashboardCard
            icon={
              <ShoppingOutlined
                style={{
                  color: "blue",
                  backgroundColor: "rgba(0,0,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Agence"}
            value={inventory}
          />
          <DashboardCard
            icon={
              <UserOutlined
                style={{
                  color: "purple",
                  backgroundColor: "rgba(0,255,255,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Collaborateurs"}
            value={customers}
          />
          <DashboardCard
            icon={
              <DollarCircleOutlined
                style={{
                  color: "red",
                  backgroundColor: "rgba(255,0,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Fournisseurs"}
            value={revenue}
          />
          <DashboardCard
            icon={
              <ExclamationCircleOutlined
                style={{
                  color: "orange",
                  backgroundColor: "rgba(255,165,0,0.25)",
                  borderRadius: 20,
                  fontSize: 24,
                  padding: 8,
                }}
              />
            }
            title={"Maitenance"}
            value={maintenance}
          />
        </Space>
        <Space></Space>
      </Space>
      <Space size={10} direction="vertical">
        <span
          className="text-2xl font-normal"
          style={{ fontSize: "larger", color: "darkgrey" }}
        >
          Quantités de matériaux utilisés dans la fondation
        </span>{" "}
        <Space>
          <Card style={{ width: 700, height: 350 }}>
            <Bar data={dataChart} options={options} />
          </Card>
        </Space>
      </Space>
    </Layout>
  );
}
interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function DashboardCard({ title, value, icon }: DashboardCardProps) {
  return (
    <Card className=" border-gray-300">
      <Space direction="horizontal">
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

export default Dashboard;
