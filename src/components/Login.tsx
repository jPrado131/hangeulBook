import React, { useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import { Eye, EyeOff } from "@deemlol/next-icons";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  
    const handleLogin = () => {
      const currentDate = new Date();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const yearLastTwoDigits = currentDate.getFullYear() % 100;
      const expectedPassword = `pass${month}${yearLastTwoDigits}`;
  
      if (username === "user" && password === expectedPassword) {
        Cookies.set("isLoggedIn", "true", { expires: 7 });
        window.location.href = "/"; // Redirect to the home page
      } else {
        alert("Invalid credentials. Please try again.");
      }
    };
  
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };

  return (
    <div
    className="flex items-center justify-center min-h-screen bg-black text-white p-8"
    onKeyPress={handleKeyPress}
  >
        <div className="w-full max-w-md bg-transparent rounded-lg shadow-lg p-6">
            <div className="flex flex-col items-center mb-6">
                <Image
                src="/logo-white.png" // Replace with your logo path
                alt="Hangeul Book Logo"
                width={150}
                height={150}
                className="mb-4"
                />
                <h1 className="text-3xl font-bold text-center">Welcome to Hangeul Book</h1>
                <p className="text-gray-400 text-center mt-2">
                Please log in to continue your learning journey.
                </p>
            </div>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 px-4 py-2 rounded-md text-white w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="relative w-full">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 px-4 py-2 rounded-md text-white w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[10px] text-sm text-gray-500 hover:text-gray-700"
                >
                {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
            </div>
            <button
                onClick={handleLogin}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-bold hover:bg-green-500 transition"
            >
                Login
            </button>
        </div>
    </div>
    );
};

export default Login;
