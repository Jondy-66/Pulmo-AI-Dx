
"use client";

import { useHistory } from '@/hooks/use-history';
import HistoryItemCard from './history-item-card';
import HistoricalAnalysis from './historical-analysis';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function HistoryClient() {
  const { history, clearHistory, isLoaded } = useHistory();

  if (!isLoaded) {
    return (
      <div className="space-y-8">
        {/* Skeleton for HistoricalAnalysis */}
        <div className="bg-card p-6 rounded-lg shadow animate-pulse">
          <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4 mb-6"></div>
          <div className="w-full h-64 bg-muted rounded mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-10 bg-muted rounded w-1/4"></div>
        </div>
        {/* Skeleton for HistoryItemCards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-card p-4 rounded-lg shadow animate-pulse">
              <div className="w-full h-48 bg-muted rounded mb-4"></div>
              <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <HistoricalAnalysis />

      {history.length === 0 && !isLoaded && ( 
         <div className="text-center py-12">
         <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
         <h3 className="text-xl font-semibold mb-2">No hay diagnósticos en el historial.</h3>
         <p className="text-muted-foreground">Realice un nuevo análisis para verlo aquí.</p>
       </div>
      )}

      {history.length > 0 && (
        <>
          <div className="flex justify-between items-center pt-8">
            <h2 className="text-3xl font-bold font-headline">Historial de Diagnósticos</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpiar Historial
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente todo tu historial de diagnósticos.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {history.map((item) => (
              <HistoryItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
       {isLoaded && history.length === 0 && (
         <div className="text-center py-12 mt-8">
         <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
         <h3 className="text-xl font-semibold mb-2">No hay diagnósticos en el historial.</h3>
         <p className="text-muted-foreground">Realice un nuevo análisis para verlo aquí.</p>
       </div>
      )}
    </div>
  );
}
