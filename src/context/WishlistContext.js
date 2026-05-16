import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext =
  createContext();

export function WishlistProvider({
  children,
}) {

  const [wishlistItems, setWishlistItems] =
    useState(() => {

      const saved =
        localStorage.getItem(
          "wishlistItems"
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  // SAVE

  useEffect(() => {

    localStorage.setItem(
      "wishlistItems",
      JSON.stringify(
        wishlistItems
      )
    );

  }, [wishlistItems]);

  // TOGGLE

  function toggleWishlist(product) {

    const exists =
      wishlistItems.find(
        (item) =>
          item.id === product.id
      );

    if (exists) {

      setWishlistItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== product.id
        )
      );

    } else {

      setWishlistItems((prev) => [
        ...prev,
        product,
      ]);
    }
  }

  // CHECK

  function isWishlisted(id) {

    return wishlistItems.some(
      (item) => item.id === id
    );
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isWishlisted,
      }}
    >

      {children}

    </WishlistContext.Provider>
  );
}

export function useWishlist() {

  return useContext(
    WishlistContext
  );
}