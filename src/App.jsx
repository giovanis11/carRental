import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import BuyCarsPage from "./pages/BuyCarsPage";
import BuyMotoPage from "./pages/BuyMotoPage";
import Footer from "./components/Footer";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import CarListingsPage from "./pages/CarListingsPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("lekscarTheme");

    if (savedTheme === "dark" || savedTheme === "light") {
      return savedTheme;
    }

    return "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.bsTheme = theme;
    localStorage.setItem("lekscarTheme", theme);
    localStorage.removeItem("driveOnTheme");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="app-shell" data-theme={theme}>
      <AppNavbar theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarListingsPage />} />
          <Route path="/buy-car" element={<BuyCarsPage />} />
          <Route path="/buy" element={<BuyCarsPage />} />
          <Route path="/buy-moto" element={<BuyMotoPage />} />
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
