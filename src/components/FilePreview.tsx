import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Eye, Trash2, RotateCcw, FileText } from 'lucide-react';
import MetadataViewer from './MetadataViewer';
import { extractMetadata, removeMetadata } from '@/lib/metadataUtils';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const [isCleared, setIsCleared] = useState(false);
  const [cleanedFile, setCleanedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isImage = file.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  const handleViewMetadata = async () => {
    setIsLoading(true);
    try {
      const meta = await extractMetadata(file);
      setMetadata(meta);
      setShowMetadata(true);
    } catch (error) {
      console.error('Error extracting metadata:', error);
      setMetadata({ error: 'Could not extract metadata from this file' });
      setShowMetadata(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveExif = async () => {
    setIsLoading(true);
    try {
      const cleaned = await removeMetadata(file);
      setCleanedFile(cleaned);
      setIsCleared(true);
    } catch (error) {
      console.error('Error removing metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedFile) return;
    
    const url = URL.createObjectURL(cleanedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReCheck = async () => {
    if (!cleanedFile) return;
    
    setIsLoading(true);
    try {
      const meta = await extractMetadata(cleanedFile);
      setMetadata(meta);
      setShowMetadata(true);
    } catch (error) {
      console.error('Error re-checking metadata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        {/* File preview */}
        <div className="flex items-start gap-4">
          {previewUrl ? (
            <img 
              src={previewUrl} 
              alt={file.name}
              className="w-20 h-20 object-cover rounded border border-border"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-muted rounded border border-border">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate text-foreground">{file.name}</h4>
            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Action buttons */}
        {!isCleared ? (
          <div className="flex gap-2">
            <Button 
              onClick={handleViewMetadata}
              disabled={isLoading}
              className="flex-1"
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              MetaData View
            </Button>
            <Button 
              onClick={handleRemoveExif}
              disabled={isLoading}
              className="flex-1"
            >
              Remove EXIF
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-center py-2 bg-primary/10 rounded text-primary font-medium">
              ✓ Cleared
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleDownload}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                onClick={handleReCheck}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Re-Check
              </Button>
            </div>
          </div>
        )}

        {/* Metadata viewer */}
        {showMetadata && (
          <MetadataViewer 
            metadata={metadata} 
            onClose={() => setShowMetadata(false)} 
          />
        )}
      </div>
    </Card>
  );
};

export default FilePreview;
