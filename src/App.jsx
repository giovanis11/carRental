import { Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import CarListingsPage from "./pages/CarListingsPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarListingsPage />} />
          <Route path="/cars/:carId" element={<CarDetailsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
