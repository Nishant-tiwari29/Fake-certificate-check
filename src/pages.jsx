// These are the main page components that need to be copied to their respective files

// home.jsx
export function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome to EduVerify</h1>
      <p className="mt-4">Secure certificate verification using blockchain technology</p>
    </div>
  );
}

// dashboard.jsx
export function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Total Certificates</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Active</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Verified</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold">Pending</h3>
          <p className="text-2xl mt-2">0</p>
        </div>
      </div>
    </div>
  );
}

// MyCertificate.jsx
export function MyCertificatesPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">My Certificates</h1>
      <div className="mt-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p>No certificates found</p>
        </div>
      </div>
    </div>
  );
}

// Verify.jsx
export function VerifyPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Verify Certificate</h1>
      <div className="mt-6">
        <form className="bg-white p-6 rounded-lg shadow">
          <input 
            type="text" 
            placeholder="Enter certificate ID..." 
            className="w-full p-2 border rounded"
          />
          <button 
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}