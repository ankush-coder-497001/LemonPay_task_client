import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../Server_API";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
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
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        email: formData.email,
        password: formData.password
      });
      if (response.status == 201) {
        navigate("/");
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-b sm:bg-gradient-to-br from-[#FBFBFD] via-[#5B6EB6] to-[#47459B]">
      {/* Left side with logo and tagline */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center md:justify-start">
            <img className=" w-auto h-[68.55px] lg:w-auto lg:h-[120px] " src="Icon.png" alt="Logo" />
          </div>
        </div>

        <div className="mb-10 md:mb-20 text-center md:text-left">
          <h2 className="text-white text-2xl md:text-4xl font-bold">Join 8 Million Businesses</h2>
          <h3 className="text-yellow-300 text-xl md:text-3xl font-bold mt-2">Powering Growth with</h3>
          <h3 className="text-white text-xl md:text-3xl font-bold">Lemonpay!</h3>
        </div>
      </div>

      {/* Right side with signup form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center">
        <div className="w-full max-w-md mx-auto">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">Welcome Sign Up System</h2>
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
                className="w-full text-white outline-none border p-3 rounded-md bg-white/30 backdrop-blur-sm" 
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
                className="w-full text-white outline-none p-3 border rounded-md bg-white/30 backdrop-blur-sm" 
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="block text-white mb-2">Confirm Password</label>
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Min 8 characters" 
                className="w-full text-white outline-none p-3 border rounded-md bg-white/30 backdrop-blur-sm" 
                required
                minLength={8}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" required />
                <label htmlFor="remember" className="text-white">
                  Accept Terms & Conditions
                </label>
              </div>
              <Link to={'/'} className="text-white font-medium cursor-pointer">
                Sign in
              </Link>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded-md mt-4 cursor-pointer hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Bottom left ellipse */}
      <div
        className="absolute bottom-0 left-0 w-72 h-72  md:w-64 md:h-64   rounded-full bg-purple-300/20 -translate-x-1/3 translate-y-1/3"
        aria-hidden="true"
      ></div>

      {/* Bottom right ellipse */}
      <div
        className="absolute md:w-[300px] md:h-[400px] h-[400px] w-[400px]  top-[350px] left-[150px]  md:top-[530px] md:left-[400px] rounded-full bg-purple-300/20 translate-x-1/3"
        aria-hidden="true"
      ></div>

      {/* Top right ellipse */}
      <div
        className="absolute w-[312px] h-[303px]   top-[-91px] left-[1341px] rounded-full bg-gray-200/20 translate-x-1/4 -translate-y-1/4"
        aria-hidden="true"
      ></div>
    </div>
    </div>
  );
}
