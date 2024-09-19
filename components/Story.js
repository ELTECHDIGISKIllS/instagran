import React from 'react';

export default function Story({ img, username }) {
  // Extract the first letter of the username
  const initials = username.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 rounded-full flex items-center justify-center glass-effect text-white text-lg font-bold">
        {/* Display initials */}
        {initials}
      </div>
      <p className="text-xs mt-1">{username}</p>
    </div>
  );
}

