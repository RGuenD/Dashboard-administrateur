import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ placeholder, value, onChange }) => {
    return (
        <div className="relative w-full max-w-md mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                        bg-white text-gray-900 placeholder-gray-500
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition duration-150 ease-in-out"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchBar; 