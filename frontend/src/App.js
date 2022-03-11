import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import Dashboard from './containers/Dashboard';
import Professors from './containers/Professors';
import Courses from './containers/Courses'
import Curriculum from './containers/Curriculum'
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/professors" element={<Professors />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/curriculum" element={<Curriculum />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
