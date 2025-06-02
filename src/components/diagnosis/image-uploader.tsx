"use client";

import type React from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
  isProcessing: boolean;
  uploadedFile: File | null;
}

export default function ImageUploader({ onImageUpload, isProcessing, uploadedFile }: ImageUploaderProps) {
  const { toast } = useToast();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({ title: "Error", description: "El archivo es demasiado grande. Límite 5MB.", variant: "destructive" });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast({ title: "Error", description: "Tipo de archivo no admitido. Sube JPG, PNG o WEBP.", variant: "destructive" });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        onImageUpload(file, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload, toast]);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center space-x-2">
        <Button asChild variant="outline" className="shrink-0">
          <label htmlFor="xray-image-upload" className={`cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}>
            Examinar...
          </label>
        </Button>
        <Input
          id="xray-image-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          disabled={isProcessing}
        />
        <Input
            type="text"
            value={uploadedFile ? uploadedFile.name : "Ningún archivo seleccionado"}
            readOnly
            className="bg-muted border-muted text-muted-foreground flex-grow"
            disabled={isProcessing}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Tamaño máximo de archivo: 5MB. Tipos permitidos: JPG, PNG, WEBP.
      </p>
    </div>
  );
}
