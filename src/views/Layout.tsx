import {Link, Outlet} from "react-router-dom";

const Layout = () => {
  return (
    <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/upload">Upload</Link>
            </li>
          </ul>
        </nav>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Copyright 2024 - DB</p>
      </footer>
    </div>
  );
};


export default Layout;
