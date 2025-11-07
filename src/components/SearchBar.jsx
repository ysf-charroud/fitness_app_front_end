import React from 'react';

const SearchBar = ({ searchValue, onSearchChange, onCategorySelect }) => {
  const categories = [
    'Strength Training',
    'Yoga Instructors',
    'Cardio Experts',
    'Pilates Near Me'
  ];

  return (
    <div className="bg-white py-8 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search input */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for a coach by name, specialty, or location"
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => onSearchChange(searchValue)}
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-purple-800 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => onCategorySelect(category)}
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:border-primary hover:text-primary transition-colors text-sm"
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
