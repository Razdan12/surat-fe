import { useEffect, useState } from "react";
import { RiInboxFill, RiSendPlaneFill, RiUser3Fill } from "react-icons/ri";
import { getDashboardStatsAPI } from "../middleware/Dashboard";

const colorClasses = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
};

const DashboardCard = ({ color, icon: Icon, title, value }) => (
  <div className={`flex-1 ${colorClasses[color]} text-white rounded-xl shadow-md p-6 flex items-center transform transition duration-300 hover:scale-105 hover:shadow-lg`}>
    <Icon className="mr-4 text-4xl" />
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const Beranda = () => {
  const [data, setData] = useState({
    suratMasuk: 0,
    suratKeluar: 0,
    jumlahUser: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await getDashboardStatsAPI();
        if (response.status) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="mb-2 text-xl font-bold">Dashboard</h2>
      <p className="mb-6">
        Selamat datang di Sistem Informasi Manajemen Arsip Surat Kecamatan Bojongsari
      </p>

      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardCard color="red" icon={RiInboxFill} title="Surat Masuk" value={data.suratMasuk} />
        <DashboardCard color="yellow" icon={RiSendPlaneFill} title="Surat Keluar" value={data.suratKeluar} />
        <DashboardCard color="green" icon={RiUser3Fill} title="Jumlah User" value={data.jumlahUser} />
      </div>
    </div>
  );
};

export default Beranda;
