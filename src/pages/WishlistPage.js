import {
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useWishlist,
} from "../context/WishlistContext";

import {
  useCart,
} from "../context/CartContext";

import "../css/wishlistpage.css";

export default function WishlistPage() {

  const {
    wishlistItems,
    toggleWishlist,
  } = useWishlist();

  const {
    addToCart,
  } = useCart();

  return (
    <div className="wishlist-page">

      {/* HERO */}

      <div className="wishlist-hero">

        <h1>
          My Wishlist
        </h1>

        <p>

          {wishlistItems.length}
          {" "}
          Saved Items

        </p>

      </div>

      {/* EMPTY */}

      {wishlistItems.length === 0 ? (

        <div className="wishlist-empty">

          <Heart size={60} />

          <h2>
            Your wishlist is empty
          </h2>

          <p>
            Save products you love
            for later.
          </p>

          <Link
            to="/"
            className="wishlist-shop-btn"
          >

            Continue Shopping

          </Link>

        </div>

      ) : (

        <div className="wishlist-grid">

          {wishlistItems.map(
            (product) => (

              <div
                key={product.id}
                className="wishlist-card"
              >

                {/* IMAGE */}

                <Link
                  to={`/product/${product.slug}`}
                  className="wishlist-image-wrap"
                >

                  <img
                    src={
                      product.thumbnail
                    }
                    alt=""
                  />

                </Link>

                {/* CONTENT */}

                <div className="wishlist-content">

                  <h3>
                    {product.title}
                  </h3>

                  <p>
                    {
                      product.categoryName
                    }
                  </p>

                  {/* PRICE */}

                  <div className="wishlist-price">

                    <span className="sale-price">

                      ₹{product.price}

                    </span>

                    {product.salePrice >
                      0 && (

                      <span className="original-price">

                        ₹{
                          product.salePrice
                        }

                      </span>

                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="wishlist-actions">

                    {/* ADD TO CART */}

                    <button
                      className="wishlist-cart-btn"
                      onClick={() =>
                        addToCart(
                          product
                        )
                      }
                    >

                      <ShoppingBag
                        size={18}
                      />

                      Add To Cart

                    </button>

                    {/* REMOVE */}

                    <button
  className="wishlist-heart-btn active-heart"
  onClick={() =>
    toggleWishlist(
      product
    )
  }
>

  <Heart
    size={18}
    fill="currentColor"
  />

</button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}