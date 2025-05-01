import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const CetakSuratPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Simulasi data. Di real case, fetch dari API atau context state
  const surat = JSON.parse(localStorage.getItem("suratMasuk"))?.find(
    (s) => s.id === parseInt(id)
  );

  if (!surat) return <div>Data tidak ditemukan</div>;

  return (
    <div className="p-6 print:p-0">
      <div className="mb-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 print:hidden"
        >
          Cetak Sekarang
        </button>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 ml-2 text-white bg-gray-500 rounded hover:bg-gray-600 print:hidden"
        >
          Kembali
        </button>
      </div>

      <div className="p-4 border border-gray-400 rounded print:border-none">
        <h2 className="mb-2 text-xl font-bold">Detail Surat Masuk</h2>
        <p><strong>No. Agenda:</strong> {surat.noAgenda}</p>
        <p><strong>Tanggal Diterima:</strong> {surat.tglDiterima}</p>
        <p><strong>Instansi:</strong> {surat.instansi}</p>
        <p><strong>Perihal:</strong> {surat.perihal}</p>

        {surat.fileUrl ? (
          <iframe
            src={surat.fileUrl}
            title="Preview Surat"
            className="w-full h-[600px] mt-4 border"
          />
        ) : (
          <p className="mt-4 text-red-500">Tidak ada file untuk dicetak.</p>
        )}
      </div>
    </div>
  );
};

export default CetakSuratPage;
