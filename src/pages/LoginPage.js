import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  loginUser,
  signupUser,
  loginWithGoogle,
} from "../firebase/auth";

import "../css/loginpage.css";

export default function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [isSignup, setIsSignup] =
    useState(false);

  // SUBMIT

  async function handleSubmit() {

    if (!email || !password) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      if (isSignup) {

        await signupUser(
          email,
          password
        );

        alert(
          "Account Created"
        );

      } else {

        await loginUser(
          email,
          password
        );

        alert(
          "Logged In"
        );
      }

    } catch (error) {

      console.log(error);

      alert(error.message);

    } finally {

      setLoading(false);

    }
  }

  // GOOGLE

  async function handleGoogle() {

    try {

      await loginWithGoogle();

      alert(
        "Google Login Success"
      );

    } catch (error) {

      console.log(error);
    }
  }

  return (
    <div className="login-page">

      {/* LEFT */}

      <div className="login-left">

        <div className="login-overlay">

          <h1>
            Luxury Fashion
          </h1>

          <p>
            Discover premium ethnic
            collections crafted for
            timeless elegance.
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="login-right">

        <div className="login-box">

          {/* TOP */}

          <div className="login-top">

            <h2>

              {isSignup
                ? "Create Account"
                : "Welcome Back"}

            </h2>

            <p>

              {isSignup
                ? "Join our luxury fashion experience"
                : "Login to continue shopping"}

            </p>

          </div>

          {/* FORM */}

          <div className="login-form">

            {/* EMAIL */}

            <div className="login-input">

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

            </div>

            {/* PASSWORD */}

            <div className="login-input">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

            {/* SUBMIT */}

            <button
              className="login-submit"
              onClick={handleSubmit}
            >

              {loading
                ? "Please wait..."
                : isSignup
                ? "Create Account"
                : "Login"}

            </button>

            {/* DIVIDER */}

            <div className="login-divider">

              <span>
                OR
              </span>

            </div>

            {/* GOOGLE */}

            <button
              className="google-btn"
              onClick={handleGoogle}
            >

              Continue With Google

            </button>

            {/* SWITCH */}

            <p
              className="login-switch"
              onClick={() =>
                setIsSignup(
                  !isSignup
                )
              }
            >

              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Create Account"}

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}