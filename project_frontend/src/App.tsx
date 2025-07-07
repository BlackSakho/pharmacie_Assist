import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";

// Lazy loaded components for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const PharmacyMap = lazy(() => import("./pages/PharmacyMap"));
const MedicationSearch = lazy(() => import("./pages/MedicationSearch"));
const AiHealthChat = lazy(() => import("./pages/AiHealthChat"));
const PharmacyManagement = lazy(
  () => import("./pages/dashboard/PharmacyManagement")
);
const MedicationManagement = lazy(
  () => import("./pages/dashboard/MedicationManagement")
);
const UserManagement = lazy(() => import("./pages/dashboard/UserManagement"));
const DutySchedule = lazy(() => import("./pages/dashboard/DutySchedule"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AddMedication = lazy(() => import("./pages/dashboard/AddMedication"));

function App() {
  const { user } = useAuth();

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner className="h-screen" />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<PharmacyMap />} />
          <Route path="/medications" element={<MedicationSearch />} />
          <Route path="/ai-health" element={<AiHealthChat />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pharmacies"
            element={
              <ProtectedRoute roles={["admin", "pharmacien"]}>
                <PharmacyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/medications"
            element={
              <ProtectedRoute roles={["admin", "pharmacien"]}>
                <MedicationManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/duty-schedule"
            element={
              <ProtectedRoute roles={["admin", "pharmacien"]}>
                <DutySchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/medications/add"
            element={
              <ProtectedRoute roles={["admin", "pharmacien"]}>
                <AddMedication />
              </ProtectedRoute>
            }
          />

          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
