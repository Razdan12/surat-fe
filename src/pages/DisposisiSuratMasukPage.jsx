import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaRegFilePdf } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import Pagination from "../components/Pagination";
import Modal, { closeModal, openModal } from "../components/Modal";
import Swal from "sweetalert2";
import { getDisposisiAPI, createDisposisiAPI, updateDisposisiAPI, deleteDisposisiAPI } from "../middleware/Disposisi";
import { getSuratAllAPI } from "../middleware/SuratApi";
import { getSuratKeluarAllAPI } from "../middleware/SuratKeluar";
import jsPDF from "jspdf";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const DisposisiSuratMasukPage = () => {
  const navigate = useNavigate();
  const [disposisi, setDisposisi] = useState([]);
  const [suratMasuk, setSuratMasuk] = useState([]);
  const [suratKeluar, setSuratKeluar] = useState([]);
  const [selectedSuratType, setSelectedSuratType] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    // Hanya fetch disposisi yang perlu dipengaruhi oleh pencarian
    fetchDisposisi();
  }, [search, currentPage, itemsPerPage]);

  useEffect(() => {
    // Surat masuk dan surat keluar tidak perlu di-fetch ulang saat search berubah
    fetchSuratMasuk();
    fetchSuratKeluar();
  }, []); // hanya dipanggil sekali saat komponen pertama kali dimuat

  const schema = yup.object().shape({
    status: yup.string().required("is required"),
    tanggalDiterima: yup.string().required("is required"),
    instansi: yup.string().required("is required"),
    perihal: yup.string().required("is required"),
    penerimaTugas: yup.string().required("is required"),
    suratType: yup.string().required("is required"),
    suratMasukId: yup.string().optional(),
    suratKeluarId: yup.string().optional(),
    catatan: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
  } = useForm({
    defaultValues: { status: "", tanggalDiterima: '', instansi: "", perihal: "", penerimaTugas: '', suratType: "", suratKeluarId: "", suratMasukId: "", catatan: "" },
    resolver: yupResolver(schema),
  });

  const fetchSuratMasuk = async () => {
    try {
      const response = await getSuratAllAPI("limit=100&page=1");
      const data = response.data;
      setSuratMasuk(data.items || []);
    } catch (error) {
      console.error("Error fetching surat masuk:", error);
    }
  };

  const fetchSuratKeluar = async () => {
    try {
      const response = await getSuratKeluarAllAPI("limit=100&page=1");
      const data = response.data;
      setSuratKeluar(data.items || []);
    } catch (error) {
      console.error("Error fetching surat keluar:", error);
    }
  };

  const fetchDisposisi = async () => {
    try {
      setLoading(true);

      // Format query search sesuai kebutuhan backend (pastikan backend mendukung format ini)
      const searchParam = search.trim() ? `perihal:${encodeURIComponent(search.trim())}` : "";
      const payload = `limit=${itemsPerPage}&page=${currentPage}&search=perihal:${search}`;

      const response = await getDisposisiAPI(payload);
      const data = response.data;
      setTotalPages(data.total_pages);
      setDisposisi(data.items);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to fetch disposisi data",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      await deleteDisposisiAPI(id);
      setDisposisi(disposisi.filter((item) => item.id !== id));
      Swal.fire({
        title: "Success!",
        text: "Disposisi has been deleted successfully.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete disposisi",
        icon: "error",
      });
    }
  };

  const handleCreate = async (data) => {

    const payload = {
      catatan : data.catatan,
      instansi: data.instansi,
      penerimaTugas: data.penerimaTugas,
      perihal : data.perihal,
      status : data.status,
      suratType: data.suratType,
      tanggalDiterima: data.tanggalDiterima,
      ...(data.suratMasukId && { suratMasukId: data.suratMasukId }),
      ...(data.suratKeluarId && { suratKeluarId: data.suratKeluarId })
    }

    try {
      await createDisposisiAPI(payload);
    
      fetchDisposisi();
      closeModal("add-disposisi");
      resetField()
      Swal.fire({
        title: "Success!",
        text: "Disposisi has been created successfully.",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to create disposisi",
        icon: "error",
      });
    }
  };

  const trigerDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete(id);
      }
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedDisposisi = Object.fromEntries(formData.entries());
    if (!updatedDisposisi.suratType) {
      updatedDisposisi.suratType = 'masuk';
    }
    try {
      await updateDisposisiAPI(updatedDisposisi.id, updatedDisposisi);
      e.target.reset();
      fetchDisposisi();
      closeModal("edit-disposisi");
      Swal.fire({
        title: "Success!",
        text: "Disposisi has been updated successfully.",
        icon: "success",
      });
    } catch (error) {
      closeModal("edit-disposisi");
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to update disposisi",
        icon: "error",
      });
    }
  };

  // Fungsi cetak PDF disposisi
  const handleDownloadDisposisiPDF = (disposisi) => {
    console.log(disposisi);
    
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("PEMERINTAH KABUPATEN PURBALINGGA", 105, 15, { align: "center" });
    doc.setFont(undefined, "bold");
    doc.text("KECAMATAN BOJONGSARI", 105, 22, { align: "center" });
    doc.setFont(undefined, "normal");
    doc.setFontSize(10);
    doc.text("Jalan Raya Kuta Baru No.01 Telp. 6597070 BOJONGSARI", 105, 28, { align: "center" });
    doc.text("E-mail : bojongsari@purbalinggakab.go.id Bojongsari 53362", 105, 33, { align: "center" });
    doc.line(20, 36, 190, 36);
    // Judul
    doc.setFontSize(12);
    doc.text("LEMBAR DISPOSISI", 105, 43, { align: "center" });
    // Data Surat
    const surat = disposisi.suratType === 'masuk' ? disposisi.suratMasuk : disposisi.suratKeluar;
    const yStart = 50;
    doc.setFontSize(10);
    doc.text(`Surat Dari      : ${surat.pengirim || surat.tujuan || "-"}`, 22, yStart);
    doc.text(`Nomor Surat    : ${surat.noSurat || "-"}`, 22, yStart + 6);
    doc.text(`Tanggal Surat  : ${surat.tglSurat ? dayjs(surat.tglSurat).format("DD/MM/YYYY") : "-"}`, 22, yStart + 12);
    doc.text(`Diterima tgl.  : ${disposisi.tanggalDiterima ? dayjs(disposisi.tanggalDiterima).format("DD/MM/YYYY") : "-"}`, 120, yStart);
    doc.text(`No. Agenda     : ${surat.noAgenda || "-"}`, 120, yStart + 6);
    doc.text(`Sifat          : ${surat.sifatSurat || "-"}`, 120, yStart + 12);
    // Sifat Surat
    let sifatX = 105;
    let sifatY = yStart + 26;
    doc.text("Sifat:", 120, yStart + 18);
    doc.rect(sifatX + 15, sifatY - 4, 4, 4); // kotak
    doc.text("Sangat Rahasia", sifatX + 21, sifatY);
    doc.rect(sifatX + 50, sifatY - 4, 4, 4);
    doc.text("Rahasia", sifatX + 56, sifatY);
    doc.rect(sifatX + 75, sifatY - 4, 4, 4);
    doc.text("Biasa", sifatX + 81, sifatY);
    // Diteruskan kepada
    let yBox = yStart + 36;
    doc.text("Diteruskan Kepada sdr.:", 22, yBox);
    const penerimaList = [
      "Sekretaris Camat",
      "Kasi Pemtrantibum",
      "Kasi PMD",
      "Kasi Kesra",
      "Kasubbag Keuangan dan Perencanaan",
      "Kasubbag Umum Kepegawaian"
    ];
    penerimaList.forEach((p, i) => {
      doc.rect(22, yBox + 5 + i * 6, 4, 4);
      doc.text(p, 28, yBox + 9 + i * 6);
      if (disposisi.penerimaTugas === p) {
        doc.setFont("helvetica", "bold");
        doc.text("X", 23, yBox + 9 + i * 6);
        doc.setFont("helvetica", "normal");
      }
    });
    // Dengan Hormat Harap
    let xHarap = 100;
    doc.text("Dengan Hormat Harap:", xHarap, yBox);
    const harapList = [
      "Tanggapan dan Saran",
      "Proses Lebih Lanjut",
      "Koordinasi/Konfirmasi"
    ];
    harapList.forEach((h, i) => {
      doc.rect(xHarap, yBox + 5 + i * 6, 4, 4);
      doc.text(h, xHarap + 6, yBox + 9 + i * 6);
    });
    // Catatan
    doc.text("CATATAN:", 22, yBox + 50);
    doc.rect(22, yBox + 53, 170, 15);
    doc.text(disposisi.catatan || "-", 24, yBox + 60);
    // Ttd
    doc.text("Camat Bojongsari", 150, yBox + 75);
    doc.text("2025", 150, yBox + 80);
    doc.text("TRI WAHYU DINI SUSANTI, S.STP.", 150, yBox + 90);
    doc.text("NIP. 19820322 200012 2 002", 150, yBox + 95);
    doc.save(`Disposisi-${surat.noSurat || disposisi.id}.pdf`);
  };

  const fieldName = watch('suratType') === "masuk" ? "suratKeluarId" : "suratMasukId";

  return (
    <div className="flex flex-col h-screen p-3">
      <div>
        <h2 className="text-2xl font-bold">Disposisi Surat Masuk</h2>
        <p className="text-sm text-gray-500">Manajemen disposisi surat masuk</p>
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
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-xs mr-2 input input-bordered"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-success"
              onClick={() => openModal("add-disposisi")}
            >
              Tambah
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="text-white bg-blue-500">
              <tr>
                <th>No</th>
                <th>Status</th>
                <th>Diterima Tgl.</th>
                <th>Instansi</th>
                <th>Perihal</th>
                <th>Penerima Tgs.</th>
                <th>Tipe Surat</th>
                <th>No. Surat</th>
                <th>Tanggal Surat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {disposisi?.map((item, index) => (
                <tr key={item.id}>
                  <th>{index + 1}</th>
                  <td>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'Baru' ? 'bg-blue-100 text-blue-800' :
                      item.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>{new Date(item.tanggalDiterima).toLocaleDateString()}</td>
                  <td>{item.instansi}</td>
                  <td>{item.perihal}</td>
                  <td>{item.penerimaTugas}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.suratType === 'masuk' ? 'bg-purple-100 text-purple-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                      {item.suratType === 'masuk' ? 'Surat Masuk' : 'Surat Keluar'}
                    </span>
                  </td>
                  <td>
                    {item.suratType === 'masuk'
                      ? item.suratMasuk?.noSurat
                      : item.suratKeluar?.noSurat}
                  </td>
                  <td>
                    {item.suratType === 'masuk'
                      ? new Date(item.suratMasuk?.tglSurat).toLocaleDateString()
                      : new Date(item.suratKeluar?.tglSurat).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="text-xl text-orange-500 btn btn-sm btn-ghost"
                        onClick={() => {
                          openModal("edit-disposisi");
                          const form = document.querySelector(`#edit-disposisi form`);
                          const formattedDate = new Date(item.tanggalDiterima).toISOString().split('T')[0];
                          form.elements.id.value = item.id;
                          form.elements.status.value = item.status;
                          form.elements.tanggalDiterima.value = formattedDate;
                          form.elements.instansi.value = item.instansi;
                          form.elements.perihal.value = item.perihal;
                          form.elements.penerimaTugas.value = item.penerimaTugas;
                          form.elements.suratType.value = item.suratType;
                          setSelectedSuratType(item.suratType);
                          form.elements.suratId.value = item.suratType === 'masuk' ? item.suratMasukId : item.suratKeluarId;
                          if (form.elements.catatan) form.elements.catatan.value = item.catatan || '';
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-xl text-red-500 btn btn-sm btn-ghost"
                        onClick={() => trigerDelete(item.id)}
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="text-xl text-blue-700 btn btn-sm btn-ghost"
                        title="Download Disposisi PDF"
                        onClick={() => handleDownloadDisposisiPDF(item)}
                      >
                        <FaRegFilePdf />
                      </button>
                    </div>
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

      <Modal id={"add-disposisi"}>
        <div>
          <h2 className="text-xl font-bold">Tambah Disposisi</h2>
          <p className="text-sm text-gray-500">
            Form untuk menambah disposisi baru
          </p>
          <div>
            <form onSubmit={handleSubmit(handleCreate)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    className="w-full select select-bordered"
                    required
                    {...register('status')}
                    defaultValue="Baru"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tanggal Diterima</label>
                  <input
                    name="tanggalDiterima"
                    type="date"
                    {...register('tanggalDiterima')}
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Instansi</label>
                  <input
                    name="instansi"
                    type="text"
                    {...register('instansi')}
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Perihal</label>
                  <input
                    name="perihal"
                    type="text"
                    className="w-full input input-bordered"
                    required
                    {...register('perihal')}
                  />
                </div>
                <div>
                  <label className="label">Penerima Tugas</label>
                  <select
                    name="penerimaTugas"
                    className="w-full select select-bordered"
                    required
                    {...register('penerimaTugas')}
                  >
                    <option value="">Pilih Penerima Tugas</option>
                    <option value="Sekretaris Camat">Sekretaris Camat</option>
                    <option value="Kasi Pemtrantibum">Kasi Pemtrantibum</option>
                    <option value="Kasi PMD">Kasi PMD</option>
                    <option value="Kasi Kesra">Kasi Kesra</option>
                    <option value="Kasubbag Keuangan dan Perencanaan">Kasubbag Keuangan dan Perencanaan</option>
                    <option value="Kasubbag Umum Kepegawaian">Kasubbag Umum Kepegawaian</option>
                  </select>
                </div>
                <div>
                  <label className="label">Surat Type</label>
                  <select
                    name="suratType"
                    className="w-full select select-bordered"
                    required

                    {...register('suratType')}
                  >
                    <option value="">Pilih Tipe Surat</option>
                    <option value="masuk">Surat Masuk</option>
                    <option value="keluar">Surat Keluar</option>
                  </select>
                </div>
                <div>
                  <label className="label">Surat</label>
                  <select
                    name="suratId"
                    className="w-full select select-bordered"
                    required
                    {
                    ...register(fieldName)
                    }
                    disabled={!watch("suratType")}
                  >
                    <option value="">Pilih Surat</option>
                    {watch("suratType") === 'masuk' && (
                      suratMasuk.map((surat) => (
                        <option key={`masuk-${surat.id}`} value={surat.id}>
                          {surat.noSurat} - {surat.perihal}
                        </option>
                      ))
                    )}
                    {watch("suratType") === 'keluar' && (
                      suratKeluar.map((surat) => (
                        <option key={`keluar-${surat.id}`} value={surat.id}>
                          {surat.noSurat} - {surat.perihal}
                        </option>
                      ))
                    )}
                  </select>
                  <label className="label">Catatan</label>
                  <textarea
                    name="catatan"
                    className="w-full textarea textarea-bordered"
                    rows="3"
                    placeholder="Masukkan catatan jika ada"
                    {...register("catatan")}
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>

      <Modal id={"edit-disposisi"}>
        <div>
          <h2 className="text-xl font-bold">Edit Disposisi</h2>
          <p className="text-sm text-gray-500">
            Form untuk mengedit data disposisi
          </p>
          <div>
            <form onSubmit={handleUpdate}>
              <div className="grid grid-cols-2 gap-4">
                <input name="id" type="hidden" />
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="Baru">Baru</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
                <div>
                  <label className="label">Tanggal Diterima</label>
                  <input
                    name="tanggalDiterima"
                    type="date"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Instansi</label>
                  <input
                    name="instansi"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Perihal</label>
                  <input
                    name="perihal"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Penerima Tugas</label>
                  <select
                    name="penerimaTugas"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="">Pilih Penerima Tugas</option>
                    <option value="Sekretaris Camat">Sekretaris Camat</option>
                    <option value="Kasi Pemtrantibum">Kasi Pemtrantibum</option>
                    <option value="Kasi PMD">Kasi PMD</option>
                    <option value="Kasi Kesra">Kasi Kesra</option>
                    <option value="Kasubbag Keuangan dan Perencanaan">Kasubbag Keuangan dan Perencanaan</option>
                    <option value="Kasubbag Umum Kepegawaian">Kasubbag Umum Kepegawaian</option>
                  </select>
                </div>

                <div>
                  <label className="label">Surat Type</label>
                  <select
                    name="suratType"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="masuk">Surat Masuk</option>
                    <option value="keluar">Surat Keluar</option>
                  </select>
                </div>
                <div>
                  <label className="label">Surat</label>
                  <select
                    name="suratId"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="">Pilih Surat</option>
                    <optgroup label="Surat Masuk">
                      {suratMasuk.map((surat) => (
                        <option key={`masuk-${surat.id}`} value={surat.id}>
                          {surat.noSurat} - {surat.perihal}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Surat Keluar">
                      {suratKeluar.map((surat) => (
                        <option key={`keluar-${surat.id}`} value={surat.id}>
                          {surat.noSurat} - {surat.perihal}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <label className="label">Catatan</label>
                  <textarea
                    name="catatan"
                    className="w-full textarea textarea-bordered"
                    rows="3"
                    placeholder="Masukkan catatan jika ada"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DisposisiSuratMasukPage;
