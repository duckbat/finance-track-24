/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import { useUserContext } from '../hooks/ContextHooks';

const Logout = () => {
  const {handleLogout} = useUserContext();

  useEffect(() => {
    handleLogout();
  }, []);
  console.log("logout called!")

  return (
    <p>Log out!</p>
    )
}

export default Logout;
