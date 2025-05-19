import React, { useEffect, useState } from "react";
import {
  createSuratMasukAPI,
  deleteSuratMasukAPI,
  getSuratMasukAllAPI,
  updateSuratMasukAPI,
  downloadSuratMasukAPI,
} from "../middleware/SuratMasuk";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import Pagination from "../components/Pagination";
import Modal, { closeModal, openModal } from "../components/Modal";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaFileDownload, FaRegFilePdf } from "react-icons/fa";

const SuratMasuk = () => {
  const [suratMasuk, setSuratMasuk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSurat, setCurrentSurat] = useState(null);
  const apiUrl = import.meta.env.VITE_REACT_API_URL || 'http://localhost:9090';

  useEffect(() => {
    fetchSuratMasuk();
  }, [search, currentPage, itemsPerPage]);

  // Fetch list
  const fetchSuratMasuk = async () => {
    setLoading(true);
    try {
      const payload = `limit=${itemsPerPage}&page=${currentPage}&search=perihal:${search}`;
      const response = await getSuratMasukAllAPI(payload);

      // jika backend bungkus data di .data.data
      const raw = response.data ?? response;
      const meta = raw.data ?? raw;

      setSuratMasuk(meta.items || []);
      setTotalPages(meta.total_pages || 0);
    } catch (err) {
      console.error("Error fetching surat masuk:", err);
      Swal.fire("Gagal", "Tidak bisa mengambil data surat.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const newSurat = await createSuratMasukAPI(formData);
      setSuratMasuk((prev) => [newSurat, ...prev]);
      await fetchSuratMasuk();
      e.target.reset();
      closeModal("add-surat");
      Swal.fire("Berhasil", "Surat berhasil ditambahkan.", "success");
    } catch (error) {
      const response = error.response;
      const status = response?.status;
      const payload = response?.data || {};

      console.error("CREATE ERROR RESPONSE:", status, payload);

      let html;
      if (status === 422) {
        if (Array.isArray(payload.data)) {
          html = payload.data.join("<br/>");
        } else if (payload.errors) {
          html = Object.entries(payload.errors)
            .map(([f, msgs]) => `<strong>${f}</strong>: ${msgs.join(", ")}`)
            .join("<br/>");
        } else {
          html = payload.message || "Validasi gagal";
        }
      } else {
        html = payload.message || error.message;
      }

      Swal.fire({
        icon: "error",
        title: status === 422 ? "Validasi gagal" : `Error ${status}`,
        html,
      });
    }
  };

  // Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const id = parseInt(formData.get("id"));

    try {
      await updateSuratMasukAPI(id, formData);
      Swal.fire("Berhasil", "Surat berhasil diperbarui.", "success");
      form.reset();
      setCurrentSurat(null);
      closeModal("edit-surat");
      await fetchSuratMasuk();
    } catch (error) {
      console.error("Gagal update surat:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengupdate surat.", "error");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus surat ini?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await deleteSuratMasukAPI(id);
        await fetchSuratMasuk(); // Refresh the list after successful delete
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Surat berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Gagal menghapus surat:", error);
        const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan saat menghapus surat.";
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: errorMessage,
        });
      }
    }
  };

  // Generate PDF for a single surat in official letter format
  const handleDownloadSuratPDF = (surat) => {
    const doc = new jsPDF();
    // Header
    doc.setFontSize(12);
    doc.text("PEMERINTAH KABUPATEN PURBALINGGA", 105, 18, { align: "center" });
    doc.setFont(undefined, "bold");
    doc.text("KECAMATAN BOJONGSARI", 105, 26, { align: "center" });
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text("Jalan Kutabaru I Nomor 1 Telp. (0281) 6597070", 105, 32, { align: "center" });
    doc.text("BOJONGSARI - PURBALINGGA", 105, 37, { align: "center" });
    doc.line(20, 40, 190, 40);
    doc.setFontSize(11);
    // Tanggal dan tujuan
    doc.text(`Bojongsari, ${surat.tglSurat ? dayjs(surat.tglSurat).format("D MMMM YYYY") : "-"}`, 150, 48);
    doc.text("Yth. Bupati Purbalingga", 130, 56);
    doc.text("Cq. Kepala Dinas Pemberdayaan", 130, 62);
    doc.text("Masyarakat Dan Desa Kab. Purbalingga", 130, 68);
    doc.text("Di -", 130, 74);
    doc.text("PURBALINGGA", 130, 80);
    // Nomor, Lampiran, Perihal
    doc.text(`Nomor    : ${surat.noSurat || "-"}`, 20, 56);
    doc.text(`Lampiran : ${surat.lampiran ? "1 (satu) bendel" : "-"}`, 20, 62);
    doc.text(`Perihal  : ${surat.perihal || "-"}`, 20, 68);
    // Isi surat
    let isi = `Berdasarkan surat dari Kepala Desa ...\n\nSehubungan dengan hal tersebut, kami sampaikan usulan anggota BPD antar waktu sebagaimana data terlampir.\n\nDemikian usulan anggota BPD antar waktu untuk dapat diproses lebih lanjut.`;
    doc.setFontSize(11);
    doc.text(isi, 20, 92, { maxWidth: 170 });
    // Ttd
    doc.text("CAMAT BOJONGSARI", 140, 170);
    doc.text("(Nama Camat)", 140, 185);
    doc.text("NIP: 198203222000122002", 140, 190);
    // Stempel (optional: you can add an image if you have a base64 logo)
    // doc.addImage(...)
    doc.save(`Surat-${surat.noSurat || surat.id}.pdf`);
  };

  // Update download function
  const handleDownloadLampiran = async (filename) => {
    try {
      const response = await downloadSuratMasukAPI(filename);

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;

      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download file. Please try again.',
      });
    }
  };

  return (
    <div className="flex flex-col h-screen p-3">
      <div>
        <h2 className="text-2xl font-bold">Data Surat Masuk</h2>
        <p className="text-sm text-gray-500">Manajemen surat masuk</p>
      </div>
      <div className="flex flex-col w-full mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="mr-2 text-sm font-medium">Show</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
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
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search perihal..."
              className="w-full max-w-xs mr-2 input input-bordered"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-success"
              onClick={() => openModal("add-surat")}
            >
              tambah
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="text-white bg-blue-500">
              <tr>
                <th>No</th>
                <th>Nomor Surat</th>
                <th>Perihal</th>
                <th>Tanggal Surat</th>
                <th>Tanggal Diterima</th>
                <th>Pengirim</th>
                <th>Klasifikasi</th>
                <th>Lampiran</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suratMasuk?.map((surat, index) => (
                <tr key={surat.id}>
                  <th>{index + 1}</th>
                  <td>{surat.noSurat}</td>
                  <td>{surat.perihal}</td>
                  <td>{surat.tglSurat ? new Date(surat.tglSurat).toLocaleDateString() : "-"}</td>
                  <td>{surat.tglDiterima ? new Date(surat.tglDiterima).toLocaleDateString() : "-"}</td>
                  <td>{surat.pengirim}</td>
                  <td>{surat.klasifikasi || "-"}</td>
                  <td>
                    {surat.lampiran && surat.lampiran.endsWith(".pdf") ? (
                      <button
                        onClick={() => handleDownloadLampiran(surat.lampiran)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaFileDownload />
                        <span>Unduh</span>
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <button
                      className="text-xl text-orange-500 btn btn-sm btn-ghost"
                      onClick={() => {
                        setCurrentSurat(surat);
                        openModal("edit-surat");
                        const form = document.querySelector(`#edit-surat form`);
                        if (form) {
                          Object.keys(surat).forEach((key) => {
                            const input = form.elements[key];
                            if (input) {
                              if (input.type === 'date') {
                                // Format date for date inputs
                                input.value = surat[key] ? new Date(surat[key]).toISOString().split('T')[0] : '';
                              } else {
                                input.value = surat[key] || '';
                              }
                            }
                          });
                        }
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-xl text-red-500 btn btn-sm btn-ghost"
                      onClick={() => handleDelete(surat.id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="text-xl text-blue-700 btn btn-sm btn-ghost"
                      title="Download Surat PDF"
                      onClick={() => handleDownloadSuratPDF(surat)}
                    >
                      <FaRegFilePdf />
                    </button>
                  </td>
                </tr>
              ))}
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
      </div>

      <Modal id={"add-surat"}>
        <div>
          <h2 className="text-xl font-bold">Tambah Surat Masuk</h2>
          <p className="text-sm text-gray-500">
            Form untuk menambah surat masuk baru ke dalam sistem
          </p>
          <div>
            <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4 mt-4" encType="multipart/form-data">
              <input name="id" type="hidden" />
              <div>
                <label className="label">Nomor Surat</label>
                <input name="noSurat" type="text" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Tanggal Surat</label>
                <input name="tglSurat" type="date" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Tanggal Diterima</label>
                <input name="tglDiterima" type="date" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Pengirim</label>
                <input name="pengirim" type="text" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Nomor Agenda</label>
                <input name="noAgenda" type="text" className="w-full input input-bordered" />
              </div>
              <div>
                <label className="label">Klasifikasi</label>
                <input name="klasifikasi" type="text" className="w-full input input-bordered" />
              </div>
              <div>
                <label className="label">Perihal</label>
                <input name="perihal" type="text" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" className="w-full select select-bordered" required>
                  <option value="">Pilih Status</option>
                  <option value="Sudah Dibaca">Sudah Dibaca</option>
                  <option value="Belum Dibaca">Belum Dibaca</option>
                </select>
              </div>
              <div>
                <label className="label">Sifat</label>
                <select name="sifatSurat" className="w-full select select-bordered" required>
                  <option value="">Pilih Sifat</option>
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Sangat Penting">Sangat Penting</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="label">Lampiran (file)</label>
                <input name="lampiran" type="file" className="w-full file-input file-input-bordered" />
              </div>
              <div className="col-span-2">
                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal id={"edit-surat"}>
        <div>
          <h2 className="text-xl font-bold">Edit Surat Masuk</h2>
          <p className="text-sm text-gray-500">
            Form untuk mengedit data surat masuk dalam sistem
          </p>
          <div>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 mt-4" encType="multipart/form-data">
              <input type="hidden" name="id" value={currentSurat?.id || ""} />
              <input type="hidden" name="lampiranLama" value={currentSurat?.lampiran || ""} />
              <div>
                <label className="label">Nomor Surat</label>
                <input name="noSurat" type="text" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Tanggal Surat</label>
                <input name="tglSurat" type="date" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Tanggal Diterima</label>
                <input name="tglDiterima" type="date" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Pengirim</label>
                <input name="pengirim" type="text" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Nomor Agenda</label>
                <input name="noAgenda" type="text" className="w-full input input-bordered" value={currentSurat?.noAgenda || ''} />
              </div>
              <div>
                <label className="label">Klasifikasi</label>
                <input name="klasifikasi" type="text" className="w-full input input-bordered" value={currentSurat?.klasifikasi || ''} />
              </div>
              <div>
                <label className="label">Perihal</label>
                <input name="perihal" type="text" className="w-full input input-bordered" required />
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" className="w-full select select-bordered" required>
                  <option value="Belum Dibaca">Belum Dibaca</option>
                  <option value="Sudah Dibaca">Sudah Dibaca</option>
                </select>
              </div>
              <div>
                <label className="label">Sifat</label>
                <select name="sifatSurat" className="w-full select select-bordered" required>
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Sangat Penting">Sangat Penting</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="label">Lampiran (file)</label>
                <input name="lampiran" type="file" className="w-full file-input file-input-bordered" />
                {currentSurat?.lampiran && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownloadLampiran(currentSurat.lampiran);
                    }}
                    className="inline-block mt-1 text-sm text-blue-500 hover:text-blue-700"
                  >
                    Lihat Lampiran Saat Ini
                  </button>
                )}
              </div>
              <div className="col-span-2">
                <div className="flex justify-end mt-4">
                  <button type="submit" className="btn btn-primary">
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SuratMasuk;
