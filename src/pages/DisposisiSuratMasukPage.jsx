import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

const data = [
  {
    status: "Baru",
    tanggalDiterima: "2025-05-02",
    instansi: "Dinas Kesehatan",
    perihal: "Permintaan Data",
    penerimaTugas: "Sukarto",
  },
  {
    status: "Diproses",
    tanggalDiterima: "2025-05-01",
    instansi: "Dinas Pendidikan",
    perihal: "Undangan Rapat",
    penerimaTugas: "Ahmad",
  },
];

const DisposisiSuratMasukPage = () => {
  const navigate = useNavigate();
  const [selectedDisposisi, setSelectedDisposisi] = useState(null);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleDetailClick = (row) => {
    setSelectedDisposisi(row);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1); // reset ke halaman pertama
  };

  const totalPages = Math.ceil(data.length / perPage);
  const paginatedData = data.slice((currentPage - 1) * perPage, currentPage * perPage);

  const columns = [
    {
      name: "No.",
      selector: (row, index) => (currentPage - 1) * perPage + index + 1,
      width: "70px",
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => <span style={{ fontWeight: 'bold' }}>{row.status}</span>,
    },
    {
      name: "Diterima Tgl.",
      selector: (row) => row.tanggalDiterima,
    },
    {
      name: "Instansi",
      selector: (row) => row.instansi,
    },
    {
      name: "Perihal",
      selector: (row) => row.perihal,
    },
    {
      name: "Penerima Tgs.",
      selector: (row) => row.penerimaTugas,
    },
    {
      name: "Aksi",
      cell: (row) => (
        <button className="btn btn-sm btn-primary" onClick={() => handleDetailClick(row)}>
          Detail
        </button>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px" }}>
        <h2>Disposisi Surat Masuk</h2>
        {selectedDisposisi && (
          <div style={{ fontSize: "0.85rem" }}>
            <strong>Instansi:</strong> {selectedDisposisi.instansi} |{" "}
            <strong>Perihal:</strong> {selectedDisposisi.perihal}
          </div>
        )}
      </div>

          {/* Konten utama */}
          <div className="container my-4" style={{ display: "flex", justifyContent: "center" }}>
            <div className="shadow-sm card" style={{ width: "100%", maxWidth: "1200px" }}>
              <div className="card-body">
                <h5 className="fw-bold">Daftar Disposisi</h5>
                <small className="text-muted">KECAMATAN BOJONGSARI KABUPATEN PURBALINGGA</small>

                {/* Tombol kembali di sebelah kanan */}
                <div style={{ position: "relative" }}>
                  <button
                    className="my-1 text-white btn btn-lg"
                    style={{
                      backgroundColor: '#6c757d',  // Warna latar belakang abu-abu
                      position: 'absolute',         // Memungkinkan penempatan tombol di pojok
                      top: '4px',                 
                      right: '10px',                
                    }}
                    onClick={() => navigate("/")}
                  >
                    ← Kembali ke Beranda
                  </button>
                  </div>

            {/* Show entries control di atas tabel */}
            <div className="mt-3 mb-2 d-flex justify-content-start align-items-center">
              <span className="me-2">Show entries:</span>
              <select value={perPage} onChange={handlePerPageChange} className="form-select" style={{ width: 'auto' }}>
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Tabel */}
            <DataTable
              columns={columns}
              data={paginatedData}
              noDataComponent="No data available in table"
              striped
              highlightOnHover
              responsive
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#ffc107',
                    color: '#212529',
                    fontWeight: 'bold',
                  },
                },
                rows: {
                  style: {
                    backgroundColor: '#fff',
                  },
                },
              }}
            />

            {/* Previous / Next buttons di bawah tabel */}
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-3 text-center text-muted">2025 © Administrasi</div>
    </div>
  );
};

export default DisposisiSuratMasukPage;
