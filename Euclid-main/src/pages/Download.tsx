import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEuclidAPI } from '@/hooks/useEuclidAPI';
import { 
  Download as DownloadIcon, 
  FileText, 
  Database, 
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const exportFormats = [
  {
    id: 'csv',
    name: 'CSV Format',
    description: 'Comma-separated values, perfect for Excel and data analysis',
    icon: FileText,
    size: '~2MB',
    compatibility: ['Excel', 'Pandas', 'R', 'Tableau']
  },
  {
    id: 'jsonl',
    name: 'JSONL Format',
    description: 'JSON Lines format, ideal for machine learning workflows',
    icon: Database,
    size: '~3MB',
    compatibility: ['Python', 'TensorFlow', 'PyTorch', 'HuggingFace']
  }
];

export const Download: React.FC = () => {
  const { status, stats, exportDataset } = useEuclidAPI();
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: 'csv' | 'jsonl') => {
    setDownloading(format);
    try {
      await exportDataset(format);
    } catch (error) {
      console.error(`Failed to download ${format}:`, error);
    } finally {
      setDownloading(null);
    }
  };

  const isDatasetReady = status.step === 'completed';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Download Dataset</h1>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Export your processed dataset in multiple formats with comprehensive documentation
        </p>
      </div>

      {/* Status Check */}
      <Card className={cn(
        "p-6 border transition-all duration-300",
        isDatasetReady 
          ? "border-success/30 bg-success/5" 
          : "border-warning/30 bg-warning/5"
      )}>
        <div className="flex items-center space-x-4">
          {isDatasetReady ? (
            <CheckCircle className="w-8 h-8 text-success" />
          ) : (
            <AlertCircle className="w-8 h-8 text-warning" />
          )}
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {isDatasetReady ? 'Dataset Ready for Export' : 'Dataset Not Ready'}
            </h3>
            <p className="text-foreground-muted">
              {isDatasetReady 
                ? 'Your dataset has been processed and is ready for download'
                : 'Complete the pipeline processing to enable downloads'
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Dataset Summary */}
      {stats && isDatasetReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-card-border bg-card">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Dataset Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-foreground-muted">Total Samples</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total_samples.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-foreground-muted">Average Confidence</p>
                <p className="text-2xl font-bold text-foreground">
                  {(stats.avg_confidence * 100).toFixed(1)}%
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-foreground-muted">Diversity Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {(stats.avg_diversity * 100).toFixed(1)}%
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-foreground-muted">Unique Labels</p>
                <p className="text-2xl font-bold text-foreground">
                  {Object.keys(stats.label_distribution).length}
                </p>
              </div>
            </div>

            {/* Label Distribution */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-foreground-muted mb-3">
                Label Distribution
              </h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.label_distribution).map(([label, count]) => (
                  <Badge key={label} variant="secondary" className="text-xs">
                    {label}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Export Formats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exportFormats.map((format, index) => (
          <motion.div
            key={format.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 border-card-border bg-card hover:bg-card-hover transition-all duration-300 hover-lift">
              <div className="space-y-4">
                {/* Format Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <format.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {format.name}
                      </h3>
                      <p className="text-sm text-foreground-muted">
                        Est. size: {format.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-foreground-muted leading-relaxed">
                  {format.description}
                </p>

                {/* Compatibility */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Compatible with:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {format.compatibility.map((tool) => (
                      <Badge key={tool} variant="outline" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <Button
                  onClick={() => handleDownload(format.id as 'csv' | 'jsonl')}
                  disabled={!isDatasetReady || downloading === format.id}
                  variant="luxury"
                  className="w-full"
                >
                  {downloading === format.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download {format.name}
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dataset Card Preview */}
      {isDatasetReady && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-card-border bg-card">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Dataset Card
              </h3>
            </div>
            
            <p className="text-foreground-muted mb-4">
              A comprehensive dataset card will be automatically generated with your download, 
              including methodology, statistics, and usage guidelines.
            </p>
            
            <div className="bg-background-subtle rounded-lg p-4 font-mono text-sm text-foreground-muted">
              <p># Euclid Generated Dataset</p>
              <p>**Created:** {new Date().toISOString()}</p>
              <p>**Samples:** {stats?.total_samples.toLocaleString()}</p>
              <p>**Quality Score:** {stats ? (stats.avg_confidence * 100).toFixed(1) : 0}%</p>
              <p>**Methodology:** Automated web crawling + ML labeling</p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};