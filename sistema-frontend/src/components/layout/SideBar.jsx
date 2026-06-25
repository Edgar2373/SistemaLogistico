import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <div className="w-64 bg-gray-900 text-white min-h-screen">

      <h2 className="text-center text-2xl py-5 font-bold">
        ADMIN
      </h2>

      <ul>

        <li className="p-4 hover:bg-gray-700">
          <Link to="/admin">
            Dashboard
          </Link>
        </li>

        <li className="p-4 hover:bg-gray-700">
          <Link to="/usuarios">
            Usuarios
          </Link>
        </li>

        <li className="p-4 hover:bg-gray-700">
          <Link to="/pedidos">
            Pedidos
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;