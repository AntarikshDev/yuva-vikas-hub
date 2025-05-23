
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { X } from 'lucide-react';

interface VideoPlayerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoTitle: string;
  videoUrl: string;
}

export const VideoPlayerDialog = ({ open, onOpenChange, videoTitle, videoUrl }: VideoPlayerDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <DialogHeader className="p-4 flex flex-row items-center justify-between">
          <DialogTitle>{videoTitle}</DialogTitle>
          <DialogClose className="h-6 w-6 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <div className="px-4 pb-4">
          <AspectRatio ratio={16 / 9} className="bg-black rounded-md overflow-hidden">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                Video Not Available
              </div>
            )}
          </AspectRatio>
        </div>
      </DialogContent>
    </Dialog>
  );
};
