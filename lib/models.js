// Database Models (using localStorage for demo)

export const UserModel = {
  institute: {
    id: String,
    name: String,
    email: String,
    role: 'institute',
    logo: String,
    address: String,
    contactInfo: String,
    verified: Boolean,
    profileComplete: Boolean,
    created_at: Date
  },
  
  student: {
    id: String,
    name: String,
    email: String,
    role: 'student',
    instituteId: String,
    registrationNumber: String,
    course: String,
    profileComplete: Boolean,
    created_at: Date
  },
  
  verifier: {
    id: String,
    name: String,
    email: String,
    role: 'verifier',
    company: String,
    designation: String,
    profileComplete: Boolean,
    created_at: Date
  }
};

export const CertificateModel = {
  id: String,
  studentId: String,
  instituteId: String,
  title: String,
  type: String, // diploma, degree, certificate
  issueDate: Date,
  expiryDate: Date,
  courseDetails: {
    name: String,
    duration: String,
    grade: String
  },
  documentUrl: String,
  qrCode: String,
  hash: String,
  status: String, // active, revoked
  created_at: Date,
  updated_at: Date
};

export const VerificationModel = {
  id: String,
  certificateId: String,
  verifierId: String,
  verificationDate: Date,
  status: String, // verified, invalid
  reportUrl: String
};

export const ShareModel = {
  id: String,
  certificateId: String,
  studentId: String,
  shareLink: String,
  expiryDate: Date,
  status: String, // active, expired, revoked
  created_at: Date
};