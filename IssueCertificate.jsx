import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  FileCheck, Upload, QrCode, CheckCircle2, 
  Loader2, AlertCircle, ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export default function IssueCertificatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    student_name: "",
    enrollment_number: "",
    degree: "",
    institution_name: "",
    grade: "",
    issue_date: new Date().toISOString().split('T')[0],
  });
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCert, setGeneratedCert] = useState(null);

  const createMutation = useMutation({
    mutationFn: async (certData) => {
      let fileUrl = null;
      
      if (file) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        fileUrl = file_url;
      }

      // Generate blockchain-like hash
      const hashInput = `${certData.student_name}-${certData.degree}-${Date.now()}`;
      const certificate_hash = `0x${btoa(hashInput).slice(0, 64)}`;
      const blockchain_tx_hash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const ipfs_cid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      const certificate_id = `EDU-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const fullData = {
        ...certData,
        certificate_id,
        certificate_hash,
        blockchain_tx_hash,
        ipfs_cid,
        qr_code_data: certificate_id,
        file_url: fileUrl,
        status: "active",
        verification_count: 0,
        ai_confidence_score: Math.floor(Math.random() * 5) + 95,
        // Add institution details
        institution: {
  name: certData.institution_name,
  // Generate a mock ID if needed
  id: `INST-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
  accreditation: "Accredited", // or make this a form field
},
        // Add metadata
        metadata: {
         issuer_id: `INST-${Date.now()}`,
          issue_timestamp: new Date().toISOString(),
          verification_url: `https://example.com/verify/${certificate_id}`,
        }
      };

      return await base44.entities.Certificate.create(fullData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      setGeneratedCert(data);
      toast.success("Certificate issued successfully!");
    },
    onError: (error) => {
      toast.error("Failed to issue certificate");
      console.error(error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    const required = ['student_name', 'enrollment_number', 'degree', 'institution_name', 'grade', 'issue_date'];
    for (const field of required) {
      if (!formData[field]?.trim()) {
        toast.error(`Please enter ${field.replace('_', ' ')}`);
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate blockchain processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      createMutation.mutate(formData);
      
      // Show success message
      toast.success("Certificate creation initiated");
    } catch (error) {
      toast.error("Failed to create certificate: " + error.message);
      console.error("Certificate creation error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (generatedCert) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Certificate Issued Successfully!</h2>
              <p className="text-slate-600">The certificate has been recorded on the blockchain</p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Certificate ID</p>
                  <p className="font-mono font-semibold text-slate-900">{generatedCert.certificate_id}</p>
                </div>
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Student Name</p>
                  <p className="font-semibold text-slate-900">{generatedCert.student_name}</p>
                </div>
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Blockchain TX</p>
                  <p className="font-mono text-sm text-slate-900 truncate">{generatedCert.blockchain_tx_hash}</p>
                </div>
                <div className="p-4 bg-white rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">IPFS CID</p>
                  <p className="font-mono text-sm text-slate-900 truncate">{generatedCert.ipfs_cid}</p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl text-center">
                <QrCode className="w-32 h-32 mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-600">QR Code for Verification</p>
                <p className="text-xs text-slate-500 mt-1">Scan to verify this certificate</p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={() => {
                    setGeneratedCert(null);
                    setFormData({
                      student_name: "",
                      degree: "",
                      institution_name: "",
                      issue_date: new Date().toISOString().split('T')[0],
                    });
                    setFile(null);
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                >
                  Issue Another Certificate
                </Button>
                <Button 
                  onClick={() => navigate(createPageUrl("MyCertificates"))}
                  variant="outline"
                  className="flex-1"
                >
                  View All Certificates
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Issue New Certificate</h1>
        <p className="text-slate-600">Create a blockchain-verified academic credential</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <Card className="lg:col-span-2 p-8 border-0 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Information */}
                <div>
                  <p htmlFor="student_name" className="text-sm font-medium text-gray-700">
                    Student Name *
                  </p>
                  <Input
                    id="student_name"
                    name="student_name"
                    value={formData.student_name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Enter student's full name"
                  />
                </div>

                <div>
                  <p htmlFor="enrollment_number" className="text-sm font-medium text-gray-700">
                    Enrollment Number *
                  </p>
                  <Input
                    id="enrollment_number"
                    name="enrollment_number"
                    value={formData.enrollment_number}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Enter student's enrollment number"
                  />
                </div>

                <div>
                  <p htmlFor="degree" className="text-sm font-medium text-gray-700">
                    Degree/Course Name *
                  </p>
                  <Input
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Enter degree or course name"
                  />
                </div>

                <div>
                  <p htmlFor="institution_name" className="text-sm font-medium text-gray-700">
                    Institution Name *
                  </p>
                  <Input
                    id="institution_name"
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Enter institution name"
                  />
                </div>

                <div>
                  <p htmlFor="grade" className="text-sm font-medium text-gray-700">
                    Grade/CGPA *
                  </p>
                  <Input
                    id="grade"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Enter grade or CGPA"
                  />
                </div>

                <div>
                  <p htmlFor="issue_date" className="text-sm font-medium text-gray-700">
                    Issue Date *
                  </p>
                  <Input
                    id="issue_date"
                    name="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FileCheck className="w-5 h-5 mr-2" />
                      <span>Issue Certificate</span>
                    </div>
                  )}
                </Button>
              </div>
            </Card>

            <div>
              <p htmlFor="file" className="text-sm font-semibold text-slate-700">
                Upload Certificate PDF (Optional)
              </p>
              <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-teal-400 transition-colors">
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-2">Drag and drop or click to upload</p>
                <input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <p htmlFor="file">
                  <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('file').click()}>
                    Browse Files
                  </Button>
                </p>
                {file && (
                  <p className="text-sm text-teal-600 mt-3 font-medium">{file.name}</p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-lg font-semibold shadow-lg shadow-teal-600/20"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing on Blockchain...
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5 mr-2" />
                  Issue Certificate
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Process Info */}
        <div className="space-y-6">
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-bold text-slate-900 mb-4">Issuance Process</h3>
            <div className="space-y-4">
              {[
                { icon: Upload, text: "Upload certificate details", active: !isProcessing },
                { icon: FileCheck, text: "Generate certificate hash", active: isProcessing },
                { icon: ExternalLink, text: "Store on IPFS", active: isProcessing },
                { icon: CheckCircle2, text: "Record on blockchain", active: isProcessing }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.active ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-600">{step.text}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 border-0 bg-gradient-to-br from-amber-50 to-orange-50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 mb-1">Important</p>
                <p className="text-sm text-amber-800">Once issued, certificates cannot be edited. Verify all details before submitting.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}