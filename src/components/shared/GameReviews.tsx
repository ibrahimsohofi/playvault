import type React from 'react';
import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  date: string;
}

interface GameReviewsProps {
  gameId: string;
}

export const GameReviews: React.FC<GameReviewsProps> = ({ gameId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadReviews = () => {
      const storedReviews = localStorage.getItem(`reviews_${gameId}`);
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    };

    const loadRating = () => {
      const storedRating = localStorage.getItem(`rating_${gameId}`);
      if (storedRating) {
        setRating(JSON.parse(storedRating));
      }
    };

    const loadUserReview = () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        const storedReviews = localStorage.getItem(`reviews_${gameId}`);
        if (storedReviews) {
          const reviewsList = JSON.parse(storedReviews);
          const existingReview = reviewsList.find((r: Review) => r.userEmail === userEmail);
          if (existingReview) {
            setUserReview(existingReview);
            setRating(existingReview.rating);
            setComment(existingReview.comment);
          }
        }
      }
    };

    loadReviews();
    loadRating();
    loadUserReview();
  }, [gameId]);

  const handleSubmitReview = async () => {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName') || 'Anonymous User';

    if (!userEmail || rating === 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newReview: Review = {
        id: Date.now().toString(),
        userName,
        userEmail,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString()
      };

      const storedReviews = localStorage.getItem(`reviews_${gameId}`);
      let reviewsList: Review[] = storedReviews ? JSON.parse(storedReviews) : [];

      // Remove existing review from this user
      reviewsList = reviewsList.filter(r => r.userEmail !== userEmail);

      // Add new review
      reviewsList.unshift(newReview);

      // Save to localStorage
      localStorage.setItem(`reviews_${gameId}`, JSON.stringify(reviewsList));

      setReviews(reviewsList);
      setUserReview(newReview);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (currentRating: number, interactive = false, size = 20) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`cursor-pointer transition-colors ${
              star <= currentRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Reviews</CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Review Form */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-3">
              {userReview ? 'Update Your Review' : 'Write a Review'}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                {renderStars(rating, true)}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Comment (optional)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this game..."
                  className="resize-none"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No reviews yet. Be the first to review this game!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{review.userName}</span>
                        {renderStars(review.rating, false, 16)}
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-700">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
