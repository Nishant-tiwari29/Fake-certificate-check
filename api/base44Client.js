// Stub implementation of base44 API client
export const base44 = {
  entities: {
    Certificate: {
      list: async (sortBy = '-created_date') => {
        // Get stored certificates from localStorage
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        return certificates.sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date));
      },
      create: async (data) => {
        // Get existing certificates
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        
        // Add new certificate
        const newCertificate = {
          id: `${certificates.length + 1}`,
          ...data,
          created_date: new Date().toISOString()
        };
        
        // Save to localStorage
        certificates.push(newCertificate);
        localStorage.setItem('certificates', JSON.stringify(certificates));
        
        return newCertificate;
      },
      update: async (id, data) => {
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const index = certificates.findIndex(cert => cert.id === id);
        
        if (index !== -1) {
          certificates[index] = { ...certificates[index], ...data };
          localStorage.setItem('certificates', JSON.stringify(certificates));
          return certificates[index];
        }
        throw new Error('Certificate not found');
      },
      get: async (id) => {
        const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
        const certificate = certificates.find(cert => cert.id === id);
        if (!certificate) throw new Error('Certificate not found');
        return certificate;
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        // Mock file upload - in a real app, this would upload to a server
        return {
          file_url: URL.createObjectURL(file)
        };
      }
    }
  }
}