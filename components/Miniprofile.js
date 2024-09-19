import { getAuth, signOut } from 'firebase/auth';
import React from 'react';
import { app } from '../firebase';
import { useRouter } from 'next/router';

function Miniprofile({ user }) {
  const router = useRouter();
  const auth = getAuth(app);

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg max-w-md mx-auto mt-8">
      <img
        className="rounded-full object-cover border border-gray-300 w-16 h-16"
        src={user?.photoURL}
        alt={user?.displayName}
      />
      <div className="flex-1 ml-4">
        <h2 className="text-lg font-semibold text-gray-900">{user?.displayName}</h2>
        <p className="text-sm text-gray-600">Welcome aboard Instagram!</p>
      </div>
      <button
        onClick={() => {
          signOut(auth).then(() => {
            router.push('/auth/signin');
          });
        }}
        className="text-blue-500 font-medium hover:underline"
      >
        Sign out
      </button>
    </div>
  );
}

export default Miniprofile;

