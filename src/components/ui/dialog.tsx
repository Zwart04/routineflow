import * as React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        open ? 'block' : 'hidden'
      )}
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-card rounded-xl border border-border shadow-xl max-w-lg w-full mx-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6">{children}</div>;
};

const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <h2 className="text-lg font-semibold">
      {children}
    </h2>
  );
};

const DialogDescription = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-sm text-muted-foreground mt-1">
      {children}
    </p>
  );
};

const DialogFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
      {children}
    </div>
  );
};

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  return <>{children}</>;
};

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger };
