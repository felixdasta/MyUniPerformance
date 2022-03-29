import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './containers/Dashboard';
import Professors from './containers/Professors';
import Courses from './containers/Courses'
import Curriculum from './containers/Curriculum'
import Navbar from "./components/navbar/Navbar";
import Home from "./containers/Home";
import Login from "./containers/Login/Login";
import SignUp from "./containers/Sign Up/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/professors" element={<Professors />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/create-account" element={<SignUp/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
