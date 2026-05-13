"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Shield, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId: string) => {
    try {
      setActionLoading(userId);
      const res = await adminAPI.toggleUserStatus(userId);
      if (res.data.success) {
        toast.success("Status pengguna berhasil diubah");
        await fetchUsers(); // refresh data
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-8 h-8 text-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manajemen Pengguna</h1>
        <p className="text-slate-500 mt-1">Kelola akses dan status seluruh pengguna platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Peran</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{u.name || "Tanpa Nama"}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    {u.role === "admin" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Shield className="w-3 h-3 mr-1" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Diblokir
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                     {new Date(u.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {u.role !== "admin" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(u.id)}
                        disabled={actionLoading === u.id}
                        className={u.isActive ? "text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" : "text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"}
                      >
                        {actionLoading === u.id ? (
                          <Spinner className="w-4 h-4" />
                        ) : u.isActive ? (
                          <>
                             <ShieldBan className="w-4 h-4 mr-2" /> Blokir
                          </>
                        ) : (
                          <>
                             <ShieldCheck className="w-4 h-4 mr-2" /> Pulihkan
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
