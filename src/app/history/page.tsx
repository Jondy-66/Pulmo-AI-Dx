import Header from '@/components/layout/header';
import PageContainer from '@/components/layout/page-container';
import HistoryClient from '@/components/history/history-client';

export default function HistoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <PageContainer>
          <HistoryClient />
        </PageContainer>
      </main>
    </div>
  );
}
