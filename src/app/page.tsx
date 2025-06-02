import Header from '@/components/layout/header';
import PageContainer from '@/components/layout/page-container';
import DiagnosisForm from '@/components/diagnosis/diagnosis-form';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <PageContainer>
          <DiagnosisForm />
        </PageContainer>
      </main>
    </div>
  );
}
