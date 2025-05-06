import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchAreaProps {
  onSearchQueryChange: (query: string) => void;
  onReset: () => void;
  searchQuery: string;
}

const SearchArea: React.FC<SearchAreaProps> = ({ onSearchQueryChange, onReset, searchQuery }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchQueryChange(searchText);
  };

  const handleClear = () => {
    setSearchText('');
    onReset();
  };

  const showClearButton = searchText.length > 0 || searchQuery.length > 0;

  return (
    <div className="w-full h-60 flex justify-center bg-gray-900 pb-6">
      <div className="w-[90%] pt-8">
        <p className="text-gray-400 text-sm">Location</p>
        <p className="text-white text-base">Kathmandu, Nepal</p>
        <div className="flex justify-between mt-5">
          <div className="relative w-[100%] h-14 bg-gray-800 rounded-2xl flex items-center px-4">
            <Search size={24} color="white" />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
              placeholder="Search products..."
              className="bg-transparent text-white flex-1 ml-2 mr-8 outline-none placeholder-gray-400"
            />
            {showClearButton && (
              <button
                onClick={handleClear}
                className="absolute right-4 flex items-center justify-center cursor-pointer"
              >
                <X size={24} color="white" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchArea;