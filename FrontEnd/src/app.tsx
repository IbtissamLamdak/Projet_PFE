import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashbaord/Dashboard';
import Fournisseur from './pages/fournisseur/Fournisseurs';
import Agences from './pages/agence/Agences';
import Utilisateurs from './pages/utilisateur/Utilisateurs';
import Materiels from './pages/materiels/Materiels';
import Reparations from './pages/reparation/Reparations';
import Stock from './pages/stock/stock';
import Affectation from './pages/affectation/Affectations';
import Layout from './layout/Layout';
import Login from './pages/login/Login';
import Unauthorized from './pages/unauthorized/Unauthorized';
import RequireAuth from './utils/RequireAuth';
import useAuth from './hooks/auth/useAuth';
import Elements from './pages/element/Elements';
import Consommables from './pages/consommable/Consommables';
import Consommable from './pages/consommable/Consommable';
import Utilitaires from './pages/utilitaire/Utilitaires';
import Plateaux from './pages/plateaux/plateaux';
import Collaborateurs from './pages/collaborateur/Collaborateurs';
import Reclamations from "./pages/reclamations/Reclamations";
import Besoins from './pages/besoin/Besoins';

const App = () => {
  const { auth } = useAuth();

  const isLoggedIn = auth?.accessToken;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={["ADMIN", "MANAGER"]} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fournisseurs" element={<Fournisseur />} />
            <Route path="/agences" element={<Agences />} />
            <Route path="/utilisateurs" element={<Utilisateurs />} />
            <Route path="/collaborateurs" element={<Collaborateurs />} />
            <Route path="/materiels" element={<Materiels />} />
            <Route path="/reparations" element={<Reparations />} />
            <Route path="/besoins" element={<Besoins />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/affectations" element={<Affectation />} />
            <Route path="/maintenances" element={<Reclamations />} />
            <Route path="/elements" element={<Elements />} />
            <Route path="/consommables" element={<Consommables />} />
            <Route path="/plateaux" element={<Plateaux />} />
            <Route path="/consommables/:id" element={<Consommable />} />
            <Route path="/categories" element={<Utilitaires />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
