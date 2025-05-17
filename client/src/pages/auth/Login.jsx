import { useState } from "react";
import { Eye, EyeOff, } from "lucide-react";
import LoginImage from "../../assets/Signup/signin.png";

// Button component
const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`rounded-md px-4 py-2 font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};

// Main component
const Index = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen w-full p-[5px]">
      {/* Left Side - Get Started Section with Background Image */}
      <div 
        className="relative hidden w-[70%] bg-gradient-to-br from-blue-600 to-blue-900 lg:block"
        style={{
          backgroundImage: `url(${LoginImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "20px",
          
        }}
      >
        <div className="absolute inset-0 ">
          <div className="flex h-full flex-col justify-end p-12 text-white">
            <div className="pt-12 pb-12 display flex flex-row gap-4">
              <h1 className="text-5xl font-bold text-left pr-12">
                Get Started
                <br />
                With Us
              </h1>
              <p className="text-lg text-left">
                Complete these easy
                <br />
                steps to register your
                <br />
                account.
              </p>
            </div>

            <div className="mb-8 flex gap-6">
              {["Sign in your account", "Set up your workspace", "Set up your profile"].map((step, idx) => (
                <div
                  key={idx}
                  className={`flex h-32 w-40 flex-col items-left justify-center rounded-lg p-3 ${
                    idx === 0 ? "bg-[#1976D2]" : "bg-white/20 rounded-2xl shadow-lg backdrop-blur-sm"
                  } text-left`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      idx === 0 ? "bg-white text-blue-500" : "bg-white/50 text-white"
                    }`}
                  >
                    <span className="text-lg font-light px-2">{idx + 1}</span>
                  </div>
                  <p className="mt-4  font-light text-white">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex w-[30%] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md space-y-8 p-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign in Account</h2>
            <p className="mt-2 text-gray-600">Enter your personal data to create your account.</p>
          </div>

          {/* <Button className="relative flex w-full items-center justify-center border border-gray-300 bg-blue-500 py-6 text-white hover:bg-blue-600">
            <Mail className="mr-2 h-5 w-5" />
            <span>Sign in with Google</span>
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-gray-600">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div> */}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="eg. johnfrans@gmail.com"
                className="mt-1 h-12 w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="h-12 w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-sm text-gray-600">Must be at least 8 characters.</p>
            </div>

            <Button className="w-full bg-blue-500 py-3 text-white hover:bg-blue-600">
              Sign in
            </Button>

              <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-[#1976D2] hover:text-blue-500">
              Sign up
              </a>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;