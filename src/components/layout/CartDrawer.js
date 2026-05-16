import {
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import {
  useCart,
} from "../../context/CartContext";

import "../../css/cartdrawer.css";

export default function CartDrawer() {

  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,

    increaseQuantity,
    decreaseQuantity,
    removeFromCart,

    cartTotal,
  } = useCart();

  return (
    <>

      {/* OVERLAY */}

      <div
        className={`cart-overlay ${
          isCartOpen
            ? "show-cart-overlay"
            : ""
        }`}
        onClick={() =>
          setIsCartOpen(false)
        }
      />

      {/* DRAWER */}

      <div
        className={`cart-drawer ${
          isCartOpen
            ? "show-cart-drawer"
            : ""
        }`}
      >

        {/* TOP */}

        <div className="cart-drawer-top">

          <h2>
            Shopping Bag
          </h2>

          <button
            onClick={() =>
              setIsCartOpen(false)
            }
          >

            <X size={22} />

          </button>

        </div>

        {/* ITEMS */}

        <div className="cart-drawer-items">

          {cartItems.length === 0 ? (

            <div className="cart-drawer-empty">

              Your cart is empty

            </div>

          ) : (

            cartItems.map(
              (item) => (

                <div
                  key={item.id}
                  className="drawer-item"
                >

                  {/* IMAGE */}

                  <img
                    src={
                      item.thumbnail
                    }
                    alt=""
                  />

                  {/* CONTENT */}

                  <div className="drawer-item-content">

                    {/* TITLE */}

                    <h3>
                      {item.title}
                    </h3>

                    {/* PRICE */}

                    <span className="drawer-price">

                      ₹{item.price}

                    </span>

                    {/* QUANTITY */}

                    <div className="drawer-qty">

                      {/* MINUS */}

                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id
                          )
                        }
                      >

                        <Minus
                          size={14}
                        />

                      </button>

                      {/* COUNT */}

                      <span>

                        {
                          item.quantity
                        }

                      </span>

                      {/* PLUS */}

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id
                          )
                        }
                      >

                        <Plus
                          size={14}
                        />

                      </button>

                    </div>

                  </div>

                  {/* REMOVE */}

                  <button
                    className="drawer-remove-btn"
                    onClick={() =>
                      removeFromCart(
                        item.id
                      )
                    }
                  >

                    <Trash2
                      size={16}
                    />

                  </button>

                </div>

              )
            )

          )}

        </div>

        {/* BOTTOM */}

        {cartItems.length > 0 && (

          <div className="cart-drawer-bottom">

            {/* TOTAL */}

            <div className="drawer-total">

              <span>
                Subtotal
              </span>

              <span>
                ₹{cartTotal}
              </span>

            </div>

            {/* BUTTONS */}

            <div className="drawer-buttons">

              {/* VIEW CART */}

              <Link
                to="/cart"
                className="drawer-cart-btn"
                onClick={() =>
                  setIsCartOpen(false)
                }
              >

                View Cart

              </Link>

              {/* CHECKOUT */}

             <Link
  to="/checkout"
  className="drawer-checkout-btn"
  onClick={() =>
    setIsCartOpen(false)
  }
>

  Checkout

</Link>

            </div>

          </div>

        )}

      </div>

    </>
  );
}