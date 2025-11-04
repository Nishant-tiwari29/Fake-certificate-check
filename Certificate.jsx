import React from 'react';
import { motion } from 'framer-motion';

export default function Certificate({ 
  certificate_id,
  student_name,
  degree,
  institution_name,
  issue_date,
  certificate_hash,
  blockchain_tx_hash,
  ipfs_cid,
  qr_code_data,
  status = 'active',
  file_url,
  verification_count = 0,
  ai_confidence_score,
  metadata = {}
}) {
  return (
    <motion.div 
      className="certificate-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="certificate bg-white p-8 rounded-xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Certificate of Achievement</h1>
          <p className="text-slate-600">This is to certify that</p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gradient mb-2">{student_name}</h2>
          <p className="text-slate-600">has successfully completed the</p>
          <h3 className="text-xl font-semibold text-slate-800 mt-2">{degree}</h3>
        </div>

        <div className="text-center mb-8">
          <p className="text-slate-600">from</p>
          <h4 className="text-xl font-semibold text-slate-800 mt-2">{institution_name}</h4>
          <p className="text-slate-600 mt-4">Issued on: {new Date(issue_date).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 text-sm text-slate-600">
          <div className="verification-info p-4 rounded-lg bg-slate-50">
            <p><strong>Certificate ID:</strong> {certificate_id}</p>
            <p><strong>Certificate Hash:</strong> {certificate_hash}</p>
            <p><strong>Blockchain TX:</strong> {blockchain_tx_hash}</p>
            <p><strong>IPFS CID:</strong> {ipfs_cid}</p>
            <p><strong>Status:</strong> <span className={`capitalize ${
              status === 'active' ? 'text-green-600' :
              status === 'revoked' ? 'text-red-600' :
              'text-yellow-600'
            }`}>{status}</span></p>
            <p><strong>Verifications:</strong> {verification_count}</p>
            {ai_confidence_score && (
              <p><strong>AI Confidence:</strong> {ai_confidence_score}%</p>
            )}
          </div>
          
          <div className="qr-container flex items-center justify-center p-4 rounded-lg bg-slate-50">
            {/* QR code placeholder */}
            <div className="w-32 h-32 bg-slate-200 rounded-lg"></div>
          </div>
        </div>

        {file_url && (
          <div className="mt-6 text-center">
            <a 
              href={file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              View Original Certificate
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}