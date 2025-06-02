"use client";

import type { DiagnosisResult, DiagnosisCategory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Biohazard, ShieldCheck, ClipboardList } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DiagnosisDisplayProps {
  result: DiagnosisResult;
}

const getCategorySpecifics = (category: DiagnosisCategory) => {
  switch (category) {
    case 'COVID-19':
      return {
        Icon: ShieldAlert,
        badgeVariant: 'destructive',
        textColorClass: 'text-destructive', 
      };
    case 'Viral Pneumonia':
      return {
        Icon: Biohazard,
        badgeVariant: 'outline', 
        textColorClass: 'text-orange-500', 
      };
    case 'Normal':
      return {
        Icon: ShieldCheck,
        badgeVariant: 'secondary', 
        textColorClass: 'text-green-600', 
      };
    default: 
      return {
        Icon: ShieldAlert, 
        badgeVariant: 'outline',
        textColorClass: 'text-muted-foreground',
      };
  }
};

export default function DiagnosisDisplay({ result }: DiagnosisDisplayProps) {
  const { Icon, badgeVariant, textColorClass } = getCategorySpecifics(result.diagnosis);
  const confidenceValue = result.confidence ? parseFloat((result.confidence * 100).toFixed(1)) : 85.0;

  return (
    <div className="space-y-6 mt-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Resultado de Clasificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Diagnóstico:</p>
            <Badge variant={badgeVariant as any} className="px-3 py-1 text-sm">
              <Icon className={`mr-2 h-4 w-4`} />
              {result.diagnosis}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Puntuación de Confianza:</p>
            <div className="flex items-center gap-2">
              <Progress value={confidenceValue} className="w-full h-3" />
              <span className={`text-sm font-semibold ${textColorClass}`}>{confidenceValue.toFixed(1)}%</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Razonamiento de IA:</p>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{result.explanation || 'No hay explicación disponible.'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
