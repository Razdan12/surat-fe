import React, { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  FilePlus,
  X,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SuratMasukPage = () => {
  const navigate = useNavigate();

  const [suratMasuk, setSuratMasuk] = useState([
    {
      id: 1,
      noAgenda: "G-01",
      tglDiterima: "2023-01-20",
      instansi: "UKM Sejahtera",
      perihal: "Undangan Pelantikan Pengurus Besar",
      file: null,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesToShow, setEntriesToShow] = useState(10);
  const [formData, setFormData] = useState({
    noSurat: "",
    tglSurat: "",
    tglDiterima: "",
    instansi: "",
    noAgenda: "",
    klasifikasi: "",
    perihal: "",
    lampiran: "",
    status: "",
    sifat: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  const handleSubmit = () => {
    const requiredFields = ["noSurat", "tglSurat", "tglDiterima", "instansi"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert("Harap lengkapi semua field wajib!");
        return;
      }
    }

    const newSurat = {
      id: suratMasuk.length + 1,
      ...formData,
      fileUrl: formData.file ? URL.createObjectURL(formData.file) : null,
    };

    setSuratMasuk([...suratMasuk, newSurat]);
    setFormData({
      noSurat: "",
      tglSurat: "",
      tglDiterima: "",
      instansi: "",
      noAgenda: "",
      klasifikasi: "",
      perihal: "",
      lampiran: "",
      status: "",
      sifat: "",
      file: null,
    });
    setShowForm(false);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  const handleEdit = (id) => {
    const suratToEdit = suratMasuk.find((item) => item.id === id);
    setFormData(suratToEdit);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updatedSurat = suratMasuk.filter((item) => item.id !== id);
    setSuratMasuk(updatedSurat);
  };

  const filteredSurat = suratMasuk.filter((item) =>
    [item.instansi, item.perihal, item.noAgenda]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const displayedSurat = filteredSurat.slice(0, entriesToShow);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50">
      {/* Tombol Navigasi dan Tambah */}
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center px-4 py-2 text-white transition duration-200 bg-gray-500 rounded hover:bg-gray-600"
        >
          <ArrowLeft className="mr-2" size={18} />
          Kembali ke Beranda
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-white transition duration-200 bg-green-600 rounded hover:bg-green-700"
        >
          <Plus className="mr-2" size={18} />
          Tambah
        </button>
      </div>

      {/* Kontrol Filter dan Jumlah Tampil */}
      <div className="flex flex-col justify-between gap-4 mb-4 sm:flex-row sm:items-center">
        <div>
          <label className="mr-2 text-sm font-medium">Show</label>
          <select
            value={entriesToShow}
            onChange={(e) => setEntriesToShow(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="ml-2 text-sm">entries</span>
        </div>
        <input
          type="text"
          placeholder="Cari surat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded sm:w-1/3"
        />
      </div>

      {/* Tabel Surat Masuk */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-left table-auto">
          <thead className="text-white bg-blue-600">
            <tr>
              <th className="p-3">No.</th>
              <th className="p-3">Agenda</th>
              <th className="p-3">Tgl. Diterima</th>
              <th className="p-3">Instansi</th>
              <th className="p-3">Perihal</th>
              <th className="p-3">Dokumen</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {displayedSurat.map((item, index) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{item.noAgenda}</td>
                <td className="p-3">{item.tglDiterima}</td>
                <td className="p-3">{item.instansi}</td>
                <td className="p-3">{item.perihal}</td>
                <td className="p-3">
                  {item.fileUrl ? (
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Lihat File
                    </a>
                  ) : (
                    "Belum diupload"
                  )}
                </td>
                <td className="flex items-center justify-center p-3 space-x-2">
                  <button
                    className="text-blue-500 transition duration-200 hover:text-blue-700"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-500 transition duration-200 hover:text-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notifikasi Simpan */}
      {showNotif && (
        <div className="fixed px-4 py-2 text-sm text-white bg-green-600 rounded shadow-md bottom-4 right-4 animate-bounce">
          Surat berhasil disimpan!
        </div>
      )}

      {/* Form Tambah Surat */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full h-full max-w-2xl p-6 overflow-y-auto bg-white rounded-lg shadow-lg sm:h-auto sm:max-w-2xl">
            <div className="flex items-center justify-between pb-2 mb-4 border-b">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <FilePlus size={20} />
                Tambah Surat Masuk
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-gray-700 uppercase">
                  Informasi Umum
                </h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    { label: "No. Surat", name: "noSurat", type: "text" },
                    { label: "Tgl. Surat", name: "tglSurat", type: "date" },
                    { label: "Diterima Tgl.", name: "tglDiterima", type: "date" },
                    { label: "Instansi", name: "instansi", type: "text" },
                    { label: "No. Agenda", name: "noAgenda", type: "text" },
                    { label: "Klasifikasi", name: "klasifikasi", type: "text" },
                  ].map(({ label, name, type }) => (
                    <div key={name}>
                      <label className="text-sm font-semibold">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        className="w-full p-2 mt-1 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Perihal</label>
                <textarea
                  name="perihal"
                  value={formData.perihal}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="text-sm font-semibold">Lampiran</label>
                  <input
                    type="text"
                    name="lampiran"
                    value={formData.lampiran}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border rounded"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border rounded"
                  >
                    <option value="">--Status--</option>
                    <option value="Sudah dibaca">Sudah dibaca</option>
                    <option value="Belum dibaca">Belum dibaca</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold">Sifat</label>
                  <select
                    name="sifat"
                    value={formData.sifat}
                    onChange={handleChange}
                    className="w-full p-2 mt-1 border rounded"
                  >
                    <option value="">--Sifat--</option>
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Segera">Segera</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold">Unggah File</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="w-full p-2 mt-1 border rounded"
                />
              </div>

              <div className="flex justify-end mt-6 space-x-4">
                <button
                  className="px-4 py-2 text-white transition duration-200 bg-gray-500 rounded hover:bg-gray-600"
                  onClick={() => setShowForm(false)}
                >
                  Tutup
                </button>
                <button
                  className="px-4 py-2 text-white transition duration-200 bg-blue-600 rounded hover:bg-blue-700"
                  onClick={handleSubmit}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuratMasukPage;
