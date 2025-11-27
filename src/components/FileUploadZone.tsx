import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
}

const FileUploadZone = ({ onFilesSelected }: FileUploadZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesSelected,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${isDragActive 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'
        }
      `}
    >
      <input {...getInputProps()} />
      <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-xl font-semibold mb-2 text-foreground">
        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
      </h3>
      <p className="text-muted-foreground">
        or click to select files
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Supported: JPG, PNG, WEBP, PDF, DOCX, XLSX
      </p>
    </div>
  );
};

export default FileUploadZone;
