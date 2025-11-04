import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Generate a unique SHA-256 hash for certificates using Web Crypto API (browser-safe)
async function sha256Hex(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await (window.crypto || window.msCrypto).subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const generateCertificateHash = async (certificateData) => {
  const data = JSON.stringify(certificateData);
  return await sha256Hex(data);
};

// Generate QR code data for certificates
export const generateQRCode = (certificateId) => {
  const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
  return verificationUrl;
};

// Generate a secure sharing link (browser-safe)
export const generateShareLink = (certificateId, expiryDays = 7) => {
  const array = new Uint8Array(32);
  (window.crypto || window.msCrypto).getRandomValues(array);
  const token = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  
  return {
    shareLink: `${window.location.origin}/share/${token}`,
    expiryDate
  };
};

// Verify certificate hash (async)
export const verifyCertificateHash = async (certificate, providedHash) => {
  const calculatedHash = await generateCertificateHash(certificate);
  return calculatedHash === providedHash;
};

// Role-based access control helper
export const checkPermission = (user, action, resource) => {
  const permissions = {
    institute: {
      certificate: ['create', 'read', 'update', 'delete', 'list'],
      analytics: ['view'],
      profile: ['read', 'update']
    },
    student: {
      certificate: ['read', 'share', 'download'],
      profile: ['read', 'update']
    },
    verifier: {
      certificate: ['verify', 'download-report'],
      verification: ['create', 'list'],
      profile: ['read', 'update']
    }
  };

  return permissions[user?.role]?.[resource]?.includes(action) || false;
};