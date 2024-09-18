import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Header from "../../components/Header";
import "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const addUser = async (newUser) => {
    try {
      await addDoc(collection(db, "users"), {
        email: newUser.email,
        id: newUser.uid,
        username: newUser.displayName,
        profileImg: newUser.photoURL,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      if (!email || !password || !username) {
        setError("All fields are required");
        return;
      }

      const newUserCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = newUserCred.user;

      await updateProfile(newUser, {
        displayName: username,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/instagram-2-5d577.appspot.com/o/user_images%2FOIP%20(1).jpg?alt=media&token=2254d8cf-cf23-4255-8e25-eae5cbb8632c",
      }).then(() => {
        sessionStorage.setItem(
          "Auth Token",
          newUserCred._tokenResponse.refreshToken
        );
        addUser(newUser);
        router.push("/");
      });
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-12 px-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`w-full py-3 rounded-lg text-white focus:outline-none ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="mt-4 text-gray-600">
            Already have an account?{" "}
            <a href="/auth/signin" className="text-blue-500 hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;

