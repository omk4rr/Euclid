import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEuclidAPI, DatasetRow } from '@/hooks/useEuclidAPI';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  Database,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dataset: React.FC = () => {
  const { dataset, stats, getDatasetPreview } = useEuclidAPI();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DatasetRow | null>(null);
  
  const itemsPerPage = 20;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await getDatasetPreview(50, 0);
    } catch (error) {
      console.error('Failed to load dataset:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = dataset.filter(row =>
    row.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (row.label && row.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-secondary text-secondary-foreground';
    if (confidence > 0.8) return 'bg-success/20 text-success';
    if (confidence > 0.6) return 'bg-warning/20 text-warning';
    return 'bg-destructive/20 text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dataset Preview</h1>
          <p className="text-foreground-muted mt-2">
            Browse and explore your processed dataset
          </p>
        </div>
        
        <Button 
          onClick={loadData} 
          disabled={loading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 border-card-border bg-card">
            <div className="space-y-2">
              <p className="text-sm text-foreground-muted">Total Samples</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.total_samples.toLocaleString()}
              </p>
            </div>
          </Card>
          <Card className="p-4 border-card-border bg-card">
            <div className="space-y-2">
              <p className="text-sm text-foreground-muted">Avg Confidence</p>
              <p className="text-2xl font-bold text-foreground">
                {(stats.avg_confidence * 100).toFixed(1)}%
              </p>
            </div>
          </Card>
          <Card className="p-4 border-card-border bg-card">
            <div className="space-y-2">
              <p className="text-sm text-foreground-muted">Avg Diversity</p>
              <p className="text-2xl font-bold text-foreground">
                {(stats.avg_diversity * 100).toFixed(1)}%
              </p>
            </div>
          </Card>
          <Card className="p-4 border-card-border bg-card">
            <div className="space-y-2">
              <p className="text-sm text-foreground-muted">Unique Labels</p>
              <p className="text-2xl font-bold text-foreground">
                {Object.keys(stats.label_distribution).length}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="p-4 border-card-border bg-card">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              placeholder="Search dataset content or labels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input border-input-border"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Dataset Table */}
      <Card className="border-card-border bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Database className="w-8 h-8 text-foreground-muted mx-auto mb-4 animate-pulse" />
            <p className="text-foreground-muted">Loading dataset...</p>
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="bg-background-subtle">
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted">Content</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted w-32">Label</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted w-32">Confidence</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted w-32">Diversity</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border hover:bg-background-subtle/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground line-clamp-3">
                          {row.text.substring(0, 150)}
                          {row.text.length > 150 && '...'}
                        </p>
                        {row.url && (
                          <p className="text-xs text-foreground-muted">
                            Source: {new URL(row.url).hostname}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {row.label && (
                        <Badge variant="secondary" className="text-xs">
                          {row.label}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {row.confidence && (
                        <Badge className={cn("text-xs", getConfidenceColor(row.confidence))}>
                          {(row.confidence * 100).toFixed(1)}%
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {row.diversity_score && (
                        <span className="text-sm text-foreground">
                          {(row.diversity_score * 100).toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRow(row)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <Database className="w-8 h-8 text-foreground-muted mx-auto mb-4" />
            <p className="text-foreground-muted">No dataset available</p>
            <p className="text-sm text-foreground-subtle mt-2">
              Run the pipeline first to generate data
            </p>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-foreground px-3 py-1 bg-secondary rounded">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Row Detail Modal would go here */}
    </div>
  );
};