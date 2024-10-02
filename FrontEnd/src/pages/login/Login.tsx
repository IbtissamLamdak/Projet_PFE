import React, { useState } from 'react';
import useAuth from '../../hooks/auth/useAuth';
import axios from '../../api/axios/axios';
import AXIOS from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './login.css';
import { Alert } from 'antd';

const LOGIN_URL = '/auth/login';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  role: string;
};

const Login: React.FC = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const handleLogin = async () => {
    setErrorMessage('');

    try {
      const response = await axios.post<LoginResponse>(
        LOGIN_URL,
        JSON.stringify({ username, password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      const accessToken = response?.data.accessToken;
      const role = response?.data.role;
      console.log(response);

      localStorage.setItem('access_token', accessToken);

      setAuth({ username, role, accessToken });
      setUsername('');
      setPassword('');

      navigate(from, { replace: true });
    } catch (err) {
      if (AXIOS.isAxiosError(err)) {
        console.log(err);
        if (err.response?.status === 400) {
          setErrorMessage('Missing Username or Password');
        } else if (err.response?.status === 401) {
          setErrorMessage('Unauthorized');
        } else if (err.response?.status === 500) {
          setErrorMessage('Bad credentials');
        } else {
          setErrorMessage('Login Failed');
        }
      } else {
        setErrorMessage('Login Failed');
      }
      localStorage.removeItem('access_token');
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="h-full mt-32">
      <div className="flex min-h-full flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-32" src="./norsys-logo.jpg" alt="Logo" />
          <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="font-medium tracking-wide text-red-500 text-xs mb-2">
              {errorMessage && <Alert message={errorMessage} type="error" />}
            </div>
            <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold leading-6"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="w-full">
                <button
                  type="submit"
                  className="block w-full rounded-md border-0 bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
