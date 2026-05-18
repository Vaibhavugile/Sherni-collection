import {
  useState,
} from "react";

import {
  CreditCard,
  Truck,
  ShieldCheck,
} from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import {
  useNavigate,
} from "react-router-dom";

import {
  db,
} from "../firebase/config";

import {
  useCart,
} from "../context/CartContext";

import {
  useAuth,
} from "../context/AuthContext";

import "../css/checkoutpage.css";

export default function CheckoutPage() {

  // NAVIGATE

  const navigate =
    useNavigate();

  // AUTH

  const { currentUser } =
    useAuth();

  // CART

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  // SHIPPING

  const shipping =
    cartTotal > 499
      ? 0
      : 99;

  // FINAL TOTAL

  const finalTotal =
    cartTotal + shipping;

  // =========================================
  // FORM STATES
  // =========================================

  const [fullName,
    setFullName] =
    useState("");

  const [phone,
    setPhone] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [address,
    setAddress] =
    useState("");

  const [city,
    setCity] =
    useState("");

  const [state,
    setState] =
    useState("");

  const [pincode,
    setPincode] =
    useState("");

  // PAYMENT

  const [paymentMethod,
    setPaymentMethod] =
    useState("ONLINE");

  // LOADING

  const [loading,
    setLoading] =
    useState(false);

  // =========================================
  // PLACE ORDER
  // =========================================

  async function handlePlaceOrder() {

    // VALIDATION

    if (
      !fullName ||
      !phone ||
      !email ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    // EMPTY CART

    if (
      cartItems.length === 0
    ) {

      alert(
        "Cart is empty"
      );

      return;
    }

    try {

      setLoading(true);

      // =====================================
      // INVENTORY UPDATE
      // =====================================

      // =====================================
// INVENTORY UPDATE
// =====================================

for (const item of cartItems) {

  // REAL PRODUCTS DOC

  const productRef =
    doc(
      db,
      "products",
      item.productId
    );

  // GET PRODUCT

  const productSnap =
    await getDoc(
      productRef
    );

  // NOT FOUND

  if (
    !productSnap.exists()
  ) {

    continue;
  }

  const productData =
    productSnap.data();

  // VARIANTS

  let updatedVariants =
    productData.variants ||
    [];

  updatedVariants =
    updatedVariants.map(
      (variant) => {

        // MATCH CORRECT VARIANT

        if (

          variant.size ===
            item.selectedSize &&

          variant.color ===
            item.selectedColor

        ) {

          // REDUCE STOCK

          return {

            ...variant,

            stock:
              Math.max(
                0,
                variant.stock -
                item.quantity
              ),
          };
        }

        return variant;
      }
    );

  // UPDATE FIRESTORE

  await updateDoc(
    productRef,
    {
      variants:
        updatedVariants,
    }
  );
}

      // =====================================
      // CREATE ORDER
      // =====================================

      const orderData = {

        // ORDER INFO

        orderNumber:
          "ORD-" +
          Date.now(),

        // USER

        userId:
          currentUser?.uid ||
          null,

        // CUSTOMER

        customerName:
          fullName,

        phone,

        email,

        address,

        city,

        state,

        pincode,

        // PAYMENT

        paymentMethod,

        paymentStatus:
          paymentMethod ===
          "COD"
            ? "PENDING"
            : "PAID",

        // PRODUCTS

        items: cartItems,

        // TOTALS

        subtotal:
          cartTotal,

        shipping,

        total:
          finalTotal,

        // STATUS

        orderStatus:
          "PLACED",

        // DATE

        createdAt:
          serverTimestamp(),
      };

      // SAVE ORDER

      await addDoc(
        collection(
          db,
          "orders"
        ),
        orderData
      );

      // CLEAR CART

      clearCart();

      // SUCCESS

      alert(
        "Order Placed Successfully"
      );

      // REDIRECT

      navigate("/");

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  }

  return (
    <div className="checkout-page">

      {/* =========================================
          LEFT
      ========================================= */}

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

            {/* FULL NAME */}

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
            />

            {/* PHONE */}

            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            {/* EMAIL */}

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

            {/* PINCODE */}

            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(
                  e.target.value
                )
              }
            />

            {/* ADDRESS */}

            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />

            {/* CITY */}

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
            />

            {/* STATE */}

            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) =>
                setState(
                  e.target.value
                )
              }
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
                checked={
                  paymentMethod ===
                  "ONLINE"
                }
                onChange={() =>
                  setPaymentMethod(
                    "ONLINE"
                  )
                }
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
                checked={
                  paymentMethod ===
                  "COD"
                }
                onChange={() =>
                  setPaymentMethod(
                    "COD"
                  )
                }
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

      {/* =========================================
          RIGHT
      ========================================= */}

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
            onClick={
              handlePlaceOrder
            }
            disabled={loading}
          >

            {loading
              ? "Processing..."
              : "Place Order"}

          </button>

        </div>

      </div>

    </div>
  );
}