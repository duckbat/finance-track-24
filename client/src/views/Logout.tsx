import { useEffect } from 'react';
import { useUserContext } from '../hooks/ContextHooks';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  const { handleLogout } = useUserContext();

  useEffect(() => {
    const logout = async () => {
      await handleLogout();
      // Redirect to the login page after logout
      navigate('/logoutview');
    };

    logout();
  }, [handleLogout, navigate]);

  console.log("logout called!");

  return (
    <p>Logging out...</p>
  );
};

export default Logout;
