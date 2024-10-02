import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold mb-2">Uh-oh!</h1>
      <p className="text-lg mb-4">
        {isRouteErrorResponse(error)
          ? 'Nous ne pouvons pas trouver cette page.'
          : "Une erreur imprévue s'est produite."}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate('/', { replace: true })}
      >
        Retourner
      </button>
    </div>
  );
};

export default ErrorPage;
