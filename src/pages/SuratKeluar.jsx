import React, { useEffect, useState } from "react";
import {
  createSuratKeluarAPI,
  deleteSuratKeluarAPI,
  getSuratKeluarAllAPI,
  updateSuratKeluarAPI,
  downloadSuratKeluarAPI,
} from "../middleware/SuratKeluar";
import Pagination from "../components/Pagination";
import Modal, { closeModal, openModal } from "../components/Modal";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaFileDownload, FaRegFilePdf } from "react-icons/fa";

const SuratKeluar = () => {
  const [suratKeluar, setSuratKeluar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [currentSurat, setCurrentSurat] = useState(null);

  useEffect(() => {
    fetchSuratKeluar();
  }, [search, currentPage, itemsPerPage]);

  // Fetch list
  const fetchSuratKeluar = async () => {
    setLoading(true);
    try {
      const payload = `limit=${itemsPerPage}&page=${currentPage}&search=perihal:${search}`;
      const response = await getSuratKeluarAllAPI(payload);

      // Handle nested data structure
      const raw = response.data ?? response;
      const meta = raw.data ?? raw;
      const items = meta.items || [];

      // Ensure dates are properly formatted
      const formattedItems = items.map(item => ({
        ...item,
        tglSurat: item.tglSurat ? new Date(item.tglSurat) : null,
        tglKirim: item.tglKirim ? new Date(item.tglKirim) : null
      }));

      setSuratKeluar(formattedItems);
      setTotalPages(meta.total_pages || 0);
    } catch (err) {
      console.error("Error fetching surat keluar:", err);
      Swal.fire("Gagal", "Tidak bisa mengambil data surat keluar.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Create
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const newSurat = await createSuratKeluarAPI(formData);
      setSuratKeluar((prev) => [newSurat, ...prev]);
      await fetchSuratKeluar();
      e.target.reset();
      closeModal("add-surat-keluar");
      Swal.fire("Berhasil", "Surat keluar berhasil ditambahkan.", "success");
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
      await updateSuratKeluarAPI(id, formData);
      Swal.fire("Berhasil", "Surat keluar berhasil diperbarui.", "success");
      form.reset();
      setCurrentSurat(null);
      closeModal("edit-surat-keluar");
      await fetchSuratKeluar();
    } catch (error) {
      console.error("Gagal update surat keluar:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat mengupdate surat keluar.", "error");
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
        await deleteSuratKeluarAPI(id);
        await fetchSuratKeluar();
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Surat keluar berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Gagal menghapus surat keluar:", error);
        const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan saat menghapus surat keluar.";
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: errorMessage,
        });
      }
    }
  };

  // Download lampiran
  const handleDownloadLampiran = async (filename) => {
    try {
      const response = await downloadSuratKeluarAPI(filename);

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
        <h2 className="text-2xl font-bold">Data Surat Keluar</h2>
        <p className="text-sm text-gray-500">Manajemen surat keluar</p>
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
            <button className="btn btn-success" onClick={() => openModal("add-surat-keluar")}>
              Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner text-primary" />
            </div>
          ) : (
            <table className="table table-zebra">
              <thead className="text-white bg-blue-500">
                <tr>
                  <th>No</th>
                  <th>Nomor Surat</th>
                  <th>Perihal</th>
                  <th>Tanggal Surat</th>
                  <th>Tanggal Kirim</th>
                  <th>Kepada</th>
                  <th>Klasifikasi</th>
                  <th>Lampiran</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {suratKeluar.length > 0 ? (
                  suratKeluar.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>{s.noSurat}</td>
                      <td>{s.perihal}</td>
                      <td>{s.tglSurat ? new Date(s.tglSurat).toLocaleDateString() : "-"}</td>
                      <td>{s.tglKirim ? new Date(s.tglKirim).toLocaleDateString() : "-"}</td>
                      <td>{s.kepada || "-"}</td>
                      <td>{s.klasifikasi || "-"}</td>
                      <td>
                        {s.lampiran && s.lampiran.endsWith(".pdf") ? (
                          <button
                            onClick={() => handleDownloadLampiran(s.lampiran)}
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
                            setCurrentSurat(s);
                            openModal("edit-surat-keluar");
                            const form = document.querySelector(`#edit-surat-keluar form`);
                            if (form) {
                              Object.keys(s).forEach((key) => {
                                const input = form.elements[key];
                                if (input) {
                                  if (input.type === 'date') {
                                    input.value = s[key] ? new Date(s[key]).toISOString().split('T')[0] : '';
                                  } else if (input.tagName === 'SELECT') {
                                    // Handle select elements
                                    const option = Array.from(input.options).find(opt => opt.value === s[key]);
                                    if (option) {
                                      input.value = s[key];
                                    }
                                  } else {
                                    input.value = s[key] || '';
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
                          onClick={() => handleDelete(s.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">Data surat keluar tidak ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          <div className="flex justify-end w-full mt-4">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>

      {/* Modal: Add */}
      <Modal id="add-surat-keluar">
        <div>
          <h2 className="text-xl font-bold">Tambah Surat Keluar</h2>
          <p className="text-sm text-gray-500">Form untuk menambah surat keluar baru</p>
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
              <label className="label">Tanggal Kirim</label>
              <input name="tglKirim" type="date" className="w-full input input-bordered" required />
            </div>

            <div>
              <label className="label">Kepada</label>
              <input name="kepada" type="text" className="w-full input input-bordered" required />
            </div>

            <div>
              <label className="label">Tujuan</label>
              <input name="tujuan" type="text" className="w-full input input-bordered" required />
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
              <label className="label">Sifat Surat</label>
              <select name="sifatSurat" className="w-full select select-bordered" required>
                <option value="">Pilih Sifat</option>
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Sangat Penting">Sangat Penting</option>
              </select>
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
              <label className="label">Tembusan</label>
              <input name="tembusan" type="text" className="w-full input input-bordered" />
            </div>

            <div className="col-span-2">
              <label className="label">Lampiran (file)</label>
              <input name="lampiran" type="file" className="w-full file-input file-input-bordered" />
            </div>

            <div className="flex justify-end col-span-2 mt-4">
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal: Edit */}
      <Modal id="edit-surat-keluar">
        <div>
          <h2 className="text-xl font-bold">Edit Surat Keluar</h2>
          <p className="text-sm text-gray-500">Form untuk mengedit data surat keluar</p>
          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 mt-4" encType="multipart/form-data">
            <input type="hidden" name="id" value={currentSurat?.id || ""} />
            <input type="hidden" name="lampiranLama" value={currentSurat?.lampiran || ""} />
            <div>
              <label className="label">Nomor Surat</label>
              <input name="noSurat" type="text" className="w-full input input-bordered" required defaultValue={currentSurat?.noSurat || ""} />
            </div>

            <div>
              <label className="label">Tanggal Surat</label>
              <input
                name="tglSurat"
                type="date"
                className="w-full input input-bordered"
                required
                defaultValue={currentSurat?.tglSurat ? new Date(currentSurat.tglSurat).toISOString().split('T')[0] : ""}
              />
            </div>
            <div>
              <label className="label">Tanggal Kirim</label>
              <input
                name="tglKirim"
                type="date"
                className="w-full input input-bordered"
                required
                defaultValue={currentSurat?.tglKirim ? new Date(currentSurat.tglKirim).toISOString().split('T')[0] : ""}
              />
            </div>

            <div>
              <label className="label">Kepada</label>
              <input name="kepada" type="text" className="w-full input input-bordered" required defaultValue={currentSurat?.kepada || ""} />
            </div>

            <div>
              <label className="label">Tujuan</label>
              <input name="tujuan" type="text" className="w-full input input-bordered" required defaultValue={currentSurat?.tujuan || ""} />
            </div>

            <div>
              <label className="label">Nomor Agenda</label>
              <input name="noAgenda" type="text" className="w-full input input-bordered" defaultValue={currentSurat?.noAgenda || ""} />
            </div>
            <div>
              <label className="label">Klasifikasi</label>
              <input name="klasifikasi" type="text" className="w-full input input-bordered" defaultValue={currentSurat?.klasifikasi || ""} />
            </div>
            <div>
              <label className="label">Perihal</label>
              <input name="perihal" type="text" className="w-full input input-bordered" required defaultValue={currentSurat?.perihal || ""} />
            </div>

            <div>
              <label className="label">Sifat Surat</label>
              <select name="sifatSurat" className="w-full select select-bordered" required value={currentSurat?.sifatSurat || ""}>
                <option value="">Pilih Sifat</option>
                <option value="Biasa">Biasa</option>
                <option value="Penting">Penting</option>
                <option value="Sangat Penting">Sangat Penting</option>
              </select>
            </div>

            <div>
              <label className="label">Status</label>
              <select name="status" className="w-full select select-bordered" required value={currentSurat?.status || ""}>
                <option value="">Pilih Status</option>
                <option value="Belum Dibaca">Belum Dibaca</option>
                <option value="Sudah Dibaca">Sudah Dibaca</option>
              </select>
            </div>

            <div>
              <label className="label">Tembusan</label>
              <input name="tembusan" type="text" className="w-full input input-bordered" defaultValue={currentSurat?.tembusan || ""} />
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

            <div className="flex justify-end col-span-2 mt-4">
              <button type="submit" className="btn btn-primary">Simpan</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SuratKeluar;
