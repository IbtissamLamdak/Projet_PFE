import { useContext } from 'react';
import AuthContext from '../../context/auth/authProvider';

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
