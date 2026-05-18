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

  /* =========================================
     CART ITEMS
  ========================================= */

  const [cartItems,
    setCartItems] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "cartItems"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  /* =========================================
     CART DRAWER
  ========================================= */

  const [isCartOpen,
    setIsCartOpen] =
    useState(false);

  /* =========================================
     SAVE LOCAL STORAGE
  ========================================= */

  useEffect(() => {

    localStorage.setItem(
      "cartItems",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);

  /* =========================================
     GENERATE UNIQUE CART KEY
  ========================================= */

  function generateCartKey(
    product
  ) {

    return `${product.id}-${
      product.selectedSize || ""
    }-${
      product.selectedColor || ""
    }`;
  }

  /* =========================================
     ADD TO CART
  ========================================= */

  function addToCart(product) {

    const cartKey =
      generateCartKey(
        product
      );

    // FIND EXISTING

    const exists =
      cartItems.find(
        (item) =>
          item.cartKey ===
          cartKey
      );

    // =====================================
    // PRODUCT EXISTS
    // =====================================

    if (exists) {

      setCartItems((prev) =>

        prev.map((item) => {

          // MATCH ITEM

          if (
            item.cartKey ===
            cartKey
          ) {

            // STOCK LIMIT

            const maxStock =
              item.selectedVariant
                ?.stock || 999;

            const newQty =
              Math.min(
                item.quantity + (
                  product.quantity || 1
                ),
                maxStock
              );

            return {

              ...item,

              quantity:
                newQty,
            };
          }

          return item;
        })
      );

    } else {

      // =====================================
      // NEW PRODUCT
      // =====================================

      setCartItems((prev) => [

        ...prev,

        {

          ...product,

          cartKey,

          quantity:
            product.quantity || 1,
        },
      ]);
    }

    // OPEN DRAWER

    setIsCartOpen(true);
  }

  /* =========================================
     REMOVE ITEM
  ========================================= */

  function removeFromCart(
    cartKey
  ) {

    setCartItems((prev) =>

      prev.filter(
        (item) =>
          item.cartKey !==
          cartKey
      )
    );
  }

  /* =========================================
     INCREASE QUANTITY
  ========================================= */

  function increaseQuantity(
    cartKey
  ) {

    setCartItems((prev) =>

      prev.map((item) => {

        if (
          item.cartKey !==
          cartKey
        ) {

          return item;
        }

        // MAX STOCK

        const maxStock =
          item.selectedVariant
            ?.stock || 999;

        return {

          ...item,

          quantity:
            Math.min(
              item.quantity + 1,
              maxStock
            ),
        };
      })
    );
  }

  /* =========================================
     DECREASE QUANTITY
  ========================================= */

  function decreaseQuantity(
    cartKey
  ) {

    setCartItems((prev) =>

      prev
        .map((item) => {

          if (
            item.cartKey !==
            cartKey
          ) {

            return item;
          }

          return {

            ...item,

            quantity:
              item.quantity - 1,
          };
        })

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
     GET ITEM SUBTOTAL
  ========================================= */

  function getItemSubtotal(
    item
  ) {

    return (
      item.price *
      item.quantity
    );
  }

  /* =========================================
     TOTAL ITEMS
  ========================================= */

  const cartCount =
    cartItems.reduce(
      (total, item) =>

        total +
        item.quantity,

      0
    );

  /* =========================================
     TOTAL PRICE
  ========================================= */

  const cartTotal =
    cartItems.reduce(
      (total, item) =>

        total +
        getItemSubtotal(
          item
        ),

      0
    );

  /* =========================================
     CONTEXT VALUE
  ========================================= */

  return (
    <CartContext.Provider
      value={{

        // DATA

        cartItems,

        cartCount,

        cartTotal,

        isCartOpen,

        // FUNCTIONS

        setIsCartOpen,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        getItemSubtotal,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}

/* =========================================
   HOOK
========================================= */

export function useCart() {

  return useContext(
    CartContext
  );
}