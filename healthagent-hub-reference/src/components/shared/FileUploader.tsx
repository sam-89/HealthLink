import React, { useState, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DocumentRequirement } from '@/types';

interface FileUploaderProps {
  requirement: DocumentRequirement;
  onUpload: (file: File) => void;
  onRemove: () => void;
  className?: string;
}

export function FileUploader({ requirement, onUpload, onRemove, className }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  }, [onUpload]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }, [onUpload]);

  const statusIcon = {
    pending: <AlertCircle className="w-4 h-4 text-muted-foreground" />,
    uploaded: <File className="w-4 h-4 text-info" />,
    approved: <CheckCircle className="w-4 h-4 text-success" />,
    rejected: <AlertCircle className="w-4 h-4 text-destructive" />,
  };

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {statusIcon[requirement.status]}
          <div>
            <p className="font-medium text-sm">{requirement.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{requirement.description}</p>
            {requirement.required && (
              <span className="text-xs text-destructive mt-1 inline-block">Required</span>
            )}
          </div>
        </div>

        {requirement.file ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{requirement.file.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : null}
      </div>

      {!requirement.file && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'mx-4 mb-4 p-4 border-2 border-dashed rounded-lg transition-colors cursor-pointer',
            'flex flex-col items-center justify-center gap-2 text-center',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
          )}
        >
          <Upload className={cn('w-6 h-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          <div>
            <label className="text-sm font-medium text-primary cursor-pointer hover:underline">
              Click to upload
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
            <span className="text-sm text-muted-foreground"> or drag and drop</span>
          </div>
          <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 10MB</p>
        </div>
      )}
    </div>
  );
}