import Sidebar from '@/components/sidebar/sidebar';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        
      </div>
    </div>
  );
}