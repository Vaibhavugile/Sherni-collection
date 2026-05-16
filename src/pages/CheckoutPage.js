import {
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";

import {
  useCart,
} from "../context/CartContext";

import "../css/checkoutpage.css";
import {
  Link,
} from "react-router-dom";
export default function CheckoutPage() {

  const {
    cartItems,
    cartTotal,
  } = useCart();

  // SHIPPING

  const shipping =
    cartTotal > 499
      ? 0
      : 99;

  // FINAL TOTAL

  const finalTotal =
    cartTotal + shipping;

  return (
    <div className="checkout-page">

      {/* LEFT */}

      <div className="checkout-left">

        {/* TITLE */}

        <div className="checkout-title">

          <h1>
            Checkout
          </h1>

          <p>
            Secure luxury checkout
            experience
          </p>

        </div>

        {/* ADDRESS */}

        <div className="checkout-card">

          <h2>
            Shipping Address
          </h2>

          <div className="checkout-form-grid">

            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="tel"
              placeholder="Phone Number"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <input
              type="text"
              placeholder="Pincode"
            />

            <textarea
              placeholder="Full Address"
            />

            <input
              type="text"
              placeholder="City"
            />

            <input
              type="text"
              placeholder="State"
            />

          </div>

        </div>

        {/* PAYMENT */}

        <div className="checkout-card">

          <h2>
            Payment Method
          </h2>

          <div className="payment-options">

            {/* ONLINE */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
                defaultChecked
              />

              <div>

                <CreditCard
                  size={20}
                />

                <span>
                  Online Payment
                </span>

              </div>

            </label>

            {/* COD */}

            <label className="payment-option">

              <input
                type="radio"
                name="payment"
              />

              <div>

                <Truck
                  size={20}
                />

                <span>
                  Cash On Delivery
                </span>

              </div>

            </label>

          </div>

        </div>

        {/* SECURITY */}

        <div className="checkout-security">

          <ShieldCheck
            size={18}
          />

          100% Secure Payments &
          Protected Checkout

        </div>

      </div>

      {/* RIGHT */}

      <div className="checkout-right">

        <div className="checkout-summary">

          {/* TITLE */}

          <h2>
            Order Summary
          </h2>

          {/* ITEMS */}

          <div className="checkout-items">

            {cartItems.map(
              (item) => (

                <div
                  key={item.id}
                  className="checkout-item"
                >

                  {/* IMAGE */}

                  <img
                    src={
                      item.thumbnail
                    }
                    alt=""
                  />

                  {/* CONTENT */}

                  <div className="checkout-item-content">

                    <h3>
                      {item.title}
                    </h3>

                    <p>

                      Qty:
                      {" "}
                      {
                        item.quantity
                      }

                    </p>

                    {/* VARIANT */}

                    {item.selectedSize && (

                      <span>

                        {
                          item.selectedSize
                        }

                        {" • "}

                        {
                          item.selectedColor
                        }

                      </span>

                    )}

                  </div>

                  {/* PRICE */}

                  <strong>

                    ₹
                    {
                      item.price *
                      item.quantity
                    }

                  </strong>

                </div>

              )
            )}

          </div>

          {/* COUPON */}

          <div className="checkout-coupon">

            <input
              type="text"
              placeholder="Coupon Code"
            />

            <button>
              Apply
            </button>

          </div>

          {/* TOTALS */}

          <div className="checkout-totals">

            <div>

              <span>
                Subtotal
              </span>

              <span>
                ₹{cartTotal}
              </span>

            </div>

            <div>

              <span>
                Shipping
              </span>

              <span>

                {shipping === 0
                  ? "FREE"
                  : `₹${shipping}`}

              </span>

            </div>

            <div className="checkout-final-total">

              <span>
                Total
              </span>

              <span>
                ₹{finalTotal}
              </span>

            </div>

          </div>

          {/* BUTTON */}

          <button
            className="place-order-btn"
          >

            Place Order

          </button>

        </div>

      </div>

    </div>
  );
}