import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { StatusCard } from '@/components/StatusCard';
import { useEuclidAPI } from '@/hooks/useEuclidAPI';
import { 
  Sparkles, 
  Database, 
  Zap, 
  Globe, 
  ArrowRight, 
  Plus,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const features = [
  {
    icon: Globe,
    title: 'Intelligent Web Crawling',
    description: 'Advanced web scraping with smart content extraction and duplicate detection.'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Labeling',
    description: 'Automated weak supervision using state-of-the-art ML models.'
  },
  {
    icon: Database,
    title: 'Quality Scoring',
    description: 'Confidence and diversity metrics to ensure high-quality datasets.'
  },
  {
    icon: Zap,
    title: 'Export Ready',
    description: 'Generate production-ready datasets with comprehensive documentation.'
  },
];

export const Home: React.FC = () => {
  const [query, setQuery] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);
  const { status, runCompletePipeline } = useEuclidAPI();

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleRemoveUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleStart = async () => {
    if (!query.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    const validUrls = urls.filter(url => url.trim()).map(url => url.trim());
    await runCompletePipeline(query, validUrls.length > 0 ? validUrls : undefined);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="relative">
          <h1 className="text-6xl font-bold text-gradient leading-tight">
            Euclid Data Intelligence
          </h1>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full animate-pulse opacity-60" />
          <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-primary rounded-full animate-bounce opacity-40" />
        </div>
        
        <p className="text-xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
          Transform raw web data into premium, AI-curated datasets with intelligent 
          crawling, automated labeling, and quality scoring.
        </p>

        <div className="flex items-center justify-center space-x-4 text-sm text-foreground-subtle">
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>FastAPI Backend</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span>ML-Powered</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span>Production Ready</span>
          </span>
        </div>
      </motion.div>

      {/* Current Status */}
      {status.step !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <StatusCard status={status} />
        </motion.div>
      )}

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-8 border-card-border bg-gradient-card shadow-luxury hover:shadow-glow-primary transition-all duration-500">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Start Your Data Pipeline
              </h2>
              <p className="text-foreground-muted">
                Enter a search query and optional seed URLs to begin
              </p>
            </div>

            <div className="space-y-4">
              {/* Search Query */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Search Query *
                </label>
                <Input
                  placeholder="e.g., machine learning research papers, product reviews..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 bg-input border-input-border focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              {/* Seed URLs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    Seed URLs (Optional)
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAddUrl}
                    className="text-primary hover:text-primary-bright"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add URL
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {urls.map((url, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        className="flex-1 bg-input border-input-border focus:border-primary/50"
                      />
                      {urls.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUrl(index)}
                          className="text-foreground-muted hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <Button
                onClick={handleStart}
                variant="luxury"
                size="lg"
                className="w-full"
                disabled={status.step !== 'idle' || !query.trim()}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Pipeline
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 h-full border-card-border bg-card hover:bg-card-hover hover:shadow-card transition-all duration-300 hover-lift">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow-primary">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-foreground-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};