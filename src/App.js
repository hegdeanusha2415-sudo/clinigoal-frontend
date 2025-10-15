// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

// ---------------- Chart.js ----------------
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// ---------------- Components ----------------
import Home from "./components/Home/Home";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import UserLogin from "./components/UserLogin/UserLogin";
import UserRegister from "./components/UserRegister/UserRegister";
import UserForgot from "./components/UserForgot/UserForgot";
import ResetPassword from "./components/UserForgot/ResetPassword";

// ---------------- Course Pages ----------------
import ClinicalResearchPage from "./pages/CoursesPage/ClinicalResearchPage";
import BioinformaticsPage from "./pages/CoursesPage/BioinformaticsPage";
import MedicalCodingPage from "./pages/CoursesPage/MedicalCoding";
import PharmacovigilancePage from "./pages/CoursesPage/PharmacovigilancePage";

// ---------------- Dashboards ----------------
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import UserDashboard from "./components/UserDashboard/UserDashboard";

// ✅ REGISTER ChartJS *AFTER ALL IMPORTS*
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// ---------------- Protected Routes ----------------
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login/user" replace />;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  return token && userRole === "admin" ? (
    children
  ) : (
    <Navigate to="/admin-login" replace />
  );
};

// ---------------- Wrappers ----------------
function UserDashboardWrapper() {
  const { userId } = useParams();
  if (!userId) return <div>User ID not specified.</div>;
  return <UserDashboard userId={userId} />;
}

function UserCourseWrapper() {
  const { userId, courseId } = useParams();
  if (!userId || !courseId)
    return <div>User ID or Course ID not specified.</div>;
  return <UserDashboard userId={userId} courseId={courseId} />;
}

// ---------------- App Component ----------------
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Authentication */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/forgot-password" element={<UserForgot />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Admin Dashboard */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />

          {/* User Dashboards */}
          <Route path="/dashboard/*" element={<UserDashboard />} />
          <Route path="/user/*" element={<UserDashboard />} />
          <Route path="/student/*" element={<UserDashboard />} />

          <Route
            path="/user-dashboard/:userId"
            element={
              <ProtectedRoute>
                <UserDashboardWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/:userId/courses/:courseId"
            element={
              <ProtectedRoute>
                <UserCourseWrapper />
              </ProtectedRoute>
            }
          />

          {/* Course Pages */}
          <Route path="/clinical-research" element={<ClinicalResearchPage />} />
          <Route path="/bioinformatics" element={<BioinformaticsPage />} />
          <Route path="/medical-coding" element={<MedicalCodingPage />} />
          <Route
            path="/pharmacovigilance"
            element={<PharmacovigilancePage />}
          />

          {/* Fallback */}
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
