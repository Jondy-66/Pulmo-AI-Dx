
'use server';
/**
 * @fileOverview Generates a summary of historical diagnosis data.
 *
 * - summarizeHistory - A function that generates the summary.
 * - SummarizeHistoryInput - The input type for the summarizeHistory function.
 * - SummarizeHistoryOutput - The return type for the summarizeHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DiagnosisCategory } from '@/lib/types'; // Ensure DiagnosisCategory is imported

const DiagnosisCategoryEnum = z.enum(['COVID-19', 'Viral Pneumonia', 'Normal']);

const SummarizeHistoryInputSchema = z.object({
  historyItems: z.array(z.object({
    diagnosis: DiagnosisCategoryEnum.describe('The diagnosis category.'),
    timestamp: z.string().describe('The ISO 8601 timestamp of the diagnosis.'),
  })).describe('An array of historical diagnosis records.'),
});
export type SummarizeHistoryInput = z.infer<typeof SummarizeHistoryInputSchema>;

const SummarizeHistoryOutputSchema = z.object({
  summary: z.string().describe('A textual summary of historical diagnosis trends, including dates and counts if relevant.'),
});
export type SummarizeHistoryOutput = z.infer<typeof SummarizeHistoryOutputSchema>;

export async function summarizeHistory(input: SummarizeHistoryInput): Promise<SummarizeHistoryOutput> {
  return summarizeHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeHistoryPrompt',
  input: {schema: SummarizeHistoryInputSchema},
  output: {schema: SummarizeHistoryOutputSchema},
  prompt: `Eres un asistente médico de IA encargado de resumir datos históricos de diagnóstico.
Analiza la lista proporcionada de diagnósticos y sus marcas de tiempo para identificar tendencias, diagnósticos comunes y cualquier patrón notable.
Proporciona un resumen conciso en español. Menciona fechas o rangos de fechas si son relevantes para las tendencias.
Formatea las fechas como YYYY-MM-DD y las horas como HH:MM.
Calcula y menciona el número total de casos para cada categoría de diagnóstico.
Indica cuál fue el diagnóstico más prevalente y el menos prevalente.
Si hay pocos datos (por ejemplo, menos de 5 entradas), menciónalo.

Datos Históricos:
{{#each historyItems}}
- Diagnóstico: {{{this.diagnosis}}}, Fecha y Hora: {{{this.timestamp}}}
{{/each}}

Considera los siguientes puntos para tu resumen:
1. Prevalencia de cada diagnóstico (COVID-19, Neumonía Viral, Normal).
2. Cualquier tendencia temporal observada (por ejemplo, aumento de casos de COVID-19 en una semana específica).
3. El diagnóstico más común y el menos común.
4. Número total de diagnósticos analizados.

Resumen:`,
});

const summarizeHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeHistoryFlow',
    inputSchema: SummarizeHistoryInputSchema,
    outputSchema: SummarizeHistoryOutputSchema,
  },
  async (input: SummarizeHistoryInput) => {
    if (input.historyItems.length === 0) {
      return { summary: "No hay datos históricos disponibles para generar un resumen." };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
