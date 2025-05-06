import React from 'react';
import { Star } from 'lucide-react';

interface DescriptionSectionProps {
  description: string;
  rating: number;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ description, rating }) => {
  const renderStars = (ratingValue: number | undefined) => {
    // Fallback to 0 if rating is undefined or invalid
    const safeRating = typeof ratingValue === 'number' && !isNaN(ratingValue) && ratingValue >= 0 ? ratingValue : 0;
    console.log('DescriptionSection - Rendering stars for rating:', safeRating); // Debug log

    try {
      const fullStars = Math.floor(safeRating);
      const hasHalfStar = safeRating % 1 >= 0.5;
      const totalStars = 5;
      const stars = [];

      // Add full stars
      for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} size={16} fill="#FFD700" stroke="#FFD700" />);
      }

      // Add half star if applicable
      if (hasHalfStar && stars.length < totalStars) {
        stars.push(<Star key="half" size={16} fill="#FFD700" stroke="#FFD700" className="opacity-50" />);
      }

      // Add empty stars to fill up to 5
      while (stars.length < totalStars) {
        stars.push(<Star key={`empty-${stars.length}`} size={16} fill="none" stroke="#FFD700" />);
      }

      return (
        <div className="flex items-center">
          {stars}
          <span className="ml-2 text-gray-600">{safeRating.toFixed(1)}/5</span>
        </div>
      );
    } catch (err) {
      console.error('Error rendering stars in DescriptionSection:', err);
      return <span className="text-gray-600">{safeRating.toFixed(1)}/5 (Error rendering stars)</span>;
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-gray-800 font-semibold">Description</h2>
      <p className="text-gray-600 mt-1">{description || 'No description available.'}</p>
      <div className="mt-4">
        <h2 className="text-gray-800 font-semibold">Rating:</h2>
        {renderStars(rating)}
      </div>
    </div>
  );
};

export default DescriptionSection;