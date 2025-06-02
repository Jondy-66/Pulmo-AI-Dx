"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { generateDiagnosisExplanation } from '@/ai/flows/diagnosis-explanation';
import type { DiagnosisResult, DiagnosisCategory } from '@/lib/types';
import { useHistory } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ImageUploader from './image-uploader';
import DiagnosisDisplay from './diagnosis-display';

export default function DiagnosisForm() {
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);
  const { addHistoryItem } = useHistory();
  const { toast } = useToast();

  const handleImageUpload = useCallback((file: File, dataUrl: string) => {
    setUploadedImageFile(file);
    setUploadedImageDataUrl(dataUrl);
    setDiagnosisResult(null); 
  }, []);

  const handleSubmit = async () => {
    if (!uploadedImageFile || !uploadedImageDataUrl) {
      toast({
        title: "Error",
        description: "Por favor, sube una imagen primero.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setDiagnosisResult(null);

    try {
      // Simulación de diagnóstico y confianza
      const mockDiagnoses: DiagnosisCategory[] = ['COVID-19', 'Viral Pneumonia', 'Normal'];
      const randomDiagnosis = mockDiagnoses[Math.floor(Math.random() * mockDiagnoses.length)];
      const mockConfidence = Math.random() * (0.98 - 0.75) + 0.75; // Confianza entre 75% y 98%

      const explanationResponse = await generateDiagnosisExplanation({
        xrayDataUri: uploadedImageDataUrl,
        diagnosis: randomDiagnosis,
      });

      const result: DiagnosisResult = {
        id: new Date().toISOString() + Math.random().toString(36).substring(2,15), // ID único
        imagePreviewUrl: uploadedImageDataUrl,
        originalImageName: uploadedImageFile.name,
        diagnosis: randomDiagnosis,
        confidence: mockConfidence,
        explanation: explanationResponse.explanation,
        timestamp: new Date().toISOString(),
      };

      setDiagnosisResult(result);
      addHistoryItem(result);
      toast({
        title: "Diagnóstico Completo",
        description: `La imagen ha sido clasificada como: ${randomDiagnosis}.`,
      });

    } catch (error) {
      console.error("Error durante el diagnóstico:", error);
      toast({
        title: "Error en el Diagnóstico",
        description: "Ocurrió un error al procesar la imagen. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      setDiagnosisResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <UploadCloud className="h-6 w-6 text-primary" />
            Clasificación de Rayos X Individual
          </CardTitle>
          <CardDescription>
            Sube una imagen de rayos X pulmonar para clasificación mediante IA.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploader 
            onImageUpload={handleImageUpload} 
            isProcessing={isLoading}
            uploadedFile={uploadedImageFile}
          />
          
          {uploadedImageDataUrl && (
            <div className="my-6 flex flex-col items-center justify-center p-4 border border-dashed rounded-md">
              <Image 
                src={uploadedImageDataUrl} 
                alt={uploadedImageFile?.name || "Vista previa de Rayos X"}
                width={200} 
                height={200}
                className="max-h-[250px] w-auto object-contain rounded-md shadow-md"
                data-ai-hint="xray medical"
              />
              {uploadedImageFile && <p className="text-sm text-muted-foreground mt-2">{uploadedImageFile.name}</p>}
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !uploadedImageDataUrl}
            className="mt-4" 
            size="default" 
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Clasificando...
              </>
            ) : (
              'Clasificar Imagen'
            )}
          </Button>
        </CardContent>
      </Card>

      {diagnosisResult && (
        <div className="w-full max-w-3xl mx-auto">
           <DiagnosisDisplay result={diagnosisResult} />
        </div>
      )}
    </div>
  );
}
