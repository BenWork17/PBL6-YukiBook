import React, { useState, useEffect } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const limit = 20;

  // Filter state
  const [filterText, setFilterText] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterActive, setFilterActive] = useState(""); // "" | "true" | "false"

  // Modal state cho thêm user
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    fullname: "",
    phoneNumber: "",
    email: "",
    address: "",
    dateOfBirth: "",
    roleId: "",
    active: true,
  });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${user?.accessToken || user?.token}` },
  });

  // Fetch users từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://ebook-nvc-3.onrender.com/api/v1/users?page=${page}&limit=${limit}`,
        getAuthHeader()
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // CRUD handlers
  const handleAddUser = async (userData) => {
    try {
      await axios.post(
        "https://ebook-nvc-3.onrender.com/api/v1/users",
        userData,
        getAuthHeader()
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditUser = async (id, updatedData) => {
    try {
      await axios.put(
        `https://ebook-nvc-3.onrender.com/api/v1/users/${id}`,
        updatedData,
        getAuthHeader()
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(
        `https://ebook-nvc-3.onrender.com/api/v1/users/${id}`,
        getAuthHeader()
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;

  // Áp dụng filter trước khi render
  const filteredUsers = users.filter(u =>
    u.fullname.toLowerCase().includes(filterText.toLowerCase()) &&
    (filterRole === "" || String(u.roleId) === filterRole) &&
    (filterActive === "" || String(u.active) === filterActive)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Header và nút Thêm */}
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center rounded bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Thêm mới
          </button>
        </div>

        {/* FILTER PANEL */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="border rounded px-3 py-1 flex-1"
          />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">Tất cả vai trò</option>
            <option value="1">Admin (1)</option>
            <option value="2">Shop Owner (2)</option>
            <option value="3">Customer (3)</option>
          </select>
          <select
            value={filterActive}
            onChange={e => setFilterActive(e.target.value)}
            className="border rounded px-3 py-1"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Add User Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-96 p-6">
              <h2 className="text-lg font-semibold mb-4">Thêm người dùng mới</h2>
              <div className="space-y-3">
                {[
                  { label: "Họ và tên", key: "fullname", type: "text" },
                  { label: "Số điện thoại", key: "phoneNumber", type: "text" },
                  { label: "Email", key: "email", type: "email" },
                  { label: "Địa chỉ", key: "address", type: "text" },
                  { label: "Ngày sinh", key: "dateOfBirth", type: "date" },
                  { label: "Role ID", key: "roleId", type: "number" },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium">{label}</label>
                    <input
                      type={type}
                      value={newUser[key]}
                      onChange={(e) =>
                        setNewUser({ ...newUser, [key]: e.target.value })
                      }
                      className="mt-1 w-full border rounded px-2 py-1"
                    />
                  </div>
                ))}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newUser.active}
                    onChange={(e) =>
                      setNewUser({ ...newUser, active: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm">Active</span>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({
                      fullname: "",
                      phoneNumber: "",
                      email: "",
                      address: "",
                      dateOfBirth: "",
                      roleId: "",
                      active: true,
                    });
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    handleAddUser(newUser);
                    setShowAddModal(false);
                    setNewUser({
                      fullname: "",
                      phoneNumber: "",
                      email: "",
                      address: "",
                      dateOfBirth: "",
                      roleId: "",
                      active: true,
                    });
                  }}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bảng Users */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto rounded-lg bg-white shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Họ và tên</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">SĐT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Địa chỉ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Ngày sinh</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Role ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filteredUsers.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.fullname}</td>
                  <td className="px-4 py-3">{u.phoneNumber}</td>
                  <td className="px-4 py-3">{u.email || "-"}</td>
                  <td className="px-4 py-3">{u.address}</td>
                  <td className="px-4 py-3">{u.dateOfBirth}</td>
                  <td className="px-4 py-3">{u.roleId}</td>
                  <td className="px-4 py-3">
                    {u.active ? (
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Active</span>
                    ) : (
                      <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">Inactive</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {/* mở modal edit ở đây */}}
                      className="text-blue-600 hover:underline text-sm mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    Không có bản ghi phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <div className="mt-4 flex justify-end space-x-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(p - 1, 0))}
            className="px-3 py-1 rounded border"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded border"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
