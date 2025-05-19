import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Pagination from "../components/Pagination";
import { getLaporanSuratAPI } from "../middleware/Laporan";
import Swal from "sweetalert2";

const LaporanSuratPage = () => {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSuratId, setSelectedSuratId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [suratData, setSuratData] = useState([]);
  const [selectedSurat, setSelectedSurat] = useState(null);

  // Tambahkan state filter jenis surat
  const [filterJenisSurat, setFilterJenisSurat] = useState("all"); // 'all', 'masuk', 'keluar'

  useEffect(() => {
    fetchLaporanSurat();
  }, [search, startDate, endDate, currentPage, itemsPerPage]);

  useEffect(() => {
    if (selectedSuratId) {
      const surat = suratData.find(s => s.noSurat === selectedSuratId);
      if (surat) {
        setSelectedSurat(surat);
      }
    }
  }, [selectedSuratId, suratData]);

  const fetchLaporanSurat = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        limit: itemsPerPage,
        page: currentPage,
        search: search,
        startDate: startDate ? dayjs(startDate).toISOString() : '',
        endDate: endDate ? dayjs(endDate).toISOString() : ''
      });

      const response = await getLaporanSuratAPI(queryParams.toString());

      if (response?.data) {
        setSuratData(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } else {
        setSuratData([]);
        setTotalPages(0);
        Swal.fire("Info", "Tidak ada data surat yang ditemukan", "info");
      }
    } catch (error) {
      console.error("Error fetching laporan:", error);
      const errorData = error.response?.data;

      if (errorData?.errors?.error?.code === 'Unauthenticated') {
        return;
      } else {
        Swal.fire("Info", "Data tidak ditemukan", "info");
      }

      setSuratData([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk filter data berdasarkan filterJenisSurat
  const getFilteredSuratData = () => {
    if (filterJenisSurat === "all") {
      return suratData;
    }
    if (filterJenisSurat === "masuk") {
      return suratData.filter(item => item.type === "masuk");
    }
    if (filterJenisSurat === "keluar") {
      return suratData.filter(item => item.type === "keluar");
    }
    return suratData;
  };

  const handleExportPDF = () => {
    const filteredData = getFilteredSuratData();
    const doc = new jsPDF("p", "mm", "a4");

    // Tambahkan logo (gunakan base64 image jika perlu)
    const logoImg = new Image();
    logoImg.src = "/Logo.png"; // Gunakan path relatif jika memungkinkan

    logoImg.onload = () => {
      doc.addImage(logoImg, "PNG", 15, 10, 25, 25); // (img, type, x, y, width, height)

      // Tambahkan teks kop surat
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("PEMERINTAH KABUPATEN PURBALINGGA", 105, 15, { align: "center" });

      doc.setFontSize(13);
      doc.text("KECAMATAN BOJONGSARI", 105, 22, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text("Jalan Kutabaru I Nomor 1 Telp. (0281) 6597070", 105, 28, { align: "center" });
      doc.text("BOJONGSARI - PURBALINGGA", 105, 33, { align: "center" });

      // Garis pembatas
      doc.setLineWidth(0.5);
      doc.line(15, 38, 195, 38);

      // Judul laporan
      let title = "Laporan Surat ";
      if (filterJenisSurat === "all") title += "Masuk & Keluar";
      else if (filterJenisSurat === "masuk") title += "Masuk";
      else if (filterJenisSurat === "keluar") title += "Keluar";

      doc.setFontSize(12);
      doc.text(title, 105, 46, { align: "center" });

      // Table data
      autoTable(doc, {
        startY: 52,
        head: [["No", "Jenis", "Nomor", "Tanggal", "Pengirim/Penerima", "Perihal"]],
        body: filteredData.map((item, index) => [
          index + 1,
          item.type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar',
          item.noSurat,
          dayjs(item.tglSurat).format("YYYY-MM-DD"),
          item.type === 'masuk' ? item.pengirim : item.tujuan,
          item.perihal,
        ]),
        styles: {
          fontSize: 9,
        },
        headStyles: {
          fillColor: [33, 150, 243], // biru
          textColor: 255,
        },
      });

      doc.save("laporan-surat.pdf");
    };

    logoImg.onerror = () => {
      Swal.fire("Gagal", "Gagal memuat logo. Pastikan path /Logo.png benar.", "error");
    };
  };


  const handlePrint = () => {
    const filteredData = getFilteredSuratData();

    let title = "Laporan Surat ";
    if (filterJenisSurat === "all") title += "Masuk & Keluar";
    else if (filterJenisSurat === "masuk") title += "Masuk";
    else if (filterJenisSurat === "keluar") title += "Keluar";

    const printWindow = window.open("", "_blank");
    const html = `
  <html>
    <head>
      <title>Cetak Laporan Surat</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          gap: 10px;
        }
        .logo img {
          width: 70px;
          height: auto;
        }
        .kop {
          text-align: center;
        }
        .kop h2, .kop h3 {
          margin: 0;
        }
        .kop p {
          margin: 2px 0;
        }
        .bold {
          font-weight: bold;
        }
        .border-top {
          border-top: 2px solid #000;
          margin: 10px 0 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          border: 1px solid #000;
          padding: 5px;
          text-align: center;
          font-size: 12px;
        }
        @media print {
          @page {
            size: portrait;
            margin: 20mm;
          }
        }
      </style>
    </head>
    <body>
      <div class="header-container">
        <div class="logo">
          <img src="/Logo.png" alt="Logo" />
        </div>
        <div class="kop">
          <h2>PEMERINTAH KABUPATEN PURBALINGGA</h2>
          <h3 class="bold">KECAMATAN BOJONGSARI</h3>
          <p>Jalan Kutabaru I Nomor 1 Telp. (0281) 6597070</p>
          <p>BOJONGSARI - PURBALINGGA</p>
        </div>
      </div>
      <div class="border-top"></div>
      <h3 style="text-align: center; margin-bottom: 20px;">${title}</h3>
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
          ${filteredData.length > 0
        ? filteredData
          .map(
            (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.type === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'}</td>
                <td>${item.noSurat}</td>
                <td>${dayjs(item.tglSurat).format("YYYY-MM-DD")}</td>
                <td>${item.type === 'masuk' ? item.pengirim : item.tujuan}</td>
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
    <div className="flex flex-col h-screen p-3">
      <div>
        <h2 className="text-2xl font-bold">Laporan Surat</h2>
        <p className="text-sm text-gray-500">Manajemen laporan surat masuk dan keluar</p>
      </div>

      <div className="flex flex-col w-full mt-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm font-medium">Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="select select-bordered"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="text-sm">entries</span>
          </div>

          {/* Tambah pilihan filter jenis surat */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm font-medium">Jenis Surat</label>
            <select
              value={filterJenisSurat}
              onChange={(e) => setFilterJenisSurat(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">Semua</option>
              <option value="masuk">Surat Masuk</option>
              <option value="keluar">Surat Keluar</option>
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input input-bordered"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input input-bordered"
            />
            <input
              type="text"
              placeholder="Cari nomor/perihal/pengirim/penerima..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-xs input input-bordered"
            />
            <button onClick={handleExportPDF} className="btn btn-error w-full sm:w-auto">
              Export PDF
            </button>
            <button onClick={handlePrint} className="btn btn-primary w-full sm:w-auto">
              Cetak
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="text-white bg-blue-500">
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    Loading...
                  </td>
                </tr>
              ) : suratData.length > 0 ? (
                getFilteredSuratData().map((item, index) => (
                  <tr
                    key={`${item.type}-${item.id}-${index}`}
                    onClick={() => {
                      setSelectedSuratId(item.noSurat);
                      setSelectedSurat(item);
                    }}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <th>{index + 1}</th>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${item.type === "masuk"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                          }`}
                      >
                        {item.type === "masuk" ? "Surat Masuk" : "Surat Keluar"}
                      </span>
                    </td>
                    <td>{item.noSurat}</td>
                    <td>{dayjs(item.tglSurat).format("YYYY-MM-DD")}</td>
                    <td>{item.type === "masuk" ? item.pengirim : item.tujuan}</td>
                    <td>{item.perihal}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center" colSpan="6">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-end w-full mt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
          </div>
        </div>

        {selectedSurat && (
          <div className="mt-6">
            <h3 className="mb-2 text-xl font-semibold">Disposisi Surat</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead className="text-white bg-blue-500">
                  <tr>
                    <th>No</th>
                    <th>Tujuan</th>
                    <th>Isi Disposisi</th>
                    <th>Keterangan</th>
                    <th>Sifat</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedSurat.disposisi || []).length > 0 ? (
                    selectedSurat.disposisi.map((disposisi, index) => (
                      <tr key={disposisi.id}>
                        <th>{index + 1}</th>
                        <td>{disposisi.tujuan}</td>
                        <td>{disposisi.isiDisposisi}</td>
                        <td>{disposisi.keterangan}</td>
                        <td>{disposisi.sifat}</td>
                        <td>{disposisi.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center" colSpan="6">
                        Tidak ada disposisi untuk surat ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanSuratPage;
