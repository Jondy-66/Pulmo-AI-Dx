"use client";

import type { DiagnosisResult } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';

const HISTORY_STORAGE_KEY = 'pulmoAIDxHistory';

export function useHistory() {
  const [history, setHistory] = useState<DiagnosisResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Error loading history from localStorage:", error);
        setHistory([]);
      } finally {
        setIsLoaded(true);
      }
    }
  }, []);

  const saveHistory = useCallback((updatedHistory: DiagnosisResult[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } catch (error) {
        console.error("Error saving history to localStorage:", error);
      }
    }
  }, []);

  const addHistoryItem = useCallback((item: DiagnosisResult) => {
    const updatedHistory = [item, ...history].slice(0, 50); // Keep last 50 items
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
  }, [saveHistory]);

  return { history, addHistoryItem, clearHistory, isLoaded };
}
