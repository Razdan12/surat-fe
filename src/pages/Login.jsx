import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../middleware/Auth";
import Swal from "sweetalert2";
import getErrorMessage from "../middleware/helper";
import useAuthStore from "../hook/Auth.store";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, user } = useAuthStore();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const rest = await login(data);
      if (rest) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: getErrorMessage(error, "Login failed. Please try again."),
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="p-8 bg-white rounded-lg shadow-lg w-96">
        <div className="flex justify-center mb-6">
          <img src="/Logo.png" alt="Logo" className="w-24 h-24" />
        </div>
        <h2 className="text-lg font-bold text-center text-blue-600">
          LOGIN E-ARSIP BOJONGSARI
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <label className="block text-sm font-medium">Username</label>
            <div className="relative mt-1">
              <input
                type="text"
                {...register("email")}
                className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
                placeholder="Username"
              />
              <User
                className="absolute right-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-700 rounded hover:bg-blue-900"
          >
            LOGIN
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-gray-600">
          Lupa Password? Hubungi Admin!
        </p>
      </div>
    </div>
  );
};

export default Login;
