import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useVerifyEmail from '../../api/utilisateur/useVerifyEmail';
import { Button, Result, Skeleton, Spin } from 'antd';

const VERIFICATION_EMAIL_SUCCESS = 'Votre e-mail est vérifié avec succès.';
const VERIFCATION_EMAIL_FAILED =
  "La vérification de l'adresse e-mail a échoué. Veuillez vérifier votre e-mail ou contacter le support.";

const VerficationEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token')?.toString();
  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    if (token) verifyEmail.mutate({ token });
  }, [token]);

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {verifyEmail.isLoading ? (
        <Skeleton active={verifyEmail.isLoading} className="w-1/2" />
      ) : (
        <Result
          status={verifyEmail.isSuccess ? 'success' : 'error'}
          title={
            verifyEmail.isSuccess
              ? VERIFICATION_EMAIL_SUCCESS
              : VERIFCATION_EMAIL_FAILED
          }
          extra={[
            <Button type="default" onClick={handleGoBack} key={'page_accueil'}>
              Retour Page d'accueil
            </Button>,
          ]}
        />
      )}
    </div>
  );
};

export default VerficationEmail;
