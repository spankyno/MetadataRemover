import { useState } from 'react';
import FileUploadZone from '@/components/FileUploadZone';
import FilePreview from '@/components/FilePreview';

const Index = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles([...files, ...newFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-foreground">MetaDataRemover</h1>
          <p className="text-muted-foreground mt-1">
            Remove EXIF and metadata from your files securely in your browser
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Upload zone */}
          <FileUploadZone onFilesSelected={handleFilesSelected} />

          {/* Files list */}
          {files.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">
                Your Files ({files.length})
              </h2>
              <div className="grid gap-4">
                {files.map((file, index) => (
                  <FilePreview
                    key={`${file.name}-${index}`}
                    file={file}
                    onRemove={() => handleRemoveFile(index)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Info section */}
          {files.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Your files are processed entirely in your browser. <br />
                Nothing is uploaded to any server.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl mb-2">🔒</div>
                  <h3 className="font-semibold text-foreground mb-1">Secure</h3>
                  <p className="text-sm text-muted-foreground">100% client-side processing</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-semibold text-foreground mb-1">Fast</h3>
                  <p className="text-sm text-muted-foreground">Instant metadata removal</p>
                </div>
                <div className="p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold text-foreground mb-1">Private</h3>
                  <p className="text-sm text-muted-foreground">Your files never leave your device</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground text-sm">
            Created by Aitor Sánchez Gutiérrez
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
