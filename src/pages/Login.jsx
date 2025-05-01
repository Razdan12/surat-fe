import { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-gray-200 rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="Logo" className="w-24 h-24" />
        </div>
        <h2 className="text-lg font-bold text-center">LOGIN</h2>
        <div className="mt-4">
          <label className="block text-sm font-medium">Username</label>
          <div className="relative mt-1">
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              placeholder="Username"
            />
            <User className="absolute right-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium">Password</label>
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <button className="w-full px-4 py-2 mt-6 font-bold text-white bg-gray-700 rounded hover:bg-gray-900">
          LOGIN
        </button>
        <p className="mt-4 text-xs text-center text-gray-600">Lupa Password? Hubungi Admin!</p>
      </div>
    </div>
  );
};

export default Login;
