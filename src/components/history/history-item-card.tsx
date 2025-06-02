import type { DiagnosisResult, DiagnosisCategory } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, ShieldAlert, Biohazard, ShieldCheck, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface HistoryItemCardProps {
  item: DiagnosisResult;
}

const getCategorySpecifics = (category: DiagnosisCategory) => {
  switch (category) {
    case 'COVID-19':
      return { Icon: ShieldAlert, badgeVariant: 'destructive', label: 'COVID-19' };
    case 'Viral Pneumonia':
      return { Icon: Biohazard, badgeVariant: 'secondary', label: 'Neumonía Viral' }; 
    case 'Normal':
      return { Icon: ShieldCheck, badgeVariant: 'default', label: 'Normal' }; 
    default:
      return { Icon: AlertCircle, badgeVariant: 'outline', label: 'Desconocido' };
  }
};

export default function HistoryItemCard({ item }: HistoryItemCardProps) {
  const { Icon, badgeVariant, label } = getCategorySpecifics(item.diagnosis);
  const formattedDate = format(new Date(item.timestamp), "PPPp", { locale: es }); // 'es' for Spanish dates

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative w-full h-48 bg-muted">
          <Image 
            src={item.imagePreviewUrl} 
            alt={`Radiografía - ${item.diagnosis}`} 
            layout="fill" 
            objectFit="contain"
            data-ai-hint="xray medical" 
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-lg font-semibold">{label}</CardTitle>
          <Badge variant={badgeVariant as any} className="whitespace-nowrap">
            <Icon className="mr-1 h-4 w-4" />
            {item.diagnosis}
          </Badge>
        </div>
        {item.originalImageName && (
          <CardDescription className="text-xs text-muted-foreground truncate" title={item.originalImageName}>
            Archivo: {item.originalImageName}
          </CardDescription>
        )}
         {item.confidence && (
            <p className="text-xs text-muted-foreground mt-1">
              Confianza: {Math.round(item.confidence * 100)}%
            </p>
          )}
      </CardContent>
      <CardFooter className="p-4 bg-muted/50 border-t">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarDays className="mr-1.5 h-4 w-4" />
          <span>{formattedDate}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
