import { useEffect, useRef, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/router";
import { auth, db, storage } from "../firebase";
import Header from "../components/Header";
import { ref, getDownloadURL, uploadString } from "@firebase/storage";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const filePickerRef = useRef(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState("");
  const [loading, setLoading] = useState(false);

  const storeUserData = async () => {
    if (user) {
      const q = query(collection(db, "users"), where("id", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return;
      }

      const userDoc = querySnapshot.docs[0].ref;

      await updateDoc(userDoc, {
        email: email,
        username: username,
        profileImg: user.photoURL,
      });
    }
  };

  const updateImage = async () => {
    const docRef = await addDoc(collection(db, "user_images"), {
      email: email,
    });

    const imagRef = ref(storage, `user_images/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imagRef, selectedFile, "data_url").then(
        async () => {
          const downloadURL = await getDownloadURL(imagRef);
          await updateProfile(user, {
            photoURL: downloadURL,
          });
        }
      );
    }
    setSelectedFile(null);
  };

  const addImage = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      if (password) {
        await signInWithEmailAndPassword(auth, email, oldPassword).then(() => {
          updatePassword(user, password).then(() => {
            setOldPassword("");
            setPassword("");
          });
        });
      }
      await updateProfile(user, {
        displayName: username,
        email: email,
      });

      await updateImage();

      await storeUserData();
      setShowSnackbar(true);
      setSnackbarColor("green");
    } catch (error) {
      setShowSnackbar(true);
      setSnackbarColor("red");
    } finally {
      setLoading(false);
      router.push("/");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUsername(user.displayName || "");
        setEmail(user.email || "");
      } else {
        setUser(null);
        router.push("/auth/signin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen flex flex-col items-center py-8">
        <div className="bg-white shadow-lg rounded-lg max-w-lg w-full mx-4 sm:mx-0 p-6">
          <div className="flex flex-col items-center">
            <div className="relative">
              {selectedFile ? (
                <img
                  src={selectedFile}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border p-1 border-gray-300"
                />
              ) : (
                <img
                  src={user?.photoURL}
                  className="h-32 w-32 rounded-full object-cover border p-1 border-gray-300"
                  alt="Profile"
                />
              )}
              <input
                ref={filePickerRef}
                type="file"
                hidden
                onChange={addImage}
              />
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                onClick={() => filePickerRef.current.click()}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12l5 5L20 7"
                  />
                </svg>
              </button>
            </div>
            <h1 className="text-2xl font-semibold mt-4 mb-2">{username}</h1>
            <p className="text-gray-600">{email}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded py-2 px-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded py-2 px-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="oldPassword" className="block text-gray-700 mb-1">
                Old Password
              </label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full border border-gray-300 rounded py-2 px-3"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded py-2 px-3"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>

          <div
            className="flex justify-center mt-4 text-blue-500 cursor-pointer"
            onClick={() => signOut(auth)}
          >
            Sign out
          </div>
        </div>
      </div>

      {showSnackbar && (
        <div
          className={`fixed top-16 right-4 p-4 rounded-lg text-white ${
            snackbarColor === "green" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {snackbarColor === "green"
            ? "Profile updated successfully"
            : "Update failed"}
        </div>
      )}
    </>
  );
};

export default Profile;

