"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Heart, Frown, Meh, Layers } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
        <h1 className="text-3xl font-bold text-slate-900">Ringkasan Sistem</h1>
        <p className="text-slate-500 mt-1">Status dan statistik platform MindGarden.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengguna" value={stats?.users?.total} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <StatCard title="Pengguna Aktif" value={stats?.users?.active} icon={<Activity className="w-5 h-5 text-green-500" />} />
        <StatCard title="Total Jurnal" value={stats?.activity?.journals} icon={<Layers className="w-5 h-5 text-purple-500" />} />
        <StatCard title="Grup Komunitas" value={stats?.activity?.groups} icon={<Users className="w-5 h-5 text-orange-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-sm border-slate-200">
           <CardHeader>
              <CardTitle className="text-lg">Analisis Sentimen Jurnal Keseluruhan</CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center"><Heart className="w-5 h-5 text-green-600 mr-3" /> <span className="font-medium text-slate-800">Positif</span></div>
                    <span className="font-bold text-green-700">{stats?.sentiment?.positive || 0}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center"><Meh className="w-5 h-5 text-slate-600 mr-3" /> <span className="font-medium text-slate-800">Netral</span></div>
                    <span className="font-bold text-slate-700">{stats?.sentiment?.neutral || 0}</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center"><Frown className="w-5 h-5 text-red-600 mr-3" /> <span className="font-medium text-slate-800">Negatif</span></div>
                    <span className="font-bold text-red-700">{stats?.sentiment?.negative || 0}</span>
                 </div>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">{value || 0}</h3>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
