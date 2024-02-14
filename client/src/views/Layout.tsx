import {Outlet} from 'react-router-dom';
import Navigation from '../components/SideNavBar';

const Layout = () => {

  return (
    <>
      <div>
        <nav className="pb-2 ">
        <Navigation />
        </nav>

        <main className=''>
          <p>Home Componen</p>
          <Outlet />
        </main>
        <hr />
        <p>Footer Componen</p>
      </div>
    </>
  );
};

export default Layout;
