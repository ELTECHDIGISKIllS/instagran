import React from "react";
import Stories from "./Stories";
import Posts from "./Posts";
import Miniprofile from "./Miniprofile";
import { Suggestions } from "./Suggestions";
import { app } from "../firebase";
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";



export default function Feed() {
 const auth = getAuth(app);
const [user , setUser] = useState(null);
const router = useRouter();
const handleSignOut = () => {
  signOut(auth);
}
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      router.push("/")
    }else{
    
    }
  });

  return () => {
    unsubscribe();
  }
}, []);
  
  return (
    <div>
      <main className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${!user && "!grid-cols-1 !max-w-3xl"}`}>
      
        <section className="col-span-2">
          
          <Stories/>
        <Posts />
        </section>

        {/* Section */}
        <section className="hidden xl:inline-grid md:col-span-1">
          { user && (
             <div className="fixed top-20">
             <Miniprofile user={user}/>
             <Suggestions user={user}/>
             </div>
          )}
         
          
        </section>
      </main>
    </div>
  );
}
