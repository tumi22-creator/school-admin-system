import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import Marks from "./pages/Marks";
import ParentDashboard from "./pages/ParentDashboard";
import Parents from "./pages/Parents";
import Fees from "./pages/Fees";
import ParentMarks from "./pages/ParentMarks";
import ParentFees from "./pages/ParentFees";


function App() {
  const token = localStorage.getItem("token");
  const path = window.location.pathname;
  const role = localStorage.getItem("role");

  
  if (!token) {
    return <Login />;
  }

  

if (role === "PARENT" && path === "/dashboard") {
  return <ParentDashboard />;
}

if (role === "PARENT" && path === "/parents") {
  return <Parents />;
}

  if (path === "/students") {
    return <Students />;
  }

  if (path === "/teachers") {
    return <Teachers />;
  }

  if (path === "/classes") {
    return <Classes />;
  } 

  if (path === "/attendance") {
    return <Attendance />;
  }

  if (path === "/attendance-history") {
    return <AttendanceHistory />;
  }

  if (path === "/marks") {
    return <Marks />;
  }

  if (path === "/parents") {
  return <Parents />;
}

  if (path === "/fees") {
    return <Fees />;
  } 

  if (path === "/parent-marks") {
    return <ParentMarks />;
  }

  if (path === "/parent-fees") {
    return <ParentFees />;
  } 

  return <Dashboard />;
}

export default App;