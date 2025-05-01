import { useState } from "react";
import {
  Home,
  Settings,
  Mail,
  FileText,
  Clipboard,
  LogOut,
  UserCircle,
  Users,
  Inbox,
  Send,
  Folder,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const [fotoProfil, setFotoProfil] = useState(null);

  const handleToggle = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleGantiGambar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoProfil(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 min-h-screen p-6 text-white bg-blue-600">
        {/* ADMINISTRASI */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">ADMINISTRASI</h1>
        </div>

        {/* Informasi Pengguna */}
        <div className="flex items-center pb-4 mt-4 mb-4 space-x-3 border-b border-blue-400">
          <div className="relative">
            <label htmlFor="upload-foto">
              <img
                src={fotoProfil || "default-avatar.png"}
                alt="Foto Profil"
                className="rounded-full cursor-pointer w-9 h-9"
              />
            </label>
            <input
              type="file"
              id="upload-foto"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleGantiGambar}
            />
          </div>
          <div>
            <p className="text-sm font-semibold">STE202102292</p>
            <p className="text-xs text-gray-200">Admin</p>
          </div>
        </div>

        {/* Navigasi */}
        <ul className="space-y-4">
          <li>
            <Link to="/" className="flex items-center px-4 py-2 space-x-2 rounded hover:bg-blue-700">
              <Home size={20} /> <span>Beranda</span>
            </Link>
          </li>

          <li>
            <div className="text-sm font-semibold text-gray-200 uppercase">MENU UTAMA</div>
          </li>

          {/* Pengaturan */}
          <li>
            <button
              onClick={() => handleToggle("pengaturan")}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
                <Settings size={20} />
                <span>Pengaturan</span>
              </div>
              {openMenu === "pengaturan" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "pengaturan" && (
              <ul className="pl-8 mt-2 space-y-2 text-sm">
                <li>
                  <Link
                    to="/daftar-user"
                    className="flex items-center px-4 py-2 space-x-2 rounded hover:bg-blue-700"
                  >
                    <Users size={16} />
                    <span>User</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Persuratan */}
          <li>
            <button
              onClick={() => handleToggle("persuratan")}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
                <Mail size={20} />
                <span>Persuratan</span>
              </div>
              {openMenu === "persuratan" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "persuratan" && (
              <ul className="pl-8 mt-2 space-y-2 text-sm">
                <li>
                  <Link
                    to="/surat-masuk"
                    className="flex items-center px-4 py-2 space-x-2 rounded hover:bg-blue-700"
                  >
                    <Inbox size={16} />
                    <span>Surat Masuk</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/surat-keluar"
                    className="flex items-center px-4 py-2 space-x-2 rounded hover:bg-blue-700"
                  >
                    <Send size={16} />
                    <span>Surat Keluar</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Disposisi */}
          <li>
            <button
              onClick={() => handleToggle("disposisi")}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
                <Clipboard size={20} />
                <span>Disposisi</span>
              </div>
              {openMenu === "disposisi" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "disposisi" && (
              <ul className="pl-8 mt-2 space-y-2 text-sm">
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:underline">
                    <Folder size={16} /> <span>Data</span>
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Laporan */}
          <li>
            <button
              onClick={() => handleToggle("laporan")}
              className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2">
                <FileText size={20} />
                <span>Laporan</span>
              </div>
              {openMenu === "laporan" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            {openMenu === "laporan" && (
              <ul className="pl-8 mt-2 space-y-2 text-sm">
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:underline">
                    <Folder size={16} /> <span>Data</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout */}
        <div className="mt-6">
          <a
            href="#"
            className="flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
          >
            <LogOut size={20} /> <span className="ml-2">Logout</span>
          </a>
        </div>
      </div>

      {/* Header & Konten */}
      <div className="flex-1 bg-white">
        <div className="flex items-center justify-between px-6 py-4 text-white bg-blue-600 shadow">
          <h1 className="text-lg font-bold">
            SISTEM INFORMASI MANAJEMEN ARSIP SURAT KECAMATAN BOJONGSARI
          </h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <label htmlFor="upload-foto-header">
                <img
                  src={fotoProfil || "default-avatar.png"}
                  alt="Foto Profil"
                  className="rounded-full cursor-pointer w-9 h-9"
                />
              </label>
              <input
                type="file"
                id="upload-foto-header"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleGantiGambar}
              />
            </div>
            <p className="text-sm font-semibold">Profil</p>
          </div>
        </div>

        {/* Konten Dashboard */}
        <div className="p-6">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <p className="text-sm text-gray-600">
            Selamat datang di Sistem Informasi Manajemen Arsip Surat Kecamatan Bojongsari
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          {[{
            title: "Surat Masuk", count: 120, icon: <Inbox size={24} className="text-white" />, bgColor: "bg-red-500"
          }, {
            title: "Surat Keluar", count: 80, icon: <Send size={24} className="text-white" />, bgColor: "bg-yellow-500"
          }, {
            title: "Jumlah User", count: 10, icon: <Users size={24} className="text-white" />, bgColor: "bg-green-500"
          }].map((stat, index) => (
            <div key={index} className={`flex items-center p-4 shadow-md rounded-2xl ${stat.bgColor}`}>
              <div className="p-3 rounded-full">{stat.icon}</div>
              <div className="ml-4 text-white">
                <p className="text-sm font-medium">{stat.title}</p>
                <h2 className="text-2xl font-bold">{stat.count}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
