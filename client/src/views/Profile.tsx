import { useUserContext } from '../hooks/ContextHooks';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useUserContext();
  const navigate = useNavigate(); // Access the navigate function

  // Redirect to the login page if user is not logged in
  if (!user) {
    navigate('/login');
    return null; // Prevent rendering the rest of the component
  }

  return (
    <>
      <div className="mb-8 rounded-lg border-2 border-dashed border-gray-200 p-4 dark:border-gray-600">
        <img
          src="https://getducked.com.au/cdn/shop/products/2124_hr_1024x1024.png?v=1612084811"
          className="h-20"
          alt="DuckBat Logo"
        />
        <h1 className="text-align:right font-sans text-4xl pb-2">Welcome: {user.username}</h1>
        <p>Your Email: {user.email}</p>
        <p>Account was created at: {new Date(user.created_at).toLocaleString('fi-FI')}</p>
      </div>
      <h1 style={{ marginBottom: '1080px', overflow: 'none', font: 'xxl' }}></h1>
    </>
  );
};

export default Profile;
