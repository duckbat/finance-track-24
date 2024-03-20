import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {UserProvider} from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Example from './views/Example';
import Feed from './views/pages/Feed';
import Register from './views/pages/Register';
import Layout from './views/Layout';
import Login from './views/pages/Login';
import Logout from './views/Logout';
import Profile from './views/pages/Profile';
import Single from './views/pages/Single';
import Upload from './views/pages/Upload';
import About from './views/pages/About';
import LogoutView from './views/LogoutView';
import {UpdateProvider} from './contexts/UpdateContext';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <UserProvider>
        <UpdateProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Feed />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/example" element={<Example />} />
              <Route path="/single" element={<Single />} />
              <Route path="/about" element={<About />} />
              <Route path="/logoutview" element={<LogoutView />} />
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </UpdateProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
