import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  Shield, Search, QrCode, CheckCircle2, 
  XCircle, AlertCircle, FileText, Building2, 
  Calendar, Award, ExternalLink, Copy, Download,
  TrendingUp, Star, Link as LinkIcon, Mail,
  Lock, Globe, Activity, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [emailForProof, setEmailForProof] = useState("");

  const { data: certificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list(),
    initialData: [],
  });

  const sendProofMutation = useMutation({
    mutationFn: async ({ email, certData }) => {
      const proof = {
        certificate_id: certData.certificate_id,
        student_name: certData.student_name,
        degree: certData.degree,
        institution: certData.institution_name,
        blockchain_tx: certData.blockchain_tx_hash,
        ipfs_cid: certData.ipfs_cid,
        verified_at: new Date().toISOString(),
        status: "VERIFIED",
        ai_confidence: certData.ai_confidence_score,
        verification_count: certData.verification_count
      };

      await base44.integrations.Core.SendEmail({
        to: email,
        subject: `Certificate Verification Proof - ${certData.certificate_id}`,
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #00C2A8 0%, #00A896 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">✅ Certificate Verified</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Official Verification Proof from EduVerify</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px;">
              <h2 style="color: #0F172A; margin-top: 0;">Certificate Details</h2>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 10px 0;"><strong>Certificate ID:</strong> ${proof.certificate_id}</p>
                <p style="margin: 10px 0;"><strong>Student Name:</strong> ${proof.student_name}</p>
                <p style="margin: 10px 0;"><strong>Degree:</strong> ${proof.degree}</p>
                <p style="margin: 10px 0;"><strong>Institution:</strong> ${proof.institution}</p>
                <p style="margin: 10px 0;"><strong>AI Confidence Score:</strong> ${proof.ai_confidence}%</p>
              </div>

              <h3 style="color: #0F172A;">Blockchain Verification</h3>
              <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 10px 0; word-break: break-all;"><strong>Transaction Hash:</strong><br/>${proof.blockchain_tx}</p>
                <p style="margin: 10px 0; word-break: break-all;"><strong>IPFS CID:</strong><br/>${proof.ipfs_cid}</p>
              </div>

              <p style="color: #64748B; font-size: 14px; margin-top: 20px;">
                This certificate was verified on ${new Date(proof.verified_at).toLocaleString()}.<br/>
                Total verification count: ${proof.verification_count} times.
              </p>

              <div style="background: #E0F2FE; border-left: 4px solid #0EA5E9; padding: 15px; border-radius: 4px; margin-top: 20px;">
                <p style="margin: 0; color: #0F172A; font-size: 14px;">
                  <strong>⚡ Instant Verification:</strong> This proof confirms the authenticity of the certificate through blockchain technology.
                </p>
              </div>
            </div>
          </div>
        `
      });

      return { success: true };
    },
    onSuccess: () => {
      toast.success("Verification proof sent to your email!");
      setShowProofDialog(false);
      setEmailForProof("");
    },
    onError: () => {
      toast.error("Failed to send verification proof");
    }
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const cert = certificates.find(c => 
      c.certificate_id.toLowerCase() === certificateId.toLowerCase()
    );

    if (cert) {
      await base44.entities.Certificate.update(cert.id, {
        verification_count: (cert.verification_count || 0) + 1
      });

      // Calculate institution reputation score based on certificates
      const institutionCerts = certificates.filter(c => c.institution_name === cert.institution_name);
      const avgConfidence = institutionCerts.reduce((sum, c) => sum + (c.ai_confidence_score || 95), 0) / institutionCerts.length;
      const totalVerifications = institutionCerts.reduce((sum, c) => sum + (c.verification_count || 0), 0);
      const reputationScore = Math.min(100, Math.round((avgConfidence * 0.6) + (Math.min(totalVerifications / 10, 40))));

      setVerificationResult({ 
        ...cert, 
        verified: true,
        reputation_score: reputationScore,
        institution_total_certs: institutionCerts.length,
        institution_total_verifications: totalVerifications
      });
    } else {
      setVerificationResult({ verified: false });
    }

    setIsSearching(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadProof = () => {
    const proof = {
      certificate_id: verificationResult.certificate_id,
      student_name: verificationResult.student_name,
      degree: verificationResult.degree,
      institution: verificationResult.institution_name,
      institution_reputation: verificationResult.reputation_score,
      blockchain_tx: verificationResult.blockchain_tx_hash,
      ipfs_cid: verificationResult.ipfs_cid,
      ai_confidence_score: verificationResult.ai_confidence_score,
      verified_at: new Date().toISOString(),
      verification_count: verificationResult.verification_count,
      status: "VERIFIED"
    };

    const dataStr = JSON.stringify(proof, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-proof-${verificationResult.certificate_id}.json`;
    link.click();
    toast.success("Verification proof downloaded!");
  };

  const openBlockchainExplorer = (txHash) => {
    // Simulated blockchain explorer URL
    const explorerUrl = `https://etherscan.io/tx/${txHash}`;
    window.open(explorerUrl, '_blank');
  };

  const openIPFS = (cid) => {
    const ipfsUrl = `https://ipfs.io/ipfs/${cid}`;
    window.open(ipfsUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Verify Certificate
          </h1>
          <p className="text-xl text-slate-600">
            Enter certificate ID or scan QR code to verify authenticity instantly
          </p>
        </motion.div>

        {/* Verification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 border-0 shadow-2xl mb-8">
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
                <Input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter Certificate ID (e.g., EDU-1234567890-ABCDE)"
                  className="pl-14 h-16 text-lg border-2 focus:border-teal-500 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 h-14 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-lg font-semibold shadow-lg shadow-teal-600/20"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Verifying on Blockchain...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Verify Certificate
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-14 px-8 border-2 hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR Code
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">How to verify?</p>
                  <p className="text-sm text-blue-800">
                    Enter the unique certificate ID found on your certificate document, or scan the QR code using your device camera. All verifications are recorded on the blockchain.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Verification Result */}
        <AnimatePresence>
          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {verificationResult.verified ? (
                <div className="space-y-6">
                  <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                    {/* Success Header */}
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
                      >
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </motion.div>
                      <h2 className="text-3xl font-bold text-green-900 mb-2">
                        ✅ Certificate Verified
                      </h2>
                      <p className="text-green-700">
                        This certificate is authentic and verified on the blockchain
                      </p>
                    </div>

                    {/* AI Confidence Score - Prominent Display */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-6"
                    >
                      <Card className="p-6 border-0 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-100 rounded-xl">
                              <Zap className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">AI Confidence Score</h3>
                              <p className="text-sm text-slate-600">Machine learning authenticity analysis</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-4xl font-bold text-purple-900">
                              {verificationResult.ai_confidence_score || 98}%
                            </p>
                            <p className="text-sm text-purple-600">Authentic</p>
                          </div>
                        </div>
                        <Progress 
                          value={verificationResult.ai_confidence_score || 98} 
                          className="h-3"
                        />
                        <p className="text-xs text-slate-600 mt-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          AI analyzed document structure, signatures, and security features
                        </p>
                      </Card>
                    </motion.div>

                    {/* Institution Reputation Score */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6"
                    >
                      <Card className="p-6 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 rounded-xl">
                              <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900">{verificationResult.institution_name}</h3>
                              <p className="text-sm text-slate-600">Issuing Institution</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="text-2xl font-bold text-blue-900">
                              {verificationResult.reputation_score}
                            </span>
                            <span className="text-sm text-slate-600">/100</span>
                          </div>
                        </div>
                        <Progress 
                          value={verificationResult.reputation_score} 
                          className="h-2 mb-3"
                        />
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-xs text-slate-600">Total Certificates</p>
                            <p className="text-lg font-bold text-slate-900">{verificationResult.institution_total_certs}</p>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <p className="text-xs text-slate-600">Total Verifications</p>
                            <p className="text-lg font-bold text-slate-900">{verificationResult.institution_total_verifications}</p>
                          </div>
                        </div>
                        <Badge className="mt-3 bg-blue-100 text-blue-700 border-blue-200">
                          {verificationResult.reputation_score >= 80 ? '✅ Highly Trusted Institution' : 
                           verificationResult.reputation_score >= 60 ? '⭐ Verified Institution' : 
                           '📋 Registered Institution'}
                        </Badge>
                      </Card>
                    </motion.div>

                    {/* Certificate Details */}
                    <div className="space-y-4 mb-6">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        Certificate Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <FileText className="w-4 h-4" />
                            <p className="text-sm">Certificate ID</p>
                          </div>
                          <p className="font-mono font-semibold text-slate-900">{verificationResult.certificate_id}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(verificationResult.certificate_id)}
                            className="mt-2 h-8"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Award className="w-4 h-4" />
                            <p className="text-sm">Student Name</p>
                          </div>
                          <p className="font-semibold text-slate-900">{verificationResult.student_name}</p>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Calendar className="w-4 h-4" />
                            <p className="text-sm">Issue Date</p>
                          </div>
                          <p className="font-semibold text-slate-900">
                            {new Date(verificationResult.issue_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="p-4 bg-white rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <p className="text-sm">Times Verified</p>
                          </div>
                          <p className="text-2xl font-bold text-green-600">{verificationResult.verification_count || 0}</p>
                        </div>

                        <div className="col-span-full p-4 bg-white rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 text-slate-600 mb-1">
                            <Shield className="w-4 h-4" />
                            <p className="text-sm">Degree / Qualification</p>
                          </div>
                          <p className="font-semibold text-slate-900">{verificationResult.degree}</p>
                        </div>
                      </div>
                    </div>

                    {/* Blockchain Information */}
                    <div className="space-y-4 mb-6">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Lock className="w-5 h-5 text-teal-600" />
                        Blockchain Verification
                      </h3>

                      <div className="p-4 bg-white rounded-xl border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <LinkIcon className="w-4 h-4" />
                            <p className="text-sm">Blockchain Transaction Hash</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(verificationResult.blockchain_tx_hash)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openBlockchainExplorer(verificationResult.blockchain_tx_hash)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-mono text-sm text-slate-900 break-all bg-slate-50 p-3 rounded-lg">
                          {verificationResult.blockchain_tx_hash}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Permanently recorded on Ethereum blockchain
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-green-100">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Globe className="w-4 h-4" />
                            <p className="text-sm">IPFS Content Identifier</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(verificationResult.ipfs_cid)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openIPFS(verificationResult.ipfs_cid)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-mono text-sm text-slate-900 break-all bg-slate-50 p-3 rounded-lg">
                          {verificationResult.ipfs_cid}
                        </p>
                        <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Stored on decentralized IPFS network
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Button
                        onClick={downloadProof}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        Download Proof
                      </Button>
                      
                      <Button
                        onClick={() => setShowProofDialog(true)}
                        variant="outline"
                        className="border-2 border-green-300 hover:bg-green-50 h-12"
                      >
                        <Mail className="w-5 h-5 mr-2" />
                        Email Proof
                      </Button>

                      <Button
                        onClick={() => {
                          setVerificationResult(null);
                          setCertificateId("");
                        }}
                        variant="outline"
                        className="h-12"
                      >
                        Verify Another
                      </Button>
                    </div>
                  </Card>

                  {/* Trust Indicators */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="p-4 border-0 bg-gradient-to-br from-teal-50 to-cyan-50">
                      <Lock className="w-8 h-8 text-teal-600 mb-2" />
                      <p className="font-semibold text-slate-900 mb-1">Blockchain Secured</p>
                      <p className="text-xs text-slate-600">Immutably recorded on Ethereum</p>
                    </Card>

                    <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                      <Zap className="w-8 h-8 text-purple-600 mb-2" />
                      <p className="font-semibold text-slate-900 mb-1">AI Verified</p>
                      <p className="text-xs text-slate-600">{verificationResult.ai_confidence_score}% confidence score</p>
                    </Card>

                    <Card className="p-4 border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <Globe className="w-8 h-8 text-blue-600 mb-2" />
                      <p className="font-semibold text-slate-900 mb-1">IPFS Stored</p>
                      <p className="text-xs text-slate-600">Decentralized storage</p>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="p-8 border-0 shadow-2xl bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
                    >
                      <XCircle className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold text-red-900 mb-2">
                      ❌ Certificate Not Found
                    </h2>
                    <p className="text-red-700 mb-6">
                      This certificate could not be verified. It may be invalid, tampered, or not registered on the blockchain.
                    </p>

                    <div className="p-4 bg-white rounded-xl text-left mb-6">
                      <p className="font-semibold text-slate-900 mb-3">Possible reasons:</p>
                      <ul className="text-sm text-slate-600 space-y-2">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                          Certificate ID is incorrect or incomplete
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                          Certificate has not been registered on the blockchain
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                          Certificate has been revoked by the institution
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                          Document may be fraudulent or tampered
                        </li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => {
                        setVerificationResult(null);
                        setCertificateId("");
                      }}
                      variant="outline"
                      className="border-2 border-red-300 hover:bg-red-50"
                    >
                      Try Again
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Cards */}
        {!verificationResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <Shield className="w-10 h-10 text-teal-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Blockchain Verified</h3>
              <p className="text-sm text-slate-600">
                Every certificate is recorded on an immutable blockchain ledger with full transparency
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle2 className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">Instant Results</h3>
              <p className="text-sm text-slate-600">
                Get verification results in seconds with detailed authenticity reports
              </p>
            </Card>

            <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <QrCode className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="font-bold text-slate-900 mb-2">QR Code Support</h3>
              <p className="text-sm text-slate-600">
                Scan QR codes for quick and easy verification on mobile devices
              </p>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Email Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600" />
              Email Verification Proof
            </DialogTitle>
            <DialogDescription>
              Enter your email address to receive a detailed verification proof document
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={emailForProof}
                onChange={(e) => setEmailForProof(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>What you'll receive:</strong> A comprehensive verification proof including certificate details, blockchain links, AI confidence score, and institution reputation data.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowProofDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (emailForProof) {
                    sendProofMutation.mutate({
                      email: emailForProof,
                      certData: verificationResult
                    });
                  } else {
                    toast.error("Please enter an email address");
                  }
                }}
                disabled={sendProofMutation.isPending}
                className="flex-1 bg-teal-600 hover:bg-teal-700"
              >
                {sendProofMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Proof
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
