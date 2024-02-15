import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './views/Home';
import Profile from './views/Profile';
import Layout from './views/Layout';
import Example from './components/Example';

// Add css if needed

const App = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/example" element={<Example />} />
        </Route>
      </Routes>
    </Router> // Add closing tag for Router element
  );
};

export default App;
