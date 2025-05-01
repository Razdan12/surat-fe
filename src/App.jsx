import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserManagement from "./pages/UserManagement";
import SuratMasuk from "./pages/SuratMasuk";
import SuratKeluar from "./pages/SuratKeluar";
import CetakSurat from "./pages/CetakSurat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/daftar-user" element={<UserManagement />} />
        <Route path="/surat-masuk" element={<SuratMasuk />} />
        <Route path="/surat-keluar" element={<SuratKeluar />} />
        <Route path="/cetak/:id" element={<CetakSurat />} />
      </Routes>
    </Router>
  );
}

export default App;
