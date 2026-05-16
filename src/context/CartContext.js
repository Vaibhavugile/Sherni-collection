import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext =
  createContext();

export function CartProvider({
  children,
}) {

  // CART ITEMS

  const [cartItems, setCartItems] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "cartItems"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  // CART DRAWER

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  // SAVE LOCAL STORAGE

  useEffect(() => {

    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  /* =========================================
     ADD TO CART
  ========================================= */

  function addToCart(product) {

    const exists =
      cartItems.find(
        (item) =>
          item.id === product.id
      );

    // PRODUCT EXISTS

    if (exists) {

      setCartItems((prev) =>
        prev.map((item) =>

          item.id === product.id
            ? {
                ...item,

                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );

    } else {

      // NEW PRODUCT

      setCartItems((prev) => [
        ...prev,

        {
          ...product,

          quantity: 1,
        },
      ]);
    }

    // OPEN CART DRAWER

    setIsCartOpen(true);
  }

  /* =========================================
     REMOVE FROM CART
  ========================================= */

  function removeFromCart(id) {

    setCartItems((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  }

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  function increaseQuantity(id) {

    setCartItems((prev) =>
      prev.map((item) =>

        item.id === id
          ? {
              ...item,

              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  function decreaseQuantity(id) {

    setCartItems((prev) =>

      prev
        .map((item) =>

          item.id === id
            ? {
                ...item,

                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  /* =========================================
     CLEAR CART
  ========================================= */

  function clearCart() {

    setCartItems([]);
  }

  /* =========================================
     TOTAL ITEMS
  ========================================= */

  const cartCount =
    cartItems.reduce(
      (total, item) =>

        total + item.quantity,

      0
    );

  /* =========================================
     TOTAL PRICE
  ========================================= */

  const cartTotal =
    cartItems.reduce(
      (total, item) =>

        total +
        item.price *
          item.quantity,

      0
    );

  return (
    <CartContext.Provider
      value={{

        // DATA

        cartItems,

        cartCount,

        cartTotal,

        // DRAWER

        isCartOpen,

        setIsCartOpen,

        // FUNCTIONS

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}

export function useCart() {

  return useContext(
    CartContext
  );
}