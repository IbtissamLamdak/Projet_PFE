import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
    <div className="flex items-center justify-center h-screen">
      <Result
        status="404"
        title="404"
        subTitle="Désolé, la page que vous avez visitée n'existe pas."
        extra={
          <Button type="default" onClick={goBack}>
            Retour Page d'accueil
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
