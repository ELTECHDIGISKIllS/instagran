import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Post from "../components/Post";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Page({ props }) {
  const router = useRouter();
  const [username, setUsername] = useState(null);
  const [pageUserData, setPageUserData] = useState(null);
  const [hasFollowed, setHasFollowed] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [user, setUser] = useState(null);
  const [userDocID, setUserDocID] = useState(null);
  const [docID, setDocID] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageMessage, setPageMessage] = useState('loading.....');

  //handle follow and unfollow

  useEffect(() => {
    if (user) {
      onSnapshot(
        query(collection(db, "users"), where("id", "==", user.uid)),
        (snapshot) => setUserDocID(snapshot.docs[0].id)
      );
    }
  });

  useEffect(() => {
    if (docID) {
      return onSnapshot(
        collection(db, "users", docID, "followers"),
        (snapshot) => setFollowers(snapshot.docs)
      );
    }
  });

  useEffect(() => {
    if (user){
    setHasFollowed(
      followers.findIndex((follow) => follow.id === user.uid) !== -1
    );}
  }, [followers]);


  useEffect(() => {
    if (docID) {
      return onSnapshot(
        collection(db, "users", docID, "followers"),
        (snapshot) => setFollowers(snapshot.docs)
      );
    }
  }, [db, followers, docID]);

  useEffect(() => {
    if (docID) {
      return onSnapshot(
        collection(db, "users", docID, "followers"),
        (snapshot) => setFollowersCount(snapshot.docs.length)
      );
    }
  });


  useEffect(() => {
    if (docID) {
      return onSnapshot(
        collection(db, "users", docID, "following"),
        (snapshot) => setFollowingCount(snapshot.docs.length)
      );
    }
  },[db, followingCount, docID]);

  const followUser = async () => {
    setLoading(true);
    if (docID && userDocID && user) {
      if (hasFollowed) {
        await deleteDoc(
          doc(db, "users", userDocID, "following", pageUserData?.id)
        );
        await deleteDoc(doc(db, "users", docID, "followers", user.uid));
       
      } else {
        await setDoc(doc(db, "users", docID, "followers", user.uid), {
          username: user.displayName,
        });

        await setDoc(
          doc(db, "users", userDocID, "following", pageUserData?.id),
          {
            username: username,
          }
        );

      }
    }
    setLoading(false);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        
      }
    });
  });

  

  useEffect(() => {
    setUsername(router.query.user);
  });

  useEffect(() => {
    if (username) {
      onSnapshot(
        query(collection(db, "users"), where("username", "==", username)),
        (snapshot) => {
          if(snapshot.docs.length > 0){
          setPageUserData(snapshot.docs[0]?.data());
          setDocID(snapshot.docs[0]?.id);
        }else{
          setPageMessage('user does not exist');
        }
        }
      );
    }
  });

  useEffect(() => {
    if (pageUserData) {
      onSnapshot(
        query(collection(db, "posts"), where("uid", "==", pageUserData?.id)),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      );
    }
  }, [pageUserData]);

  return (
    <div>
      <Header />

      {pageUserData ? (
        <main
          className={` flex flex-col items-center md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto`}
        >
          <section className="flex flex-col items-center mt-16">
            <img
              src={pageUserData?.profileImg}
              alt=""
              className="h-32  w-32 rounded-full object-cover border p-[4px]"
            />

            {
              !loading ? ( <>
                {(username !== user?.displayName) && user ? (
                  hasFollowed ? (
                    <button
                      onClick={followUser}
                      className="bg-blue-500 text-white rounded-md w-32 px-4 py-2  mt-5"
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      onClick={followUser}
                      className="bg-blue-500 text-white rounded-md w-32 px-4 py-2  mt-5"
                    >
                      Follow
                    </button>
                  )
                ) : (
                  <></>
                )}
                </>
              ) : ( <button
                disabled
                className="bg-gray-500 text-white rounded-md w-32 px-4 py-2  mt-5"
              >
                Follow
              </button>)
            }
            

            <div className=" mt-6 font-semibold">{username}</div>

            <div className="flex justify-between w-64 mt-5">
              <p>{followingCount + " Following"} </p>
              <p>{followersCount + " Followers"} </p>
            </div>
            <div>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  id={post.id}
                  uid={post.data().uid}
                  img={post.data().image}
                  caption={post.data().captionRef}
                />
              ))}
            </div>
          </section>
        </main>
      ) : (
        <p className="ml-20 text-2xl font-semibold">{pageMessage}</p>
      )}
    </div>
  );
}
