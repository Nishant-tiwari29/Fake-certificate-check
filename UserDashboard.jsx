import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  Shield, Search, CheckCircle2, History,
  TrendingUp, Award, User as UserIcon, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UserDashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        // Check if this is first login after OTP verification
        const pendingVerification = localStorage.getItem('pending_verification');
        if (pendingVerification) {
          const { userType, verified } = JSON.parse(pendingVerification);
          await base44.auth.updateMe({
            user_type: userType,
            is_verified: verified
          });
          localStorage.removeItem('pending_verification');
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadUser();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Welcome back, {user?.full_name || 'User'}! 👋
              </h1>
              <p className="text-xl text-slate-600">Verify certificates instantly and securely</p>
            </div>
            <Button
              onClick={() => base44.auth.logout()}
              variant="outline"
              className="border-2"
            >
              Logout
            </Button>
          </div>

          {/* Verification Badge */}
          {user?.is_verified && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-200 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Email Verified</span>
            </div>
          )}
        </motion.div>

        {/* Quick Action Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          <motion.div variants={itemVariants}>
            <Link to={createPageUrl("Verify")}>
              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform" />
                <div className="relative">
                  <Shield className="w-16 h-16 mb-4" />
                  <h2 className="text-3xl font-bold mb-3">Verify Certificate</h2>
                  <p className="text-purple-100 mb-6">
                    Enter certificate ID or scan QR code to verify authenticity instantly
                  </p>
                  <Button className="bg-white text-purple-600 hover:bg-purple-50">
                    Start Verification →
                  </Button>
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Link to={createPageUrl("AIValidator")}>
              <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white hover:shadow-2xl transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform" />
                <div className="relative">
                  <Award className="w-16 h-16 mb-4" />
                  <h2 className="text-3xl font-bold mb-3">AI Validator</h2>
                  <p className="text-teal-100 mb-6">
                    Upload certificate documents for AI-powered authenticity analysis
                  </p>
                  <Button className="bg-white text-teal-600 hover:bg-teal-50">
                    Upload Document →
                  </Button>
                </div>
              </Card>
            </Link>
          </motion.div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Verification</h3>
              <p className="text-sm text-slate-600">
                Get verification results in seconds through blockchain technology
              </p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Secure & Trusted</h3>
              <p className="text-sm text-slate-600">
                All verifications are secured with blockchain and AI technology
              </p>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-6 border-0 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email Proofs</h3>
              <p className="text-sm text-slate-600">
                Request detailed verification proofs sent directly to your email
              </p>
            </Card>
          </motion.div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg mb-1">Account Information</h3>
                <p className="text-slate-600">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    User Account
                  </span>
                  {user?.is_verified && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}