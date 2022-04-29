import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './containers/Dashboard/Dashboard';
import Courses from './containers/Courses/Courses'
import CourseInsights from "./containers/CourseInsights/CourseInsights";
import Curriculum from './containers/Curriculum'
import Navbar from "./components/Navbar/Navbar";
import Home from "./containers/Home";
import Login from "./containers/Login/Login";
import SignUp from "./containers/Sign Up/SignUp";
import Instructors from "./containers/Instructors/Instructors";
import InstructorInsights from "./containers/InstructorInsights/InstructorInsights";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/instructors/details" element={<InstructorInsights />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/details" element={<CourseInsights />} />
        <Route path="/curriculum" element={<Curriculum />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
