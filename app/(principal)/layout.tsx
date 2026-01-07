import Sidebar from '@/components/sidebar/sidebar';
import { UserHeader } from '@/components/header/userHeader';
import { HeaderProvider } from '@/contexts/headerContexts';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserHeader />
          {children}
        </div>
      </div>
    </HeaderProvider>
  );
}