import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MetadataViewerProps {
  metadata: any;
  onClose: () => void;
}

const MetadataViewer = ({ metadata, onClose }: MetadataViewerProps) => {
  const hasGPS = metadata?.latitude && metadata?.longitude;

  const renderMetadataSection = (title: string, data: any) => {
    if (!data || Object.keys(data).length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="font-semibold text-foreground mb-2">{title}</h4>
        <div className="space-y-1 pl-2 border-l-2 border-border">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="text-sm">
              <span className="text-muted-foreground">{key}:</span>{' '}
              <span className="text-foreground">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAllMetadata = () => {
    if (metadata?.error) {
      return (
        <p className="text-muted-foreground text-center py-4">
          {metadata.error}
        </p>
      );
    }

    if (!metadata || Object.keys(metadata).length === 0) {
      return (
        <p className="text-muted-foreground text-center py-4">
          No metadata found in this file
        </p>
      );
    }

    const sections: { [key: string]: any } = {
      'Camera Info': {},
      'Image Details': {},
      'Software': {},
      'Date & Time': {},
      'Location': {},
      'Other': {}
    };

    Object.entries(metadata).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      
      if (lowerKey.includes('make') || lowerKey.includes('model') || lowerKey.includes('lens')) {
        sections['Camera Info'][key] = value;
      } else if (lowerKey.includes('width') || lowerKey.includes('height') || 
                 lowerKey.includes('resolution') || lowerKey.includes('orientation')) {
        sections['Image Details'][key] = value;
      } else if (lowerKey.includes('software') || lowerKey.includes('program')) {
        sections['Software'][key] = value;
      } else if (lowerKey.includes('date') || lowerKey.includes('time')) {
        sections['Date & Time'][key] = value;
      } else if (lowerKey.includes('gps') || lowerKey.includes('latitude') || 
                 lowerKey.includes('longitude') || lowerKey.includes('altitude')) {
        sections['Location'][key] = value;
      } else {
        sections['Other'][key] = value;
      }
    });

    return (
      <>
        {Object.entries(sections).map(([sectionName, sectionData]) => 
          renderMetadataSection(sectionName, sectionData)
        )}
      </>
    );
  };

  return (
    <Card className="border-2 border-primary/20 bg-accent/50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Metadata Information</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {hasGPS && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Location Found</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Coordinates: {metadata.latitude}, {metadata.longitude}
            </p>
            <a 
              href={`https://www.openstreetmap.org/?mlat=${metadata.latitude}&mlon=${metadata.longitude}&zoom=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View on map →
            </a>
          </div>
        )}

        <ScrollArea className="h-[300px] pr-4">
          {renderAllMetadata()}
        </ScrollArea>
      </div>
    </Card>
  );
};

export default MetadataViewer;
