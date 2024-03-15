import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {UserProvider} from './contexts/UserContext';

import Example from './components/Example';
import Feed from './views/Feed';
import Friends from './views/Friends';
import Layout from './views/Layout';
import Login from './views/Login';
import Logout from './views/Logout';
import Profile from './views/Profile';
import Single from './views/Single';

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/example" element={<Example />} />
            <Route path="/single" element={<Single />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
