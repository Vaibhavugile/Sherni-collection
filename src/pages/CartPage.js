import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../context/CartContext";

import "../css/cartpage.css";

export default function CartPage() {

  const {
    cartItems,
    removeFromCart,
    addToCart,
  } = useCart();

  // TOTAL

  const subtotal =
    cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  return (
    <div className="cart-page">

      {/* HERO */}

      <div className="cart-hero">

        <h1>
          Shopping Bag
        </h1>

        <p>

          {cartItems.length}
          {" "}
          Items

        </p>

      </div>

      {/* EMPTY */}

      {cartItems.length === 0 ? (

        <div className="cart-empty">

          <ShoppingBag size={60} />

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add products to start
            shopping.
          </p>

          <Link
            to="/"
            className="cart-shop-btn"
          >

            Continue Shopping

          </Link>

        </div>

      ) : (

        <div className="cart-container">

          {/* LEFT */}

          <div className="cart-items">

            {cartItems.map(
              (product) => (

                <div
                  key={product.id}
                  className="cart-card"
                >

                  {/* IMAGE */}

                  <Link
                    to={`/product/${product.slug}`}
                    className="cart-image-wrap"
                  >

                    <img
                      src={
                        product.thumbnail
                      }
                      alt=""
                    />

                  </Link>

                  {/* CONTENT */}

                  <div className="cart-content">

                    <h3>
                      {product.title}
                    </h3>

                    <p>
                      {
                        product.categoryName
                      }
                    </p>

                    {/* PRICE */}

                    <div className="cart-price">

                      ₹{product.price}

                    </div>

                    {/* QUANTITY */}

                    <div className="cart-quantity">

                      <button>

                        <Minus
                          size={16}
                        />

                      </button>

                      <span>

                        {
                          product.quantity
                        }

                      </span>

                      <button
                        onClick={() =>
                          addToCart(
                            product
                          )
                        }
                      >

                        <Plus
                          size={16}
                        />

                      </button>

                    </div>

                  </div>

                  {/* REMOVE */}

                  <button
                    className="cart-remove-btn"
                    onClick={() =>
                      removeFromCart(
                        product.id
                      )
                    }
                  >

                    <Trash2
                      size={18}
                    />

                  </button>

                </div>

              )
            )}

          </div>

          {/* RIGHT */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            {/* ROW */}

            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{subtotal}
              </span>

            </div>

            <div className="summary-row">

              <span>
                Shipping
              </span>

              <span>
                FREE
              </span>

            </div>

            <div className="summary-row total-row">

              <span>
                Total
              </span>

              <span>
                ₹{subtotal}
              </span>

            </div>

            {/* BUTTON */}

          <Link
  to="/checkout"
  className="checkout-btn"
>

  Proceed To Checkout

</Link>

          </div>

        </div>

      )}

    </div>
  );
}