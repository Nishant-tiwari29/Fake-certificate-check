import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  TrendingUp, FileCheck, Shield, Award, 
  Calendar, Building2, BarChart3, PieChart 
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list('-created_date'),
    initialData: [],
  });

  // Calculate analytics
  const monthlyData = React.useMemo(() => {
    const months = {};
    certificates.forEach(cert => {
      const month = new Date(cert.created_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[month] = (months[month] || 0) + 1;
    });
    return Object.entries(months).map(([month, count]) => ({ month, count })).slice(-6);
  }, [certificates]);

  const statusData = React.useMemo(() => [
    { name: 'Active', value: certificates.filter(c => c.status === 'active').length, color: '#00C2A8' },
    { name: 'Revoked', value: certificates.filter(c => c.status === 'revoked').length, color: '#FF6B6B' },
    { name: 'Pending', value: certificates.filter(c => c.status === 'pending').length, color: '#FFD166' }
  ], [certificates]);

  const institutionData = React.useMemo(() => {
    const institutions = {};
    certificates.forEach(cert => {
      institutions[cert.institution_name] = (institutions[cert.institution_name] || 0) + 1;
    });
    return Object.entries(institutions)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [certificates]);

  const verificationTrend = React.useMemo(() => {
    const trend = {};
    certificates.forEach(cert => {
      const month = new Date(cert.created_date).toLocaleDateString('en-US', { month: 'short' });
      trend[month] = (trend[month] || 0) + (cert.verification_count || 0);
    });
    return Object.entries(trend).map(([month, verifications]) => ({ month, verifications })).slice(-6);
  }, [certificates]);

  const stats = {
    total: certificates.length,
    thisMonth: certificates.filter(c => {
      const certDate = new Date(c.created_date);
      const now = new Date();
      return certDate.getMonth() === now.getMonth() && certDate.getFullYear() === now.getFullYear();
    }).length,
    totalVerifications: certificates.reduce((sum, c) => sum + (c.verification_count || 0), 0),
    avgConfidence: certificates.length > 0 
      ? (certificates.reduce((sum, c) => sum + (c.ai_confidence_score || 0), 0) / certificates.length).toFixed(1)
      : 0
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics Dashboard</h1>
        <p className="text-slate-600">Insights and trends for certificate issuance and verification</p>
      </div>

      {/* Key Metrics */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: "Total Certificates",
            value: stats.total,
            change: `+${stats.thisMonth} this month`,
            icon: FileCheck,
            color: "from-teal-500 to-cyan-600",
            bgColor: "bg-teal-50"
          },
          {
            title: "Total Verifications",
            value: stats.totalVerifications,
            change: "Across all certificates",
            icon: Shield,
            color: "from-purple-500 to-pink-600",
            bgColor: "bg-purple-50"
          },
          {
            title: "Avg AI Confidence",
            value: `${stats.avgConfidence}%`,
            change: "Authentication accuracy",
            icon: Award,
            color: "from-orange-500 to-red-600",
            bgColor: "bg-orange-50"
          },
          {
            title: "This Month",
            value: stats.thisMonth,
            change: "Newly issued",
            icon: Calendar,
            color: "from-green-500 to-emerald-600",
            bgColor: "bg-green-50"
          }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="p-6 border-0 shadow-lg relative overflow-hidden group hover:shadow-xl transition-shadow">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full transform translate-x-8 -translate-y-8`} />
                <div className="relative">
                  <div className={`p-3 ${stat.bgColor} rounded-xl inline-flex mb-4`}>
                    <Icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${stat.color}`} style={{WebkitTextFillColor: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text'}} />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.change}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Issuance */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-teal-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Monthly Issuance</h3>
              <p className="text-sm text-slate-600">Certificates issued over time</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Bar dataKey="count" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C2A8" />
                    <stop offset="100%" stopColor="#00A896" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Status Distribution */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Status Distribution</h3>
              <p className="text-sm text-slate-600">Certificate status breakdown</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="ml-8 space-y-3">
                {statusData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-600">{item.value} certificates</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Verification Trends */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Verification Trends</h3>
              <p className="text-sm text-slate-600">Monthly verification activity</p>
            </div>
          </div>
          {isLoading ? (
            <div className="h-64 bg-slate-100 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={verificationTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#64748B" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="verifications" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Top Institutions */}
        <Card className="p-6 border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Top Institutions</h3>
              <p className="text-sm text-slate-600">Most active issuers</p>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {institutionData.map((inst, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-white">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{inst.name}</p>
                      <p className="text-xs text-slate-600">{inst.count} certificates</p>
                    </div>
                  </div>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full"
                      style={{ width: `${(inst.count / Math.max(...institutionData.map(i => i.count))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}