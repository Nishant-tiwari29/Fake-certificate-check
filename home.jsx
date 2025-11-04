import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { 
  Shield, CheckCircle2, FileCheck, QrCode, 
  TrendingUp, Users, Award, ArrowRight, 
  Zap, Lock, Globe, Github, Linkedin, Mail 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const navigate = useNavigate();
  const [verifiedCount, setVerifiedCount] = useState(120000);
  
  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list(),
    initialData: [],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setVerifiedCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const features = [
    {
      icon: FileCheck,
      title: "Issue Certificates",
      description: "Create tamper-proof digital certificates with blockchain verification",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Instant Verification",
      description: "Verify credentials in seconds via QR code or certificate ID",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Lock,
      title: "AI + Blockchain Security",
      description: "Advanced AI validation combined with immutable blockchain records",
      color: "from-orange-500 to-red-600"
    }
  ];

  const steps = [
    { title: "Upload Certificate", icon: FileCheck, description: "Institution uploads the credential document" },
    { title: "IPFS Storage", icon: Globe, description: "Document stored on decentralized IPFS network" },
    { title: "Blockchain Record", icon: Lock, description: "Hash recorded on blockchain for immutability" },
    { title: "QR Verification", icon: QrCode, description: "Anyone can verify instantly via QR code" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full">
              <Zap className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Powered by AI + Blockchain</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Verify Academic Credentials
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600"> Instantly</span>
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              Instant, tamper-proof credential verification using blockchain technology and AI-powered validation. Trusted by institutions worldwide.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigate(createPageUrl("Login"))}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-teal-600/20 hover:shadow-xl hover:shadow-teal-600/30 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link to={createPageUrl("Verify")}>
                <Button variant="outline" className="border-2 border-slate-300 px-8 py-6 text-lg rounded-xl hover:bg-slate-50">
                  Verify a Certificate
                </Button>
              </Link>
            </div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 pt-8"
            >
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-600 border-2 border-white" />
                ))}
              </div>
              <div>
                <p className="text-sm text-slate-500">Trusted by 500+ institutions</p>
                <p className="text-2xl font-bold text-slate-900">
                  {verifiedCount.toLocaleString()}+ 
                  <span className="text-lg text-teal-600 ml-2">verified certificates</span>
                </p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-slate-900/10 border border-slate-200">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 animate-bounce">
                <Shield className="w-12 h-12 text-white" />
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <span className="text-slate-600">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-600 font-semibold">Verified</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {['Certificate Hash Generated', 'Stored on IPFS', 'Blockchain Record Created', 'QR Code Generated'].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + i * 0.2 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      <span className="text-slate-700">{step}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-center gap-4 p-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
                    <QrCode className="w-16 h-16 text-white" />
                    <div>
                      <p className="text-white font-semibold">Scan to Verify</p>
                      <p className="text-teal-100 text-sm">Instant verification</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose EduVerify
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-600">
              The most secure and efficient way to manage academic credentials
            </motion.p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-2xl border border-slate-200 hover:border-teal-300 transition-all h-full">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-slate-600">
              Simple, secure, and transparent verification process
            </motion.p>
          </motion.div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-teal-200 via-cyan-300 to-teal-200 -translate-y-1/2 -z-10" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative"
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                        {idx + 1}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            {[
              { value: certificates.length || "2.5K+", label: "Certificates Issued", icon: Award },
              { value: verifiedCount.toLocaleString(), label: "Verifications", icon: CheckCircle2 },
              { value: "500+", label: "Institutions", icon: Users }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div key={idx} variants={itemVariants}>
                  <Icon className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                  <p className="text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-slate-400 text-lg">{stat.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-3xl p-12 shadow-2xl shadow-teal-600/20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Join hundreds of institutions securing their credentials with blockchain
              </p>
              <Button 
                onClick={() => navigate(createPageUrl("Login"))}
                className="bg-white text-teal-600 hover:bg-slate-50 px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Issuing Certificates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">EduVerify</span>
              </div>
              <p className="text-slate-400 text-sm">
                Instant, tamper-proof credential verification
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <p className="text-slate-400 hover:text-white cursor-pointer">Dashboard</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">Verify</p>
                <p className="text-slate-400 hover:text-white cursor-pointer">AI Validator</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm text-slate-400">
                <p>About Us</p>
                <p>Careers</p>
                <p>Contact</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 EduVerify. All rights reserved. Powered by blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}