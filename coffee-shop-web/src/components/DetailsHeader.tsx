import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DetailsHeaderProps {
  imageUrl: string;
  name: string;
}

const DetailsHeader: React.FC<DetailsHeaderProps> = ({ imageUrl, name }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-64">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-200"
      >
        <ArrowLeft size={24} color="black" />
      </button>
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
    </div>
  );
};

export default DetailsHeader;