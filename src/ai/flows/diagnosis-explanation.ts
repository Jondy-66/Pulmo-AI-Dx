'use server';

/**
 * @fileOverview Provides an explanation of why the AI classified an X-ray in a certain way.
 *
 * - generateDiagnosisExplanation - A function that generates the explanation.
 * - GenerateDiagnosisExplanationInput - The input type for the generateDiagnosisExplanation function.
 * - GenerateDiagnosisExplanationOutput - The return type for the generateDiagnosisExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDiagnosisExplanationInputSchema = z.object({
  xrayDataUri: z
    .string()
    .describe(
      "A lung X-ray image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  diagnosis: z
    .enum(['COVID-19', 'Viral Pneumonia', 'Normal'])
    .describe('The diagnosis provided by the AI.'),
});
export type GenerateDiagnosisExplanationInput = z.infer<typeof GenerateDiagnosisExplanationInputSchema>;

const GenerateDiagnosisExplanationOutputSchema = z.object({
  explanation: z.string().describe('The explanation of the AI diagnosis.'),
});
export type GenerateDiagnosisExplanationOutput = z.infer<typeof GenerateDiagnosisExplanationOutputSchema>;

export async function generateDiagnosisExplanation(
  input: GenerateDiagnosisExplanationInput
): Promise<GenerateDiagnosisExplanationOutput> {
  return generateDiagnosisExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDiagnosisExplanationPrompt',
  input: {schema: GenerateDiagnosisExplanationInputSchema},
  output: {schema: GenerateDiagnosisExplanationOutputSchema},
  prompt: `You are a medical AI assistant that explains diagnoses of lung X-rays.

  Given an X-ray image and a diagnosis, explain why the AI classified the X-ray in that way. Be concise.

X-ray Image: {{media url=xrayDataUri}}
Diagnosis: {{{diagnosis}}}
Explanation: `,
});

const generateDiagnosisExplanationFlow = ai.defineFlow(
  {
    name: 'generateDiagnosisExplanationFlow',
    inputSchema: GenerateDiagnosisExplanationInputSchema,
    outputSchema: GenerateDiagnosisExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
