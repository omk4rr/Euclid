import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatusCard } from '@/components/StatusCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEuclidAPI } from '@/hooks/useEuclidAPI';
import { 
  Globe, 
  Brain, 
  Target, 
  Download, 
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const pipelineSteps = [
  {
    id: 'crawling',
    title: 'Web Crawling',
    description: 'Intelligent data extraction from web sources',
    icon: Globe,
  },
  {
    id: 'labeling',
    title: 'ML Labeling',
    description: 'Automated weak supervision and classification',
    icon: Brain,
  },
  {
    id: 'scoring',
    title: 'Quality Scoring',
    description: 'Confidence and diversity metrics calculation',
    icon: Target,
  },
  {
    id: 'exporting',
    title: 'Export Ready',
    description: 'Generate production-ready datasets',
    icon: Download,
  },
];

export const Pipeline: React.FC = () => {
  const { status, resetPipeline } = useEuclidAPI();

  const getStepStatus = (stepId: string) => {
    const stepIndex = pipelineSteps.findIndex(step => step.id === stepId);
    const currentStepIndex = pipelineSteps.findIndex(step => step.id === status.step);
    
    if (status.step === 'error') return 'error';
    if (status.step === 'completed') return 'completed';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pipeline Progress</h1>
          <p className="text-foreground-muted mt-2">
            Track your data processing pipeline in real-time
          </p>
        </div>
        
        {status.step !== 'idle' && (
          <Button
            variant="outline"
            onClick={resetPipeline}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Pipeline</span>
          </Button>
        )}
      </div>

      {/* Current Status */}
      <StatusCard status={status} />

      {/* Pipeline Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {pipelineSteps.map((step, index) => {
          const stepStatus = getStepStatus(step.id);
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={cn(
                  "p-6 border transition-all duration-300",
                  stepStatus === 'completed' && "border-success/30 bg-success/5",
                  stepStatus === 'active' && "border-primary/30 bg-primary/5 shadow-glow-primary",
                  stepStatus === 'error' && "border-destructive/30 bg-destructive/5",
                  stepStatus === 'pending' && "border-border bg-card"
                )}
              >
                <div className="space-y-4">
                  {/* Step Icon and Status */}
                  <div className="flex items-center justify-between">
                    <div 
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        stepStatus === 'completed' && "bg-success/20 text-success",
                        stepStatus === 'active' && "bg-primary/20 text-primary",
                        stepStatus === 'error' && "bg-destructive/20 text-destructive",
                        stepStatus === 'pending' && "bg-secondary text-foreground-muted"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div>
                      {stepStatus === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      {stepStatus === 'active' && (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                      {stepStatus === 'error' && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>

                  {/* Step Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-foreground-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  {stepStatus === 'active' && (
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${status.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      {status.data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-card-border bg-card">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Processing Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-foreground-muted">Stage</span>
                <p className="font-medium text-foreground capitalize">{status.step}</p>
              </div>
              <div className="space-y-1">
                <span className="text-foreground-muted">Progress</span>
                <p className="font-medium text-foreground">{status.progress}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-foreground-muted">Status</span>
                <p className="font-medium text-foreground">{status.message}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};