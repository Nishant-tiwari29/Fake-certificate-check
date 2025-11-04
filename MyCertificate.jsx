import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "./src/contexts/AuthContext";
import { RestrictedFeature } from "./src/components/RestrictedFeature";
import { 
  FileCheck, Eye, Download, Copy, XCircle, 
  Search, Filter, ExternalLink, CheckCircle2,
  Calendar, Building2, Award, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function MyCertificatesPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCert, setSelectedCert] = useState(null);
  const { user } = useAuth();

  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => base44.entities.Certificate.list('-created_date'),
    initialData: [],
  });

  const revokeMutation = useMutation({
    mutationFn: (id) => base44.entities.Certificate.update(id, { status: "revoked" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success("Certificate revoked successfully");
      setSelectedCert(null);
    }
  });

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.certificate_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    
    // Students can only see their own certificates
    if (user.role === 'student') {
      return matchesSearch && matchesStatus && cert.student_email === user.email;
    }
    
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Certificates</h1>
          <p className="text-slate-600">Manage all issued certificates</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <FileCheck className="w-4 h-4" />
          <span>{certificates.length} total certificates</span>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 border-0 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder={user.role === 'student' ? "Search your certificates..." : "Search by name, degree, or certificate ID..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          
          {user.role === 'institute' ? (
            <div className="flex gap-2">
              {["all", "active", "revoked", "pending"].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          ) : (
            <RestrictedFeature message="Only institutions can filter certificates">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </RestrictedFeature>
          )}
        </div>
      </Card>

      {/* Certificates Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="p-6 border-0 shadow-lg animate-pulse">
              <div className="h-32 bg-slate-200 rounded-lg" />
            </Card>
          ))}
        </div>
      ) : filteredCertificates.length > 0 ? (
        <motion.div 
          layout
          className="grid md:grid-cols-2 gap-6"
        >
          <AnimatePresence>
            {filteredCertificates.map((cert) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                        <FileCheck className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{cert.student_name}</p>
                        <p className="text-sm text-slate-500">ID: {cert.certificate_id}</p>
                      </div>
                    </div>
                    
                    <Badge className={
                      cert.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                      cert.status === 'revoked' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }>
                      {cert.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Award className="w-4 h-4" />
                      <span>{cert.degree}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <span>{cert.institution_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {user.role === 'institute' ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(cert.certificate_id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        {cert.status === 'active' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => revokeMutation.mutate(cert.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <RestrictedFeature message="Only institutions can manage certificates">
                        <Button variant="outline" size="sm">
                          <Lock className="w-4 h-4" />
                        </Button>
                      </RestrictedFeature>
                    )}
                    {cert.file_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.file_url, '_blank')}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card className="p-12 border-0 shadow-lg text-center">
          <FileCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No certificates found</p>
        </Card>
      )}

      {/* Certificate Details Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Certificate Details</DialogTitle>
          </DialogHeader>

          {selectedCert && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Student Name</p>
                  <p className="text-lg font-bold text-slate-900">{selectedCert.student_name}</p>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Degree</p>
                  <p className="font-semibold text-slate-900">{selectedCert.degree}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Institution</p>
                  <p className="font-semibold text-slate-900">{selectedCert.institution_name}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Certificate ID</p>
                  <p className="font-mono text-sm text-slate-900">{selectedCert.certificate_id}</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Issue Date</p>
                  <p className="font-semibold text-slate-900">
                    {new Date(selectedCert.issue_date).toLocaleDateString()}
                  </p>
                </div>

                <div className="col-span-2 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">Blockchain TX Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-slate-900 truncate flex-1">
                      {selectedCert.blockchain_tx_hash}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedCert.blockchain_tx_hash)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="col-span-2 p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600 mb-1">IPFS CID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm text-slate-900 truncate flex-1">
                      {selectedCert.ipfs_cid}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedCert.ipfs_cid)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <p className="text-sm text-green-600 mb-1">Verifications</p>
                  <p className="text-2xl font-bold text-green-700">{selectedCert.verification_count || 0}</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <p className="text-sm text-purple-600 mb-1">AI Confidence</p>
                  <p className="text-2xl font-bold text-purple-700">{selectedCert.ai_confidence_score || 0}%</p>
                </div>
              </div>

              {selectedCert.status === 'active' && (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => {
                    if (confirm("Are you sure you want to revoke this certificate?")) {
                      revokeMutation.mutate(selectedCert.id);
                    }
                  }}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Revoke Certificate
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}