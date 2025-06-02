export type DiagnosisCategory = 'COVID-19' | 'Viral Pneumonia' | 'Normal';

export interface DiagnosisResult {
  id: string;
  imagePreviewUrl: string; 
  originalImageName?: string;
  diagnosis: DiagnosisCategory;
  confidence?: number; 
  explanation: string;
  timestamp: string; 
}
