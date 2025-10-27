import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter address or city"
        className="border-2 border-rentestBorder hover:border-rentestAccent focus:border-rentestPrimary focus:outline-none rounded-lg py-3 px-4 mb-4 w-full text-rentestText bg-white transition-colors"
      />
      <button
        className="bg-rentestSuccess hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg w-full transition-colors"
        onClick={handleSearch}
      >
        🔍 Search Address
      </button>
    </div>
  );
};

export default Search;