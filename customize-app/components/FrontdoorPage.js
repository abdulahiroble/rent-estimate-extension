import React from 'react';
import Search from '../components/Search';

const FrontdoorPage = ({ onSelectOption }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-custom p-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-twitter-blue">Welcome to Rent Estimator</h1>
      <button
        className="bg-twitter-accent-three hover:bg-twitter-accent-five text-white font-bold py-2 px-4 rounded mb-4 w-full max-w-xs border border-twitter-accent-one shadow-lg cursor-pointer"
        onClick={() => onSelectOption('currentLocation')}
      >
        Get Rent Estimate Based on Current Location
      </button>
      <Search onSearch={(query) => onSelectOption('search', query)} />
    </div>
  );
};

export default FrontdoorPage;