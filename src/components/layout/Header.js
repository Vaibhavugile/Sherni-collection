import {
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import MobileMenu from "./MobileMenu";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";

import {
  useWishlist,
} from "../../context/WishlistContext";

import "../../css/header.css";

import logo from "../../assets/images/logo.png";

export default function Header() {

  // AUTH

  const {
    currentUser,
  } = useAuth();

  // CART

  const {
    cartCount,
    setIsCartOpen,
  } = useCart();

  // WISHLIST

  const {
    wishlistItems,
  } = useWishlist();

  return (
    <header className="header">

      {/* =========================================
          LEFT
      ========================================= */}

      <div className="header-left">

        {/* MOBILE MENU */}

        <MobileMenu />

        {/* SEARCH */}

        <button className="header-search-btn">

          <Search
            size={22}
            strokeWidth={1.8}
            className="header-search"
          />

        </button>

      </div>

      {/* =========================================
          CENTER
      ========================================= */}

      <Link
        to="/"
        className="header-logo"
      >

        <img
          src={logo}
          alt="logo"
        />

      </Link>

      {/* =========================================
          RIGHT
      ========================================= */}

      <div className="header-right">

        {/* ACCOUNT */}

        {currentUser ? (

          <div className="header-account-menu">

            {/* ICON */}

            <button className="header-user-btn">

              <User
                size={22}
                strokeWidth={1.8}
              />

            </button>

            {/* DROPDOWN */}

            <div className="account-dropdown">

              {/* USER */}

              <div className="account-user-info">

                <h4>

                  {
                    currentUser?.email
                  }

                </h4>

              </div>

              {/* ORDERS */}

              <Link to="/my-orders">

                My Orders

              </Link>

              {/* WISHLIST */}

              <Link to="/wishlist">

                Wishlist

              </Link>

            </div>

          </div>

        ) : (

          <Link
            to="/login"
            className="header-login-btn"
          >

            Login

          </Link>

        )}

        {/* =========================================
            WISHLIST
        ========================================= */}

        <Link
          to="/wishlist"
          className="header-icon"
        >

          <Heart
            size={22}
            strokeWidth={1.8}
          />

          <span>

            {
              wishlistItems.length
            }

          </span>

        </Link>

        {/* =========================================
            CART
        ========================================= */}

        <button
          className="header-icon"
          onClick={() =>
            setIsCartOpen(true)
          }
        >

          <ShoppingBag
            size={22}
            strokeWidth={1.8}
          />

          <span>

            {cartCount}

          </span>

        </button>

      </div>

    </header>
  );
}