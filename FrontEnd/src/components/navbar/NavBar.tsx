import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="bg-indigo-200">
      <ul className="flex gap-4 p-3">
        <li>
          <Link to="/">
            <img
              className="h-auto w-6"
              src="https://www.norsys.fr/sites/all/themes/custom/norsys/logo.png"
              alt="Logo"
            />
          </Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/home">Home</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
