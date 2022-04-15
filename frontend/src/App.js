import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './containers/Dashboard/Dashboard';
import Courses from './containers/Courses/Courses'
import CourseDetails from "./containers/CourseDetails/CourseDetails";
import Curriculum from './containers/Curriculum'
import Navbar from "./components/navbar/Navbar";
import Home from "./containers/Home";
import Login from "./containers/Login/Login";
import SignUp from "./containers/Sign Up/SignUp";
import Instructors from "./containers/Instructors";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/details" element={<CourseDetails />}/>
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
