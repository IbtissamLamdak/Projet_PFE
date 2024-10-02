import axios from '../../api/axios/axios';
import useAuth from './useAuth';

type RefreshTokenResponseType = {
  accessToken: string;
  role: string;
  tokenType: string;
};

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get<RefreshTokenResponseType>(
      '/auth/refresh-token',
      {
        withCredentials: true,
      }
    );
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return {
        ...prev,
        role: response.data.role,
        accessToken: response.data.accessToken,
      };
    });

    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
