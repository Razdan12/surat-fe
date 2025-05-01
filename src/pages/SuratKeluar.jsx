import React, { useState, useEffect, useRef } from "react";
import { Edit, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const formatTanggal = (tanggalString) => {
  if (!tanggalString) return "";
  const tanggal = new Date(tanggalString);
  const options = { day: "numeric", month: "long", year: "numeric" };
  return tanggal.toLocaleDateString("id-ID", options);
};

const SuratKeluarPage = () => {
  const [suratKeluar, setSuratKeluar] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: "",
    noSurat: "",
    lampiran: "",
    sifat: "",
    kepada: "",
    perihal: "",
    tembusan: "",
    isiSurat: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const previewRef = useRef(null);

  useEffect(() => {
    const data = [
      {
        status: "Dikirim",
        tanggal: "2025-04-25",
        noSurat: "SK1234",
        perihal: "Surat Permohonan",
        kepada: "PT. ABC",
      },
      {
        status: "Diterima",
        tanggal: "2025-04-20",
        noSurat: "SK1235",
        perihal: "Surat Pengunduran Diri",
        kepada: "XYZ Corp",
      },
    ];
    setSuratKeluar(data);
  }, []);

  const filteredData = suratKeluar.filter(
    (item) =>
      item.perihal?.toLowerCase().includes(search.toLowerCase()) ||
      item.noSurat?.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIsiSuratChange = (value) => {
    setFormData({
      ...formData,
      isiSurat: value,
    });
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditIndex(null);
    setFormData({
      tanggal: "",
      noSurat: "",
      lampiran: "",
      sifat: "",
      kepada: "",
      perihal: "",
      tembusan: "",
      isiSurat: "",
    });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedData = [...suratKeluar];
      updatedData[editIndex] = formData;
      setSuratKeluar(updatedData);
      setEditIndex(null);
    } else {
      setSuratKeluar([...suratKeluar, { ...formData, status: "Dikirim" }]);
    }

    setShowForm(false);
    setFormData({
      tanggal: "",
      noSurat: "",
      lampiran: "",
      sifat: "",
      kepada: "",
      perihal: "",
      tembusan: "",
      isiSurat: "",
    });
  };

  const handleExportPDF = () => {
    const input = previewRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("surat-keluar.pdf");
    });
  };

  const renderPreview = () => {
    return (
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Surat Keluar - Preview</h1>
          <div>
            <button
              onClick={toggleForm}
              className="px-4 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Edit Surat
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div
          ref={previewRef}
          className="p-10 mx-auto bg-white border border-gray-300"
          style={{
            width: "595px", // A4 width in pixels at 72 DPI
            minHeight: "842px", // A4 height
            fontFamily: "Times New Roman, Times, serif",
            lineHeight: "1.6",
          }}
        >
          {/* HEADER */}
          <div className="relative mb-2 text-center">
            {/* LOGO */}
            <img
              src="/Logo.png"
              alt="Logo"
              className="absolute top-0 left-0 w-16 h-16"
            />
            <p className="text-lg font-normal uppercase">
              Pemerintah Kabupaten Purbalingga
            </p>
            <p className="text-lg font-bold uppercase">Kecamatan Bojongsari</p>
            <p className="text-sm">
              Jalan Kutabaru I Nomor 1 Telp.(0281) 6597070
            </p>
            <p className="text-sm uppercase">Bojongsari - Purbalingga</p>
          </div>
          <div className="my-2 border-t-4 border-b-2 border-black"></div>

          {/* TANGGAL */}
          <div className="mt-4 mb-2 text-right">
            <p>Bojongsari, {formatTanggal(formData.tanggal)}</p>
          </div>

          {/* INFORMASI SURAT */}
          <div>
            <table className="mb-4 text-sm">
              <tbody>
                <tr>
                  <td className="pr-4">Nomor</td>
                  <td className="pr-2">:</td>
                  <td>{formData.noSurat}</td>
                </tr>
                <tr>
                  <td>Lampiran</td>
                  <td>:</td>
                  <td>{formData.lampiran || "-"}</td>
                </tr>
                <tr>
                  <td>Sifat</td>
                  <td>:</td>
                  <td>{formData.sifat || "-"}</td>
                </tr>
                <tr>
                  <td>Perihal</td>
                  <td>:</td>
                  <td>{formData.perihal}</td>
                </tr>
              </tbody>
            </table>

            {/* KEPADA */}
            <p className="mt-1">Kepada Yth.</p>
            <div className="mt-4 ml-4 whitespace-pre-line">
              {formData.kepada}
            </div>

            {/* ISI SURAT */}
            <div
              className="mt-6 ml-6 text-justify"
              dangerouslySetInnerHTML={{ __html: formData.isiSurat }}
            />

            {/* PENUTUP */}
            <p className="mt-4 ml-6 text-justify">
              Demikian surat ini kami sampaikan, atas perhatian dan kerjasamanya
              kami ucapkan terima kasih.
            </p>

            {/* TTD */}
            <div className="pr-2 mt-8 text-right">
              <div className="inline-block float-right text-center">
                <p className="mb-16">CAMAT BOJONGSARI</p>
                <p className="font-semibold underline">
                  TRI WAHYU DINI SUSANTI, S.STP.
                </p>
                <p className="text-center">Pembina</p>
                <p className="text-center">NIP. 19820322 200012 2 002</p>
              </div>
            </div>

            {/* TEMBUSAN */}
            {formData.tembusan && (
              <div className="mt-8">
                <p>
                  <strong>Tembusan:</strong>
                </p>
                <div className="ml-6 whitespace-pre-line">
                  {formData.tembusan}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="p-4 bg-white rounded shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Data Surat Keluar</h1>
            <p className="text-sm text-gray-500">
              KECAMATAN BOJONGSARI KABUPATEN PURBALINGGA
            </p>
          </div>
          <button
            onClick={toggleForm}
            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            + Tambah
          </button>
        </div>

        {showPreview ? (
          renderPreview()
        ) : (
          <>
            {showForm && (
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1">Tgl. Surat:</label>
                    <input
                      type="date"
                      name="tanggal"
                      value={formData.tanggal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">No. Surat:</label>
                    <input
                      type="text"
                      name="noSurat"
                      value={formData.noSurat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      placeholder="Masukkan Nomor Surat"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Lampiran:</label>
                    <input
                      type="text"
                      name="lampiran"
                      value={formData.lampiran}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      placeholder="Masukkan Lampiran"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Sifat:</label>
                    <input
                      type="text"
                      name="sifat"
                      value={formData.sifat}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      placeholder="Masukkan Sifat Surat"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Kepada:</label>
                    <textarea
                      name="kepada"
                      value={formData.kepada}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      placeholder="Masukkan Penerima"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Perihal:</label>
                    <input
                      type="text"
                      name="perihal"
                      value={formData.perihal}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      placeholder="Masukkan Perihal"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Tembusan:</label>
                    <textarea
                      name="tembusan"
                      value={formData.tembusan}
                      onChange={handleInputChange}
                      className="w-full px-3 py-1 border rounded"
                      placeholder="Masukkan Tembusan"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block mb-1">Isi Surat:</label>
                    <ReactQuill
                      value={formData.isiSurat}
                      onChange={handleIsiSuratChange}
                      className="w-full"
                      placeholder="Isi Surat"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="px-4 py-2 ml-2 text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Tutup
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-between mb-2">
              <div>
                Show
                <select className="px-2 py-1 mx-2 border rounded">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                entries
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="px-3 py-1 border rounded"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-collapse border-gray-300 table-auto">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="p-2 border">No.</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Tgl. Surat</th>
                    <th className="p-2 border">No. Surat</th>
                    <th className="p-2 border">Perihal</th>
                    <th className="p-2 border">Kepada</th>
                    <th className="p-2 border">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{item.status}</td>
                      <td className="p-2 border">{item.tanggal}</td>
                      <td className="p-2 border">{item.noSurat}</td>
                      <td className="p-2 border">{item.perihal}</td>
                      <td className="p-2 border">{item.kepada}</td>
                      <td className="p-2 border">
                        <button className="px-2 py-1 text-white bg-blue-500 rounded">
                          <Edit size={16} />
                        </button>
                        <button className="px-2 py-1 ml-2 text-white bg-red-500 rounded">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SuratKeluarPage;
