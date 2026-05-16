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

  const { currentUser } =
    useAuth();

  // CART

  const { cartCount } =
    useCart();

  // WISHLIST

  const {
    wishlistItems,
  } = useWishlist();

  return (
    <header className="header">

      {/* LEFT */}

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

      {/* CENTER LOGO */}

      <Link
        to="/"
        className="header-logo"
      >

        <img
          src={logo}
          alt="logo"
        />

      </Link>

      {/* RIGHT */}

      <div className="header-right">

        {/* LOGIN / ACCOUNT */}

       {currentUser ? (

  <Link
    to="/account"
    className="header-icon"
  >

    <User
      size={22}
      strokeWidth={1.8}
    />

  </Link>

) : (

  <Link
    to="/login"
    className="header-login"
  >

    Login

  </Link>

)}

        {/* WISHLIST */}

        <Link
          to="/wishlist"
          className="header-icon"
        >

          <Heart
            size={22}
            strokeWidth={1.8}
          />

          {wishlistItems.length >
            0 && (

            <span>

              {
                wishlistItems.length
              }

            </span>

          )}

        </Link>

        {/* CART */}

        <Link
          to="/cart"
          className="header-icon"
        >

          <ShoppingBag
            size={22}
            strokeWidth={1.8}
          />

          {cartCount > 0 && (

            <span>
              {cartCount}
            </span>

          )}

        </Link>

      </div>

    </header>
  );
}