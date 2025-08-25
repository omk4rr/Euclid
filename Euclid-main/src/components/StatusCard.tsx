import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, XCircle } from 'lucide-react';
import { PipelineStatus } from '@/hooks/useEuclidAPI';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  status: PipelineStatus;
  className?: string;
}

const statusConfig = {
  idle: {
    icon: CheckCircle,
    color: 'text-foreground-muted',
    bg: 'bg-secondary',
    border: 'border-border',
    animate: false,
  },
  crawling: {
    icon: Loader2,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    animate: true,
  },
  labeling: {
    icon: Loader2,
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
    animate: true,
  },
  scoring: {
    icon: Loader2,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/20',
    animate: true,
  },
  exporting: {
    icon: Loader2,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    animate: true,
  },
  completed: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/20',
    animate: false,
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    animate: false,
  },
};

export const StatusCard: React.FC<StatusCardProps> = ({ status, className }) => {
  const config = statusConfig[status.step];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-6 rounded-xl border shadow-card hover:shadow-luxury transition-all duration-300",
        config.bg,
        config.border,
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className={cn("flex-shrink-0", config.color)}>
          <Icon 
            className={cn(
              "w-6 h-6",
              config.animate && "animate-spin"
            )} 
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground capitalize">
              {status.step === 'idle' ? 'Ready' : status.step}
            </h3>
            <span className="text-sm text-foreground-muted">
              {status.progress}%
            </span>
          </div>
          
          <p className="text-foreground-muted">{status.message}</p>
          
          {status.step !== 'idle' && status.step !== 'error' && (
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <motion.div
                className={cn("h-full bg-gradient-primary rounded-full")}
                initial={{ width: 0 }}
                animate={{ width: `${status.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          )}
          
          {status.error && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{status.error}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};