import {Outlet} from 'react-router-dom';
import Navigation from '../components/SideNavBar';
import Example from '../components/Example';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <>
      <div className="dark:bg p-4 sm:ml-64 dark:bg-gray-900 dark:text-white">
        <nav>
          <Navigation />
        </nav>
        <main>
          <Outlet />
          <Example age={21} />
          <p style={{ marginBottom: '1500px', overflow: "none" }}>Home Component</p>
        </main>
        <hr />
        <footer className="inset-x-0 bottom-0">
          <Footer />
        </footer>
      </div>
    </>
  );
};

export default Layout;
