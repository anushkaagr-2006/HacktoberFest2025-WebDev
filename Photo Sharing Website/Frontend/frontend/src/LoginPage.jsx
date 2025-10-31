import { useState } from "react";
import {getDatabase,ref,set,update,get} from "firebase/database";
import {GoogleAuthProvider,signInWithPopup,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail,signOut,} from "firebase/auth";
import { auth, app } from "./firebase";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const db = getDatabase(app);
  const provider = new GoogleAuthProvider();

  const updateUserData = async (user) => {
    const refPath = ref(db, "users/" + user.uid);
    const snap = await get(refPath);
    if (snap.exists()) {
      await update(refPath, { lastLogin: new Date().toISOString() });
    } else {
      await set(refPath, {
        email: user.email,
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(res.user);
      alert("Check your email for verification.");
      await signOut(auth);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      if (!res.user.emailVerified) {
        alert("Please verify your email first.");
        await signOut(auth);
        return;
      }
      await updateUserData(res.user);
      onLogin(res.user);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      await updateUserData(res.user);
      onLogin(res.user);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReset = async () => {
    if (!email) return alert("Enter your email first.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm space-y-5">
        <h2 className="text-2xl font-semibold text-center">
          {isSignup ? "Create Account" : "Login"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-2 top-2 text-gray-500"
          >
            {showPass ? <EyeOff /> : <Eye />}
          </button>
        </div>

        {!isSignup && (
          <button
            onClick={handleReset}
            className="text-xs text-gray-600 hover:underline"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={isSignup ? handleSignup : handleLogin}
          disabled={loading}
          className="w-full py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Sign In"}
        </button>

        <button
          onClick={handleGoogle}
          className="w-full py-2 border rounded hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
