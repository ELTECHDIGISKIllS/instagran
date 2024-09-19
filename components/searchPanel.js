import { useRouter } from 'next/router';
import React, { useState } from 'react';

const SearchPanel = ({ isVisible, users, onClose }) => {
  if (!isVisible) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className='fixed inset-0 flex justify-center items-center z-50 bg-gray-900 bg-opacity-60'>
      <div className='bg-white rounded-lg shadow-lg w-full md:w-1/3 max-w-md relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-800 transition-colors duration-200'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12'></path>
          </svg>
        </button>
        <div className='p-6'>
          <h2 className='text-2xl font-semibold mb-4 border-b pb-2 border-gray-200'>Search Results</h2>
          <input
            type='text'
            value={searchQuery}
            onChange={handleSearch}
            placeholder='user/group/tags'
            className='w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <ul className='space-y-4'>
            {users
              .filter((user) =>
                user.data().username.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <li
                  key={user.id}
                  className='flex items-center p-3 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer'
                  onClick={() => router.push(`/${user.data().username}`).then(() => onClose())}
                >
                  <img
                    src={user.data().profileImg}
                    className='w-14 h-14 rounded-full border border-gray-300'
                    alt={user.data().username}
                  />
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold'>{user.data().username}</h3>
                    <p className='text-gray-500'>View Profile</p>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
