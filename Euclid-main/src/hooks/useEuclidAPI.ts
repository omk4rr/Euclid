import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// Types for the pipeline
export interface PipelineStatus {
  step: 'idle' | 'crawling' | 'labeling' | 'scoring' | 'exporting' | 'completed' | 'error';
  progress: number;
  message: string;
  data?: any;
  error?: string;
}

export interface DatasetRow {
  id: string;
  text: string;
  label?: string;
  confidence?: number;
  diversity_score?: number;
  url?: string;
  timestamp?: string;
}

export interface DatasetStats {
  total_samples: number;
  label_distribution: Record<string, number>;
  avg_confidence: number;
  avg_diversity: number;
}

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const useEuclidAPI = () => {
  const [status, setStatus] = useState<PipelineStatus>({
    step: 'idle',
    progress: 0,
    message: 'Ready to start'
  });

  const [dataset, setDataset] = useState<DatasetRow[]>([]);
  const [stats, setStats] = useState<DatasetStats | null>(null);

  // Generic API call wrapper
  const apiCall = useCallback(async (endpoint: string, options?: RequestInit) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  // Start the crawling process
  const startCrawl = useCallback(async (query: string, urls?: string[]) => {
    try {
      setStatus({
        step: 'crawling',
        progress: 10,
        message: 'Starting web crawl...'
      });

      const response = await apiCall('/crawl', {
        method: 'POST',
        body: JSON.stringify({ query, urls }),
      });

      setStatus({
        step: 'crawling',
        progress: 50,
        message: 'Crawling in progress...',
        data: response
      });

      return response;
    } catch (error) {
      setStatus({
        step: 'error',
        progress: 0,
        message: 'Crawling failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Crawling failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }, [apiCall]);

  // Apply labeling to the dataset
  const applyLabeling = useCallback(async () => {
    try {
      setStatus({
        step: 'labeling',
        progress: 60,
        message: 'Applying ML labeling...'
      });

      const response = await apiCall('/label', {
        method: 'POST',
      });

      setStatus({
        step: 'labeling',
        progress: 80,
        message: 'Labeling completed',
        data: response
      });

      return response;
    } catch (error) {
      setStatus({
        step: 'error',
        progress: 0,
        message: 'Labeling failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Labeling failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }, [apiCall]);

  // Score the dataset for quality
  const scoreDataset = useCallback(async () => {
    try {
      setStatus({
        step: 'scoring',
        progress: 85,
        message: 'Calculating quality scores...'
      });

      const response = await apiCall('/score', {
        method: 'POST',
      });

      setStatus({
        step: 'scoring',
        progress: 95,
        message: 'Scoring completed',
        data: response
      });

      return response;
    } catch (error) {
      setStatus({
        step: 'error',
        progress: 0,
        message: 'Scoring failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Scoring failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }, [apiCall]);

  // Export the final dataset
  const exportDataset = useCallback(async (format: 'csv' | 'jsonl' = 'csv') => {
    try {
      setStatus({
        step: 'exporting',
        progress: 98,
        message: 'Preparing export...'
      });

      const response = await fetch(`${API_BASE_URL}/export?format=${format}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `euclid_dataset.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus({
        step: 'completed',
        progress: 100,
        message: 'Dataset exported successfully!'
      });

      toast.success('Dataset exported successfully!');
      return { success: true };
    } catch (error) {
      setStatus({
        step: 'error',
        progress: 0,
        message: 'Export failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      toast.error('Export failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
      throw error;
    }
  }, []);

  // Get dataset preview
  const getDatasetPreview = useCallback(async (limit: number = 50, offset: number = 0) => {
    try {
      const response = await apiCall(`/dataset/preview?limit=${limit}&offset=${offset}`);
      setDataset(response.data || []);
      setStats(response.stats || null);
      return response;
    } catch (error) {
      toast.error('Failed to load dataset preview');
      throw error;
    }
  }, [apiCall]);

  // Get analytics data
  const getAnalytics = useCallback(async () => {
    try {
      const response = await apiCall('/analytics');
      return response;
    } catch (error) {
      toast.error('Failed to load analytics');
      throw error;
    }
  }, [apiCall]);

  // Run complete pipeline
  const runCompletePipeline = useCallback(async (query: string, urls?: string[]) => {
    try {
      await startCrawl(query, urls);
      await applyLabeling();
      await scoreDataset();
      
      setStatus({
        step: 'completed',
        progress: 100,
        message: 'Pipeline completed successfully!'
      });
      
      toast.success('Pipeline completed! Ready for export.');
    } catch (error) {
      // Error handling is done in individual steps
      console.error('Pipeline failed:', error);
    }
  }, [startCrawl, applyLabeling, scoreDataset]);

  // Reset pipeline
  const resetPipeline = useCallback(() => {
    setStatus({
      step: 'idle',
      progress: 0,
      message: 'Ready to start'
    });
    setDataset([]);
    setStats(null);
  }, []);

  return {
    // State
    status,
    dataset,
    stats,
    
    // Actions
    startCrawl,
    applyLabeling,
    scoreDataset,
    exportDataset,
    getDatasetPreview,
    getAnalytics,
    runCompletePipeline,
    resetPipeline,
  };
};