import {Route, BrowserRouter as Router, Routes} from "react-router-dom"
import Home from "./views/Home"
import Profile from "./views/Profile"
import Upload from "./views/Upload"
import Layout from "./views/Layout"


// Add css if needed

const App = () => {

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </Router> // Add closing tag for Router element
  );
};

export default App
