import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Tambahkan ini
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Data Sampel
const sampleSuratMasuk = [
  { id: 1, jenis: "Masuk", nomor: "001", tanggal: "2025-05-01", pengirim: "Dinas Pendidikan", perihal: "Undangan Rapat" },
  { id: 2, jenis: "Masuk", nomor: "002", tanggal: "2025-05-02", pengirim: "Dinas Kesehatan", perihal: "Sosialisasi Kesehatan" },
];

const sampleSuratKeluar = [
  { id: 3, jenis: "Keluar", nomor: "101", tanggal: "2025-05-01", penerima: "Camat", perihal: "Laporan Bulanan" },
  { id: 4, jenis: "Keluar", nomor: "102", tanggal: "2025-05-02", penerima: "Dinas Kesehatan", perihal: "Permohonan Bantuan" },
];

const sampleDisposisi = [
  { suratId: 1, tujuan: "Sekretaris", isi: "Segera ditindaklanjuti", tanggal: "2025-05-01" },
  { suratId: 2, tujuan: "Kasi Pelayanan", isi: "Mohon dijawab", tanggal: "2025-05-02" },
];

const LaporanSuratPage = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSuratId, setSelectedSuratId] = useState(null);
  const navigate = useNavigate();
  const allData = [...sampleSuratMasuk, ...sampleSuratKeluar];

  const filteredData = allData.filter((item) => {
    const searchLower = search.toLowerCase();

    const matchSearch =
      item.nomor?.toLowerCase().includes(searchLower) ||
      item.perihal?.toLowerCase().includes(searchLower) ||
      item.pengirim?.toLowerCase().includes(searchLower) ||
      item.penerima?.toLowerCase().includes(searchLower);

    const itemDate = dayjs(item.tanggal);
    const validStart = startDate ? dayjs(startDate).isValid() : false;
    const validEnd = endDate ? dayjs(endDate).isValid() : false;

    const matchStart = validStart ? itemDate.isAfter(dayjs(startDate).subtract(1, "day")) : true;
    const matchEnd = validEnd ? itemDate.isBefore(dayjs(endDate).add(1, "day")) : true;

    return matchSearch && matchStart && matchEnd;
  });

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Surat Masuk & Keluar", 14, 10);

    autoTable(doc, {
      head: [["No", "Jenis", "Nomor", "Tanggal", "Pengirim/Penerima", "Perihal"]],
      body: filteredData.map((item, index) => [
        index + 1,
        item.jenis,
        item.nomor,
        item.tanggal,
        item.pengirim || item.penerima || "-",
        item.perihal,
      ]),
      startY: 20,
    });

    doc.save("laporan-surat.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>Cetak Laporan Surat</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 20px; }
            .header img { width: 50px; height: auto; margin-bottom: 10px; }
            .header h2, .header h3 { margin: 0; font-family: Arial, sans-serif; }
            .header p { margin: 5px 0; }
            .border-top { border-top: 2px solid #000; margin: 10px 0; }
            .date-location { margin-bottom: 20px; text-align: right; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 5px; text-align: center; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/Logo.png" alt="Logo" />
            <h2 style="font-family: Arial, sans-serif;">PEMERINTAH KABUPATEN PURBALINGGA</h2>
            <h3 class="bold" style="font-family: Arial, sans-serif;">KECAMATAN BOJONGSARI</h3>
            <p>Jalan Kutabaru I Nomor 1 Telp. (0281) 6597070</p>
            <p>BOJONGSARI - PURBALINGGA</p>
            <div class="border-top"></div>
          </div>
          <h3 style="text-align: center; margin-bottom: 20px;">Laporan Surat Masuk & Keluar</h3>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Jenis</th>
                <th>Nomor</th>
                <th>Tanggal</th>
                <th>Pengirim/Penerima</th>
                <th>Perihal</th>
              </tr>
            </thead>
            <tbody>
              ${
                filteredData.length > 0
                  ? filteredData
                      .map(
                        (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.jenis}</td>
                  <td>${item.nomor}</td>
                  <td>${item.tanggal}</td>
                  <td>${item.pengirim || item.penerima || "-"}</td>
                  <td>${item.perihal}</td>
                </tr>`
                      )
                      .join("")
                  : `<tr><td colspan="6" style="text-align:center;">Tidak ada data</td></tr>`
              }
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };
  
  
  
  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/")}
        className="px-4 py-2 mb-4 text-white bg-gray-600 rounded hover:bg-gray-700"
      >
        ← Kembali ke Beranda
      </button>
  
      <h2 className="mb-4 text-2xl font-semibold">Laporan Surat Masuk & Surat Keluar Kecamatan Bojongsari</h2>
  

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Cari nomor/perihal/pengirim/penerima..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 text-white bg-red-600 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 text-white bg-blue-600 rounded"
        >
          Cetak
        </button>
      </div>

      <table className="min-w-full bg-white border rounded">
        <thead>
        <tr className="text-white bg-green-500">
          <th className="px-4 py-2 border">No</th>
          <th className="px-4 py-2 border">Jenis</th>
          <th className="px-4 py-2 border">Nomor</th>
          <th className="px-4 py-2 border">Tanggal</th>
          <th className="px-4 py-2 border">Pengirim/Penerima</th>
          <th className="px-4 py-2 border">Perihal</th>
         </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr
                key={item.id}
                onClick={() => setSelectedSuratId(item.id)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{item.jenis}</td>
                <td className="px-4 py-2 border">{item.nomor}</td>
                <td className="px-4 py-2 border">{dayjs(item.tanggal).format("YYYY-MM-DD")}</td>
                <td className="px-4 py-2 border">{item.pengirim || item.penerima || "-"}</td>
                <td className="px-4 py-2 border">{item.perihal}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 text-center border" colSpan="6">Tidak ada data</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedSuratId && (
        <div className="mt-6">
          <h3 className="mb-2 text-xl font-semibold">Disposisi Surat</h3>
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Tujuan</th>
                <th className="px-4 py-2 border">Isi</th>
                <th className="px-4 py-2 border">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {sampleDisposisi.filter((d) => d.suratId === selectedSuratId).map((d, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 border">{d.tujuan}</td>
                  <td className="px-4 py-2 border">{d.isi}</td>
                  <td className="px-4 py-2 border">{dayjs(d.tanggal).format("YYYY-MM-DD")}</td>
                </tr>
              ))}
              {sampleDisposisi.filter((d) => d.suratId === selectedSuratId).length === 0 && (
                <tr>
                  <td className="px-4 py-2 text-center border" colSpan="3">Tidak ada data disposisi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LaporanSuratPage;
