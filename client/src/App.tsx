import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {UserProvider} from './contexts/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import Example from './views/Example';
import Feed from './views/Feed';
import Register from './views/Register';
import Layout from './views/Layout';
import Login from './views/Login';
import Logout from './views/Logout';
import Profile from './views/Profile';
import Single from './views/Single';
// import Upload from './views/Upload';
import About from './views/About';
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
              {/* <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <Upload />
                  </ProtectedRoute>
                }
              /> */}
            </Route>
          </Routes>
        </UpdateProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
