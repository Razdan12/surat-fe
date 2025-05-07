import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedLayout from "./ProtectedLAyout";

import SuratMasukPage from "../pages/SuratMasuk";
import SuratKeluarPage from "../pages/SuratKeluar";
import CetakSuratPage from "../pages/CetakSurat";
import DisposisiSuratMasukPage from "../pages/DisposisiSuratMasukPage";
import LaporanSuratPage from "../pages/LaporanSuratPage";
import Users from "../pages/Users";
import Layout from "../components/Layout";

const Route = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: (
      <ProtectedLayout>
        <Layout />
      </ProtectedLayout>
    ),
    children: [
      
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/surat-masuk",
        element: <SuratMasukPage />,
      },
      {
        path: "/surat-keluar",
        element: <SuratKeluarPage />,
      },
      {
        path: "/cetak/:id",
        element: <CetakSuratPage />,
      },
      {
        path: "/disposisi-surat-masuk",
        element: <DisposisiSuratMasukPage />,
      },
      {
        path: "/laporan-surat",
        element: <LaporanSuratPage />,
      },
    ],
  },

  // {
  //   path: "/",
  //   element: (
  //     <ProtectedLayout>
  //       <Navbar />
  //     </ProtectedLayout>
  //   ),
  // },
]);

export default Route;
