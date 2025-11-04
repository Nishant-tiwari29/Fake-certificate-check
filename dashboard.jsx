import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  FileCheck, Shield, TrendingUp, AlertCircle, 
  Plus, Eye, Download, CheckCircle2, XCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list('-created_date'),
    initialData: [],
  });

  const stats = {
    total: certificates.length,
    active: certificates.filter(c => c.status === 'active').length,
    revoked: certificates.filter(c => c.status === 'revoked').length,
    verifications: certificates.reduce((sum, c) => sum + (c.verification_count || 0), 0)
  };

  const recentCertificates = certificates.slice(0, 5);

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

  const statCards = [
    {
      title: "Total Certificates",
      value: stats.total,
      icon: FileCheck,
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-600"
    },
    {
      title: "Active Certificates",
      value: stats.active,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "Total Verifications",
      value: stats.verifications,
      icon: Shield,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      title: "Revoked",
      value: stats.revoked,
      icon: XCircle,
      color: "from-red-500 to-rose-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back! 👋</h1>
          <p className="text-slate-600">Here's an overview of your certificate management</p>
        </div>
        <Link to={createPageUrl("IssueCertificate")}>
          <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 shadow-lg shadow-teal-600/20">
            <Plus className="w-5 h-5 mr-2" />
            Issue New Certificate
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-shadow border-0 bg-white relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent Certificates */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Recent Certificates</h2>
          <Link to={createPageUrl("MyCertificates")}>
            <Button variant="outline" className="text-teal-600 border-teal-200 hover:bg-teal-50">
              View All
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recentCertificates.length > 0 ? (
          <div className="space-y-3">
            {recentCertificates.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                    <FileCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{cert.student_name}</p>
                    <p className="text-sm text-slate-600">{cert.degree} • {cert.institution_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    cert.status === 'active' ? 'bg-green-100 text-green-700' :
                    cert.status === 'revoked' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {cert.status}
                  </div>

                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileCheck className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-4">No certificates issued yet</p>
            <Link to={createPageUrl("IssueCertificate")}>
              <Button className="bg-teal-600 hover:bg-teal-700">
                Issue Your First Certificate
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-0 bg-gradient-to-br from-teal-500 to-cyan-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="relative">
            <Shield className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Verify a Certificate</h3>
            <p className="text-teal-100 mb-6">Instantly verify any certificate using its ID or QR code</p>
            <Link to={createPageUrl("Verify")}>
              <Button className="bg-white text-teal-600 hover:bg-slate-50">
                Go to Verification
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 border-0 bg-gradient-to-br from-purple-500 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8" />
          <div className="relative">
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-2">View Analytics</h3>
            <p className="text-purple-100 mb-6">Track certificate issuance and verification trends</p>
            <Link to={createPageUrl("Analytics")}>
              <Button className="bg-white text-purple-600 hover:bg-slate-50">
                View Analytics
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}