import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="403"
        title="403"
        subTitle="Désolé, vous n'êtes pas autorisé à accéder à cette page."
        extra={
          <Button type="default" onClick={goBack}>
            Retour Page d'accueil
          </Button>
        }
      />
    </div>
  );
};

export default Unauthorized;
