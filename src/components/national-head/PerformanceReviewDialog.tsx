import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PerformanceReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeName: string;
}

const ratingLabels = [
  { label: 'Not Satisfactory', color: 'from-red-500 to-red-600', textColor: 'text-red-500' },
  { label: 'Need Improvement', color: 'from-orange-500 to-orange-600', textColor: 'text-orange-500' },
  { label: 'Average', color: 'from-yellow-500 to-yellow-600', textColor: 'text-yellow-500' },
  { label: 'Good', color: 'from-lime-500 to-green-500', textColor: 'text-lime-500' },
  { label: 'Excellent', color: 'from-amber-400 to-yellow-300', textColor: 'text-amber-400' },
];

export const PerformanceReviewDialog: React.FC<PerformanceReviewDialogProps> = ({
  open,
  onOpenChange,
  employeeName,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentRating = hoveredRating || rating;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please select a star rating before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Review Submitted',
      description: `Performance review for ${employeeName} has been submitted. Notification sent to mobile app.`,
    });
    
    setIsSubmitting(false);
    setRating(0);
    setComment('');
    onOpenChange(false);
  };

  const getStarColor = (index: number) => {
    if (index < currentRating) {
      // Color gradient from red (1 star) to golden (5 stars)
      const colors = [
        'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]',
        'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
        'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]',
        'text-lime-500 drop-shadow-[0_0_8px_rgba(132,204,22,0.8)]',
        'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,1)]',
      ];
      return colors[currentRating - 1] || 'text-muted';
    }
    return 'text-muted-foreground/30';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">Performance Review</DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            Rate {employeeName}'s performance
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="transition-all duration-200 hover:scale-125 focus:outline-none"
                  onMouseEnter={() => setHoveredRating(index)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(index)}
                >
                  <Star
                    className={`h-10 w-10 transition-all duration-300 ${getStarColor(index)} ${
                      index <= currentRating ? 'fill-current' : ''
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Rating Label */}
            <div className="h-8 flex items-center justify-center">
              {currentRating > 0 && (
                <div
                  className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${ratingLabels[currentRating - 1].color} text-white text-sm font-medium shadow-lg animate-in fade-in-0 zoom-in-95 duration-200`}
                >
                  {ratingLabels[currentRating - 1].label}
                </div>
              )}
              {currentRating === 0 && (
                <span className="text-sm text-muted-foreground">Select a rating</span>
              )}
            </div>
          </div>

          {/* Comment Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Feedback Comment</label>
            <Textarea
              placeholder="Enter your feedback for the mobiliser..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
