import React, { useEffect, useState } from "react";
import {
  createUserAPI,
  deleteUserAPI,
  getUsersAPI,
  updateUserAPI,
} from "../middleware/Users";
import Pagination from "../components/Pagination";
import Modal, { closeModal, openModal } from "../components/Modal";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import getErrorMessage from "../middleware/helper";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [search, currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      const payload = `limit=${itemsPerPage}&page=${currentPage}&search=name:${search}`;
      const response = await getUsersAPI(payload);
      const data = response.data;
      setTotalPages(data.total_pages);
      setUsers(response.data.items);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      await deleteUserAPI(id);
      setUsers(users.filter((user) => user.id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData.entries());
    if (!newUser.nip || newUser.nip.trim() === "") {
      delete newUser.nip;
    }

    try {
      await createUserAPI(newUser);
      setUsers((prevUsers) => [...prevUsers, newUser]);
      e.target.reset();
      fetchUsers();
      closeModal("add-user");
    } catch (error) {
      closeModal("add-user");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: getErrorMessage(error),
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
    const updatedUser = Object.fromEntries(formData.entries());
    try {
      await updateUserAPI(updatedUser.id, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      e.target.reset();
      fetchUsers();
      closeModal("edit-user");
    } catch (error) {
       closeModal("edit-user");
       Swal.fire({
        icon: "error",
        title: "Oops...",
        text: getErrorMessage(error),
      });
      
    }
  };

  return (
    <div className="flex flex-col h-screen p-3">
      <div>
        <h2 className="text-2xl font-bold">Data Pengguna</h2>
        <p className="text-sm text-gray-500">Manajemen data pengguna sistem</p>
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
              onClick={() => openModal("add-user")}
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
                <th>NIP</th>
                <th>email</th>
                <th>Nama Lengkap</th>
                <th>Jabatan</th>
                <th>Level</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user, index) => (
                <tr key={user.id}>
                  <th>{index + 1}</th>
                  <td>{user.nip}</td>
                  <td>{user.email}</td>
                  <td>{user.name}</td>
                  <td>{user.jabatan}</td>
                  <td>{user.role}</td>

                  <td>
                    <button
                      className="text-xl text-orange-500 btn btn-sm btn-btn-ghost"
                      onClick={() => {
                        openModal("edit-user");
                        const form = document.querySelector(`#edit-user form`);
                        Object.keys(user).forEach((key) => {
                          const input = form.elements[key];
                          if (input) input.value = user[key];
                        });
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-xl text-red-500 btn btn-sm btn-ghost"
                      onClick={() => trigerDelete(user.id)}
                    >
                      <FaTrash />
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

      <Modal id={"add-user"}>
        <div>
          <h2 className="text-xl font-bold">Tambah Pengguna</h2>
          <p className="text-sm text-gray-500">
            Form untuk menambah pengguna baru ke dalam sistem
          </p>
          <div>
            <form
              onSubmit={async (e) => {
                handleCreate(e);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Nama Lengkap</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">NIP</label>
                  <input
                    name="nip"
                    type="number"
                    className="w-full input input-bordered"
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    name="role"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="label">Jabatan</label>
                  <input
                    name="jabatan"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Tempat Lahir</label>
                  <input
                    name="tempatLahir"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Tanggal Lahir</label>
                  <input
                    name="tanggalLahir"
                    type="date"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Telepon</label>
                  <input
                    name="telepon"
                    type="number"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value={true}>Aktif</option>
                    <option value={false}>Tidak Aktif</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Alamat</label>
                  <textarea
                    name="alamat"
                    className="w-full textarea textarea-bordered"
                    required
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

      <Modal id={"edit-user"}>
        <>
          <h2 className="text-xl font-bold">Edit Pengguna</h2>
          <p className="text-sm text-gray-500">
            Form untuk mengedit data pengguna dalam sistem
          </p>
          <div>
            <form
              onSubmit={async (e) => {
                handleUpdate(e);
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <input name="id" type="hidden" />
                <div>
                  <label className="label">Nama Lengkap</label>
                  <input
                    name="name"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">NIP</label>
                  <input
                    name="nip"
                    type="number"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select
                    name="role"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Jenis Kelamin</label>
                  <select
                    name="jenisKelamin"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="label">Jabatan</label>
                  <input
                    name="jabatan"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Tempat Lahir</label>
                  <input
                    name="tempatLahir"
                    type="text"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Tanggal Lahir</label>
                  <input
                    name="tanggalLahir"
                    type="date"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Telepon</label>
                  <input
                    name="telepon"
                    type="number"
                    className="w-full input input-bordered"
                    required
                  />
                </div>
                <div>
                  <label className="label">Status</label>
                  <select
                    name="status"
                    className="w-full select select-bordered"
                    required
                  >
                    <option value={true}>Aktif</option>
                    <option value={false}>Tidak Aktif</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="label">Alamat</label>
                  <textarea
                    name="alamat"
                    className="w-full textarea textarea-bordered"
                    required
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
        </>
      </Modal>
    </div>
  );
};

export default Users;
