import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle, X } from "lucide-react";

const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    {
      id: 1,
      nama: "TRI WAHYU DINI SUSANTI,S.STP.",
      nip: "19820322 200012 2 002",
      jabatan: "Camat",
      level: "User",
      loginTerakhir: "2025-04-09 08:30:00",
    },
    {
      id: 2,
      nama: "Rahmawati",
      nip: "202301012024010102",
      jabatan: "Kasubbag Kepegawaian",
      level: "Admin",
      loginTerakhir: "2025-04-08 12:15:00",
    },
  ]);

  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    jabatan: "",
    level: "",
    gender: "",
    tempatLahir: "",
    tanggalLahir: "",
    pendidikan: "",
    email: "",
    telepon: "",
    status: "",
    alamat: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showCount, setShowCount] = useState(5);

  const filteredUsers = users
    .filter(
      (user) =>
        user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nip.includes(searchTerm)
    )
    .slice(0, showCount);

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ ...user });
    setFormVisible(true);
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus user ini?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        loginTerakhir: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      setUsers([...users, newUser]);
    }
    setFormVisible(false);
    setEditingUser(null);
    setFormData({
      nama: "",
      nip: "",
      jabatan: "",
      level: "",
      gender: "",
      tempatLahir: "",
      tanggalLahir: "",
      pendidikan: "",
      email: "",
      telepon: "",
      status: "",
      alamat: "",
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Pengguna</h2>
          <p className="text-sm text-gray-500">Manajemen data pengguna sistem</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-2 text-sm text-white bg-gray-600 rounded hover:bg-gray-700"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={() => {
              setFormVisible(true);
              setEditingUser(null);
              setFormData({
                nama: "",
                nip: "",
                jabatan: "",
                level: "",
                gender: "",
                tempatLahir: "",
                tanggalLahir: "",
                pendidikan: "",
                email: "",
                telepon: "",
                status: "",
                alamat: "",
              });
            }}
            className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700"
          >
            <PlusCircle size={16} /> Tambah User
          </button>
        </div>
      </div>

      {/* Search and Show */}
      <div className="flex flex-col items-start justify-between gap-4 mb-4 md:flex-row md:items-center">
        <div>
          <label className="text-sm">Show entries:</label>
          <select
            value={showCount}
            onChange={(e) => setShowCount(Number(e.target.value))}
            className="p-1 ml-2 border rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="Cari nama atau NIP"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded md:w-1/3"
        />
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-white bg-blue-600">
            <tr>
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">NIP</th>
              <th className="px-4 py-2">Nama Lengkap</th>
              <th className="px-4 py-2">Jabatan</th>
              <th className="px-4 py-2">Level</th>
              <th className="px-4 py-2">Login Terakhir</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{user.nip}</td>
                <td className="px-4 py-2">{user.nama}</td>
                <td className="px-4 py-2">{user.jabatan}</td>
                <td className="px-4 py-2">{user.level}</td>
                <td className="px-4 py-2">{user.loginTerakhir}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    onClick={() => handleEdit(user)}
                    className="inline-flex items-center p-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="inline-flex items-center p-1 text-white bg-red-600 rounded hover:bg-red-700"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-400">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Form Tambah User */}
      {formVisible && (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded shadow-lg">
            <button
              className="absolute top-3 right-3"
              onClick={() => {
                setFormVisible(false);
                setEditingUser(null);
              }}
            >
              <X size={18} />
            </button>

            <h3 className="mb-4 text-lg font-semibold">Form Tambah User</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input className="p-2 border rounded" placeholder="Nama Lengkap" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} />
              <input className="p-2 border rounded" placeholder="NIP" value={formData.nip} onChange={(e) => setFormData({ ...formData, nip: e.target.value })} />
              <select className="p-2 border rounded" value={formData.jabatan} onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}>
                <option value="">-- Pilih Jabatan --</option>
                <option value="Camat">Camat</option>
                <option value="Sekertaris Camat">Sekertaris Camat</option>
                <option value="Kasi">Kasi Pemtrantibum</option>
                <option value="Kasi">Kasi PMD</option>
                <option value="Kasi">Kasi Kesra</option>
                <option value="Kasi">Kasubbag Keuangan</option>
                <option value="Kasi">Kasubbag Kepegawaian</option>
              </select>
              <div className="flex items-center gap-4">
                <label>
                  <input type="radio" name="gender" value="L" checked={formData.gender === "L"} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="mr-1" /> Laki-laki
                </label>
                <label>
                  <input type="radio" name="gender" value="P" checked={formData.gender === "P"} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="mr-1" /> Perempuan
                </label>
              </div>
              <input className="p-2 border rounded" placeholder="Tempat Lahir" value={formData.tempatLahir} onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })} />
              <input type="date" className="p-2 border rounded" value={formData.tanggalLahir} onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })} />
              <select className="p-2 border rounded" value={formData.pendidikan} onChange={(e) => setFormData({ ...formData, pendidikan: e.target.value })}>
                <option value="">-- Pilih Pendidikan --</option>
                <option value="SMA">SMA</option>
                <option value="D3">D3</option>
                <option value="S1">S1</option>
                <option value="S2">S2</option>
              </select>
              <input className="p-2 border rounded" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <input className="p-2 border rounded" placeholder="Telepon" value={formData.telepon} onChange={(e) => setFormData({ ...formData, telepon: e.target.value })} />
              <select className="p-2 border rounded" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option value="">-- Pilih Status --</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
              <input className="col-span-2 p-2 border rounded" placeholder="Alamat" value={formData.alamat} onChange={(e) => setFormData({ ...formData, alamat: e.target.value })} />
              <select className="p-2 border rounded" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                <option value="">-- Pilih Level User --</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 text-white bg-gray-400 rounded hover:bg-gray-500" onClick={() => {
                setFormVisible(false);
                setEditingUser(null);
              }}>
                Tutup
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700" onClick={handleSave}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
