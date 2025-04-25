import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../Server_API";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginUser(formData);
      if (response.token) {
        login(response.token);
        navigate("/home");
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-tr from-blue-400 to-indigo-600">
      {/* Left side with logo and tagline */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center md:justify-start">
            <img className="w-48 md:w-auto" src="Icon.png" alt="Logo" />
          </div>
        </div>

        <div className="mb-10 md:mb-20 text-center md:text-left">
          <h2 className="text-white text-2xl md:text-4xl font-bold">Join 8 Million Businesses</h2>
          <h3 className="text-yellow-300 text-xl md:text-3xl font-bold mt-2">Powering Growth with</h3>
          <h3 className="text-white text-xl md:text-3xl font-bold">Lemonpay!</h3>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Welcome Login System</h2>
          <p className="text-white mb-6 md:mb-8">Your gateway to seamless transactions and easy payments.</p>

          {error && <p className="text-red-300 mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-white mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@lemonpay.com" 
                className="w-full text-white outline-none border p-3 rounded-md" 
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Password</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 8 characters" 
                className="w-full text-white outline-none p-3 border rounded-md" 
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-white">
                  Remember me
                </label>
              </div>
              <Link to={'/sign-up'} className="text-white font-medium cursor-pointer">
                Sign Up
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded-md mt-4 cursor-pointer hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
