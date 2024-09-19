import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import Story from './Story';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default function Stories() {
  const [suggestions, setSuggestions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const users = [...Array(20)].map((_, i) => ({
      id: i,
      name: faker.name.fullName(),
      username: faker.internet.userName(),
    }));
    setSuggestions(users);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="p-6 bg-white mt-8 border-grey-200 border rounded-sm">
      {/* Flex container for horizontal scrolling */}
      <div className="scrollable-container flex space-x-4 hide-scrollbar">
        {user && suggestions.map((profile) => (
          <Story key={profile.id} username={profile.username} />
        ))}
      </div>
    </div>
  );
}




