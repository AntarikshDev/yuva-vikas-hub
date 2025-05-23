
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TagsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTags: string[];
  videoTitle: string;
  onSave: (tags: string[]) => void;
}

export const TagsManagementDialog = ({ 
  open, 
  onOpenChange, 
  initialTags, 
  videoTitle,
  onSave 
}: TagsManagementDialogProps) => {
  const { toast } = useToast();
  const [tags, setTags] = useState<string[]>(initialTags || []);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave(tags);
    toast({
      title: "Tags updated",
      description: `Tags for "${videoTitle}" have been updated.`,
    });
    onOpenChange(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Manage Video Tags</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <h4 className="text-sm font-medium mb-2">Video: {videoTitle}</h4>
          
          <div className="flex items-center gap-2 mb-4">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add new tag"
              className="flex-1"
              onKeyPress={handleKeyPress}
            />
            <Button 
              type="button" 
              size="sm" 
              onClick={handleAddTag}
              disabled={!newTag}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                  {tag}
                  <button 
                    className="ml-1 hover:text-destructive" 
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No tags added yet</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Tags
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
