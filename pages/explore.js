import { collection, onSnapshot } from 'firebase/firestore';
import React from 'react'
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import Header from '../components/Header';

function explore() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs);
    })
  }, [db]);
  return (
    <>
    <Header/>
    <div className='grid grid-cols-3 gap-3 md:gap-6'>
      {posts.map((post) => (
        <img key={post.id} src={post.data().image} className='object-cover w-full md:h-64  lg:h-80 h-32'/>
      ))
      }
    </div>
    </>
    
  )
}

export default explore