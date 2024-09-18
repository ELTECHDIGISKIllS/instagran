import { useRouter } from "next/router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowAlert(true);
      setAlertColor("green");
      router.push("/");
    } catch (error) {
      console.error(error);
      setShowAlert(true);
      setAlertColor("red");
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12 px-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <img
            className="w-40 mx-auto mb-6"
            src="https://links.papareact.com/ocw"
            alt="Instagram"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Sign In</h1>
          <p className="text-gray-600 mb-8 text-center">Access your account by entering your credentials below.</p>
          {showAlert && (
            <div
              className={`mb-4 p-3 rounded-lg text-white text-center ${
                alertColor === "green" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {alertColor === "green"
                ? "Login Successful!"
                : "Invalid credentials!"}
            </div>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="mb-6 flex justify-end">
            <a
              href="/auth/forgetpassword"
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </a>
          </div>
          {loading ? (
            <button
              disabled
              className="w-full bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
            >
              Loading...
            </button>
          ) : (
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSignIn}
            >
              Sign In
            </button>
          )}
          <p className="mt-4 text-gray-600">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignIn;

