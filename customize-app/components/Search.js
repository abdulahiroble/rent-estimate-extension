import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter location"
        className="border border-twitter-accent-one hover:border-twitter-accent-two focus:border-twitter-accent-three rounded py-2 px-4 mb-4 w-full text-black bg-white"
      />
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};

export default Search;

// import React, { useState } from 'react';

// const Search = ({ onSearch }) => {
//   const [query, setQuery] = useState('');

//   const handleSearch = () => {
//     onSearch(query);
//   };

//   return (
//     <div className="flex flex-col items-center w-full max-w-xs">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Enter location"
//         className="border border-gray-300 rounded py-2 px-4 mb-4 w-full"
//       />
//       <button
//         className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
//         onClick={handleSearch}
//       >
//         Search
//       </button>
//     </div>
//   );
// };

// export default Search;