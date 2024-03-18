import SideNavBar from '../components/SideNavBar';
import Footer from '../components/Footer';
import {Outlet} from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <div suppressHydrationWarning>
        <div className="dark:bg p-4 sm:ml-64 dark:bg-gray-900 dark:text-white ">
            <SideNavBar />
          <main>
            <Outlet></Outlet>
          </main>
          <footer className="inset-x-0 bottom-0">
            <Footer />
          </footer>
        </div>
      </div>
    </>
  );
};

export default Layout;
