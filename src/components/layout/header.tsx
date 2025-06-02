import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import PageContainer from './page-container';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Stethoscope className="h-8 w-8" />
            <span className="font-headline">Pulmo AI Dx</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Diagnóstico
            </Link>
            <Link href="/history" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Historial
            </Link>
          </nav>
        </div>
      </PageContainer>
    </header>
  );
}
