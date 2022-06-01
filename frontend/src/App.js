import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './containers/Dashboard/Dashboard';
import Courses from './containers/Courses/Courses'
import CourseInsights from "./containers/CourseInsights/CourseInsights";
import Curriculum from './containers/Curriculum/Curriculum';
import Navbar from "./components/Navbar/Navbar";
import Home from "./containers/Home/Home";
import Login from "./containers/Login/Login";
import SignUp from "./containers/SignUp/SignUp";
import ChangePassword from "./containers/ChangePassword/ChangePassword";
import Instructors from "./containers/Instructors/Instructors";
import InstructorInsights from "./containers/InstructorInsights/InstructorInsights";
import UserInformation from "./containers/UserInformation/UserInformation";

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
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/profile" element={<UserInformation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
