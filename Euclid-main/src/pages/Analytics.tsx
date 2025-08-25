import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEuclidAPI } from '@/hooks/useEuclidAPI';
import {
  ChartContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from '@/components/ui/chart';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  RefreshCw,
  Activity,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Sample data for demonstration
const confidenceData = [
  { range: '0-20%', count: 12, color: '#ef4444' },
  { range: '20-40%', count: 45, color: '#f97316' },
  { range: '40-60%', count: 123, color: '#eab308' },
  { range: '60-80%', count: 234, color: '#22c55e' },
  { range: '80-100%', count: 156, color: '#10b981' },
];

const labelData = [
  { name: 'Positive', value: 342, color: '#10b981' },
  { name: 'Negative', value: 234, color: '#ef4444' },
  { name: 'Neutral', value: 456, color: '#6b7280' },
  { name: 'Mixed', value: 123, color: '#8b5cf6' },
];

const diversityTrendData = [
  { batch: 1, diversity: 65, quality: 72 },
  { batch: 2, diversity: 68, quality: 75 },
  { batch: 3, diversity: 72, quality: 78 },
  { batch: 4, diversity: 75, quality: 82 },
  { batch: 5, diversity: 78, quality: 85 },
  { batch: 6, diversity: 82, quality: 88 },
];

export const Analytics: React.FC = () => {
  const { stats, getAnalytics } = useEuclidAPI();
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await getAnalytics();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-foreground-muted mt-2">
            Comprehensive insights into your dataset quality and distribution
          </p>
        </div>
        
        <Button 
          onClick={loadAnalytics} 
          disabled={loading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-card-border bg-card hover:bg-card-hover transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-foreground-muted">Dataset Size</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats?.total_samples.toLocaleString() || '1,255'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-card-border bg-card hover:bg-card-hover transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-success" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-foreground-muted">Avg Confidence</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats ? (stats.avg_confidence * 100).toFixed(1) : '84.2'}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 border-card-border bg-card hover:bg-card-hover transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-foreground-muted">Diversity Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {stats ? (stats.avg_diversity * 100).toFixed(1) : '78.9'}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confidence Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 border-card-border bg-card">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Confidence Score Distribution
              </h3>
            </div>
            
            <ChartContainer className="h-[300px]">
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="range" 
                  stroke="hsl(var(--foreground-muted))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--foreground-muted))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>
        </motion.div>

        {/* Label Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-card-border bg-card">
            <div className="flex items-center space-x-3 mb-6">
              <PieChartIcon className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-semibold text-foreground">
                Label Distribution
              </h3>
            </div>
            
            <ChartContainer className="h-[300px]">
              <PieChart>
                <Pie
                  data={labelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {labelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ChartContainer>
          </Card>
        </motion.div>
      </div>

      {/* Quality Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6 border-card-border bg-card">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold text-foreground">
              Quality & Diversity Trends
            </h3>
          </div>
          
          <ChartContainer className="h-[400px]">
            <LineChart data={diversityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="batch" 
                stroke="hsl(var(--foreground-muted))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--foreground-muted))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="diversity" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                name="Diversity Score"
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
                name="Quality Score"
              />
            </LineChart>
          </ChartContainer>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6 border-card-border bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Key Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="text-sm font-medium text-success">High Quality Data</p>
              <p className="text-xs text-foreground-muted mt-1">
                84% of samples have confidence scores above 60%
              </p>
            </div>
            
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium text-primary">Balanced Distribution</p>
              <p className="text-xs text-foreground-muted mt-1">
                Labels are well distributed across categories
              </p>
            </div>
            
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm font-medium text-accent">Improving Trends</p>
              <p className="text-xs text-foreground-muted mt-1">
                Quality metrics show consistent improvement
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};