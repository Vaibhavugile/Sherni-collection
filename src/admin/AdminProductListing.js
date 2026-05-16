import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  Pencil,
  Trash2,
  Star,
  Flame,
  BadgeCheck,
} from "lucide-react";

import { db } from "../firebase/config";

import "./adminproduct.css";

export default function AdminProductListing() {

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD PRODUCTS

  useEffect(() => {

    loadProducts();

  }, []);

  async function loadProducts() {

    try {

      const productsQuery = query(
        collection(
          db,
          "productPublic"
        ),
        orderBy(
          "createdAt",
          "desc"
        )
      );

      const snapshot =
        await getDocs(
          productsQuery
        );

      const data =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setProducts(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  }

  // DELETE PRODUCT

  async function handleDeleteProduct(id) {

    const confirmDelete =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmDelete) return;

    try {

      // DELETE PUBLIC

      await deleteDoc(
        doc(
          db,
          "productPublic",
          id
        )
      );

      // UPDATE UI

      setProducts((prev) =>
        prev.filter(
          (item) =>
            item.id !== id
        )
      );

    } catch (error) {

      console.log(error);

    }
  }

  // TOGGLE FEATURED

  async function toggleField(
    id,
    field,
    value
  ) {

    try {

      await updateDoc(
        doc(
          db,
          "productPublic",
          id
        ),
        {
          [field]: !value,
        }
      );

      setProducts((prev) =>
        prev.map((item) => {

          if (item.id === id) {

            return {
              ...item,
              [field]: !value,
            };
          }

          return item;

        })
      );

    } catch (error) {

      console.log(error);

    }
  }

  return (
    <div className="admin-product-listing">

      {/* TOP */}

      <div className="admin-product-listing-top">

        <h1>
          All Products
        </h1>

      </div>

      {/* LOADING */}

      {loading ? (

        <p className="admin-loading">
          Loading Products...
        </p>

      ) : (

        <div className="admin-product-grid">

          {products.map(
            (product) => (

              <div
                key={product.id}
                className="admin-product-card"
              >

                {/* IMAGE */}

                <div className="admin-product-image-wrap">

                  <img
                    src={
                      product.thumbnail
                    }
                    alt=""
                  />

                  {/* STATUS */}

                  <div className="admin-product-badges">

                    {product.featured && (

                      <span className="badge-featured">

                        <Star
                          size={14}
                        />

                        Featured

                      </span>

                    )}

                    {product.bestseller && (

                      <span className="badge-bestseller">

                        <BadgeCheck
                          size={14}
                        />

                        Bestseller

                      </span>

                    )}

                    {product.trending && (

                      <span className="badge-trending">

                        <Flame
                          size={14}
                        />

                        Trending

                      </span>

                    )}

                  </div>

                </div>

                {/* CONTENT */}

                <div className="admin-product-content">

                  <h3>
                    {product.title}
                  </h3>

                  <p>
                    {
                      product.categoryName
                    }
                  </p>

                  <div className="admin-product-price">

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

                  {/* STOCK */}

                  <div className="admin-stock">

                    <span>

                      {
                        product.stockStatus
                      }

                    </span>

                  </div>

                </div>

                {/* TOGGLES */}

                <div className="admin-product-toggles">

                  <button
                    className={
                      product.featured
                        ? "toggle-active"
                        : ""
                    }
                    onClick={() =>
                      toggleField(
                        product.id,
                        "featured",
                        product.featured
                      )
                    }
                  >

                    Featured

                  </button>

                  <button
                    className={
                      product.bestseller
                        ? "toggle-active"
                        : ""
                    }
                    onClick={() =>
                      toggleField(
                        product.id,
                        "bestseller",
                        product.bestseller
                      )
                    }
                  >

                    Bestseller

                  </button>

                  <button
                    className={
                      product.trending
                        ? "toggle-active"
                        : ""
                    }
                    onClick={() =>
                      toggleField(
                        product.id,
                        "trending",
                        product.trending
                      )
                    }
                  >

                    Trending

                  </button>

                </div>

                {/* ACTIONS */}

                <div className="admin-product-actions">

                  <button
                    className="edit-btn"
                  >

                    <Pencil
                      size={16}
                    />

                    Edit

                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteProduct(
                        product.id
                      )
                    }
                  >

                    <Trash2
                      size={16}
                    />

                    Delete

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}