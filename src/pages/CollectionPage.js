import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";

import {
  Heart,
  Search,
  SlidersHorizontal,
  ShoppingBag,
} from "lucide-react";

import { db } from "../firebase/config";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";

import "../css/collectionpage.css";

export default function CollectionPage() {

  const { slug } =
    useParams();

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [sortBy, setSortBy] =
    useState("latest");

  // CART

  const { addToCart } =
    useCart();

  // WISHLIST

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  // LOAD PRODUCTS

  useEffect(() => {

    async function loadProducts() {

      try {

        // PRODUCTS

        const productsSnapshot =
          await getDocs(
            query(
              collection(
                db,
                "productPublic"
              )
            )
          );

        const productsData =
          productsSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        // CATEGORIES

        const categoriesSnapshot =
          await getDocs(
            collection(
              db,
              "categories"
            )
          );

        const categoriesData =
          categoriesSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        // SUBCATEGORIES

        const subCategoriesSnapshot =
          await getDocs(
            collection(
              db,
              "subCategories"
            )
          );

        const subCategoriesData =
          subCategoriesSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        // MATCH CATEGORY

        const matchedCategory =
          categoriesData.find(
            (item) =>
              item.slug === slug
          );

        // MATCH SUBCATEGORY

        const matchedSubCategory =
          subCategoriesData.find(
            (item) =>
              item.slug === slug
          );

        // FILTER PRODUCTS

        const filtered =
          productsData.filter(
            (item) => {

              if (
                matchedCategory &&
                item.categoryId ===
                  matchedCategory.id
              ) {
                return true;
              }

              if (
                matchedSubCategory &&
                item.subCategoryId ===
                  matchedSubCategory.id
              ) {
                return true;
              }

              return false;
            }
          );

        setProducts(filtered);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    }

    loadProducts();

  }, [slug]);

  // FILTER + SORT

  const filteredProducts =
    useMemo(() => {

      let filtered =
        [...products];

      // SEARCH

      if (search) {

        filtered =
          filtered.filter(
            (item) =>
              item.title
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      // SORT LOW

      if (sortBy === "low") {

        filtered.sort(
          (a, b) =>
            a.price - b.price
        );
      }

      // SORT HIGH

      if (sortBy === "high") {

        filtered.sort(
          (a, b) =>
            b.price - a.price
        );
      }

      // LATEST

      if (sortBy === "latest") {

        filtered.reverse();
      }

      return filtered;

    }, [
      products,
      search,
      sortBy,
    ]);

  return (
    <div className="collection-page">

      {/* HERO */}

      <div className="collection-hero">

        <h1>

          {slug
            ?.replace(/-/g, " ")
            ?.toUpperCase()}

        </h1>

      </div>

      {/* TOOLBAR */}

      <div className="collection-toolbar">

        {/* RESULTS */}

        <div className="collection-results">

          {filteredProducts.length}
          {" "}
          Products

        </div>

        {/* SEARCH */}

        <div className="collection-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {/* SORT */}

        <div className="collection-sort">

          <SlidersHorizontal
            size={18}
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
          >

            <option value="latest">
              Latest
            </option>

            <option value="low">
              Price Low to High
            </option>

            <option value="high">
              Price High to Low
            </option>

          </select>

        </div>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="collection-loading">

          Loading Products...

        </div>

      ) : (

        <>
          {/* EMPTY */}

          {filteredProducts.length === 0 ? (

            <div className="collection-empty">

              <h2>
                No Products Found
              </h2>

              <p>
                Try another search.
              </p>

            </div>

          ) : (

            <div className="collection-grid">

              {filteredProducts.map(
                (product) => (

                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="collection-card"
                  >

                    {/* IMAGE */}

                    <div className="collection-image-wrap">

                      {/* MAIN IMAGE */}

                      <img
                        src={
                          product.thumbnail
                        }
                        alt=""
                        className="main-image"
                      />

                      {/* HOVER IMAGE */}

                      {product.galleryPreview &&
                        product.galleryPreview.length > 0 && (

                        <img
                          src={
                            product.galleryPreview[1]
                              ? product.galleryPreview[1]
                              : product.galleryPreview[0]
                          }
                          alt=""
                          className="hover-image"
                        />

                      )}

                      {/* WISHLIST */}

                      <button
                        className={`wishlist-btn ${
                          isWishlisted(product.id)
                            ? "active-wishlist"
                            : ""
                        }`}
                        onClick={(e) => {

                          e.preventDefault();

                          toggleWishlist(product);
                        }}
                      >

                        <Heart size={18} />

                      </button>

                    </div>

                    {/* CONTENT */}

                    <div className="collection-content">

                      <h3>
                        {product.title}
                      </h3>

                      <p>
                        {
                          product.categoryName
                        }
                      </p>

                      {/* PRICE */}

                      <div className="collection-price">

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

                      {/* ADD TO CART */}

                      <button
                        className="add-cart-btn"
                        onClick={(e) => {

                          e.preventDefault();

                          addToCart(product);
                        }}
                      >

                        <ShoppingBag
                          size={18}
                        />

                        Add To Cart

                      </button>

                    </div>

                  </Link>

                )
              )}

            </div>

          )}

        </>

      )}

    </div>
  );
}