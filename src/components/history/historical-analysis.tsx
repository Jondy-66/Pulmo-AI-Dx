
"use client";

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useHistory } from '@/hooks/use-history';
import type { DiagnosisCategory, DiagnosisResult } from '@/lib/types';
import { BarChartHorizontal, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from "@/components/ui/chart";
import { summarizeHistory } from '@/ai/flows/summarize-history-flow';
import { useToast } from '@/hooks/use-toast';

const chartConfig = {
  Clasificaciones: {
    label: "Clasificaciones",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function HistoricalAnalysis() {
  const { history, isLoaded } = useHistory();
  const { toast } = useToast();
  const [chartData, setChartData] = useState<Array<{ name: string; Clasificaciones: number }>>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    if (isLoaded && history.length > 0) {
      const counts = history.reduce((acc, item) => {
        acc[item.diagnosis] = (acc[item.diagnosis] || 0) + 1;
        return acc;
      }, {} as Record<DiagnosisCategory, number>);

      const data = [
        { name: 'COVID-19', Clasificaciones: counts['COVID-19'] || 0 },
        { name: 'Neumonía viral', Clasificaciones: counts['Viral Pneumonia'] || 0 },
        { name: 'Normal', Clasificaciones: counts['Normal'] || 0 },
      ];
      setChartData(data);
    } else if (isLoaded && history.length === 0) {
      setChartData([]);
      setAiSummary('');
    }
  }, [history, isLoaded]);

  const handleGenerateSummary = useCallback(async () => {
    if (history.length === 0) {
      toast({
        title: "No hay datos",
        description: "No hay datos históricos para generar un resumen.",
        variant: "default",
      });
      return;
    }
    setIsLoadingSummary(true);
    setAiSummary('');
    try {
      const historyForSummary = history.map(item => ({
        diagnosis: item.diagnosis,
        timestamp: item.timestamp,
      }));
      const result = await summarizeHistory({ historyItems: historyForSummary });
      setAiSummary(result.summary);
      toast({
        title: "Resumen Generado",
        description: "El resumen de IA ha sido generado exitosamente.",
      });
    } catch (error) {
      console.error("Error generando resumen de IA:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el resumen de IA. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSummary(false);
    }
  }, [history, toast]);

  if (!isLoaded || history.length === 0) {
    return null; 
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <BarChartHorizontal className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-semibold">Análisis histórico</CardTitle>
        </div>
        <CardDescription>
          Ver tendencias y resúmenes basados en clasificaciones pasadas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <RechartsBarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }} accessibilityLayer>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  
                />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <ChartLegend content={<ChartLegendContent />} verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '20px'}} />
                <Bar
                  dataKey="Clasificaciones"
                  fill="var(--color-Clasificaciones)"
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                />
              </RechartsBarChart>
            </ChartContainer>
          </div>
        ) : (
          <p className="text-muted-foreground text-center">No hay datos suficientes para mostrar el gráfico.</p>
        )}

        <div className="space-y-2">
          <h3 className="text-md font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Resumen generado por IA:
          </h3>
          {aiSummary ? (
            <div className="bg-secondary/30 p-4 rounded-md text-sm text-foreground/90 whitespace-pre-wrap">
              {aiSummary}
            </div>
          ) : (
            !isLoadingSummary && <p className="text-sm text-muted-foreground">Haz clic en el botón para generar un resumen.</p>
          )}
           {isLoadingSummary && (
             <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-2 text-sm text-muted-foreground">Generando resumen...</p>
             </div>
           )}
          <Button onClick={handleGenerateSummary} disabled={isLoadingSummary} size="sm">
            {isLoadingSummary ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              'Generar Resumen IA'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
