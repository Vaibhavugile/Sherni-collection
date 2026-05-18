import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";

import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

import { db } from "../firebase/config";

import {
  useCart,
} from "../context/CartContext";

import {
  useWishlist,
} from "../context/WishlistContext";

import "../css/productpage.css";

export default function ProductPage() {

  const { slug } =
    useParams();

  const [product, setProduct] =
    useState(null);

  const [productDetails,
    setProductDetails] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [selectedImage,
    setSelectedImage] =
    useState("");

  const [quantity,
    setQuantity] =
    useState(1);

  const [selectedVariant,
    setSelectedVariant] =
    useState(null);

  // CART

  const { addToCart } =
    useCart();

  // WISHLIST

  const {
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  // LOAD PRODUCT

  useEffect(() => {

    async function loadProduct() {

      try {

        // PUBLIC PRODUCTS

        const publicSnapshot =
          await getDocs(
            query(
              collection(
                db,
                "productPublic"
              )
            )
          );

        const publicData =
          publicSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        const foundProduct =
          publicData.find(
            (item) =>
              item.slug === slug
          );

        setProduct(
          foundProduct
        );

        // PRODUCT DETAILS

        const detailsSnapshot =
          await getDocs(
            query(
              collection(
                db,
                "products"
              )
            )
          );

        const detailsData =
          detailsSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        const foundDetails =
          detailsData.find(
            (item) =>
              item.productId ===
              foundProduct?.id
          );

        setProductDetails(
          foundDetails
        );

        // DEFAULT IMAGE

        if (
          foundProduct?.thumbnail
        ) {

          setSelectedImage(
            foundProduct.thumbnail
          );
        }

        // DEFAULT VARIANT

        if (
          foundDetails?.variants
            ?.length > 0
        ) {

          const firstAvailable =
            foundDetails.variants.find(
              (variant) =>
                variant.stock > 0
            );

          setSelectedVariant(
            firstAvailable ||
            foundDetails.variants[0]
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    }

    loadProduct();

  }, [slug]);

  // LOADING

  if (loading) {

    return (
      <div className="product-loading">

        Loading Product...

      </div>
    );
  }

  // PRODUCT NOT FOUND

  if (!product) {

    return (
      <div className="product-loading">

        Product Not Found

      </div>
    );
  }

  // GALLERY

  const gallery = [

    product.thumbnail,

    ...(productDetails
      ?.gallery || []),
  ];

  // CURRENT PRICE

  const currentPrice =
    selectedVariant?.price ||
    product.price;

  // CURRENT SALE PRICE

  const currentSalePrice =
    selectedVariant?.salePrice ||
    product.salePrice;

  // CURRENT STOCK

  const currentStock =
    selectedVariant?.stock ??
    product.stock ??
    0;

  // STOCK STATUS

  const isOutOfStock =
    currentStock <= 0;

  return (
    <div className="product-page">

      {/* LEFT */}

      <div className="product-gallery">

        {/* THUMBNAILS */}

        <div className="product-thumbs">

          {gallery.map(
            (image, index) => (

              <button
                key={index}
                className={`thumb-btn ${
                  selectedImage === image
                    ? "active-thumb"
                    : ""
                }`}
                onClick={() =>
                  setSelectedImage(
                    image
                  )
                }
              >

                <img
                  src={image}
                  alt=""
                />

              </button>

            )
          )}

        </div>

        {/* MAIN IMAGE */}

        <div className="product-main-image">

          <img
            src={selectedImage}
            alt=""
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="product-info">

        {/* CATEGORY */}

        <p className="product-category">

          {
            product.categoryName
          }

        </p>

        {/* TITLE */}

        <h1>
          {product.title}
        </h1>

        {/* PRICE */}

        <div className="product-price">

          <span className="product-sale-price">

            ₹{currentPrice}

          </span>

          {currentSalePrice >
            0 && (

            <span className="product-original-price">

              ₹{
                currentSalePrice
              }

            </span>

          )}

        </div>

        {/* STOCK */}

        <div className="product-stock-wrap">

          {isOutOfStock ? (

            <span className="out-stock">

              Out Of Stock

            </span>

          ) : currentStock <= 5 ? (

            <span className="low-stock">

              Only {currentStock} left

            </span>

          ) : (

            <span className="in-stock">

              In Stock

            </span>

          )}

        </div>

        {/* DESCRIPTION */}

        <p className="product-description">

          {
            productDetails
              ?.description
          }

        </p>

        {/* VARIANTS */}

        {productDetails
          ?.variants?.length >
          0 && (

          <div className="product-section">

            <h3>
              Select Variant
            </h3>

            <div className="variant-grid">

              {productDetails
                .variants.map(
                  (
                    variant,
                    index
                  ) => (

                    <button
                      key={index}
                      disabled={
                        variant.stock <= 0
                      }
                      className={`variant-btn ${
                        selectedVariant ===
                        variant
                          ? "active-variant"
                          : ""
                      } ${
                        variant.stock <= 0
                          ? "disabled-variant"
                          : ""
                      }`}
                      onClick={() => {

                        setSelectedVariant(
                          variant
                        );

                        setQuantity(1);
                      }}
                    >

                      <span>

                        {variant.size}

                      </span>

                      <small>

                        {variant.color}

                      </small>

                      <p>

                        ₹{variant.price}

                      </p>

                      {variant.stock <= 0 ? (

                        <strong>
                          Sold Out
                        </strong>

                      ) : (

                        <em>

                          {variant.stock}
                          {" "}
                          left

                        </em>

                      )}

                    </button>

                  )
                )}

            </div>

          </div>

        )}

        {/* QUANTITY */}

        <div className="product-section">

          <h3>
            Quantity
          </h3>

          <div className="product-qty">

            {/* MINUS */}

            <button
              onClick={() =>
                setQuantity(
                  Math.max(
                    1,
                    quantity - 1
                  )
                )
              }
            >

              <Minus size={16} />

            </button>

            {/* COUNT */}

            <span>
              {quantity}
            </span>

            {/* PLUS */}

            <button
              disabled={
                quantity >=
                currentStock
              }
              onClick={() =>
                setQuantity(
                  quantity + 1
                )
              }
            >

              <Plus size={16} />

            </button>

          </div>

        </div>

        {/* ACTIONS */}

        <div className="product-actions">

          {/* ADD TO CART */}

          <button
            disabled={isOutOfStock}
            className={`product-cart-btn ${
              isOutOfStock
                ? "disabled-cart-btn"
                : ""
            }`}
            onClick={() =>
              addToCart({

  // PUBLIC PRODUCT

  ...product,

  // REAL PRODUCTS DOC ID

  productId:
    productDetails?.id,

  // QUANTITY

  quantity,

  // VARIANT

  selectedVariant,

  selectedSize:
    selectedVariant?.size,

  selectedColor:
    selectedVariant?.color,

  // DYNAMIC PRICING

  price:
    currentPrice,

  salePrice:
    currentSalePrice,
})
            }
          >

            <ShoppingBag
              size={18}
            />

            {isOutOfStock
              ? "Out Of Stock"
              : "Add To Cart"}

          </button>

          {/* WISHLIST */}

          <button
            className={`product-wishlist-btn ${
              isWishlisted(product.id)
                ? "active-product-wishlist"
                : ""
            }`}
            onClick={() =>
              toggleWishlist(product)
            }
          >

            <Heart
              size={20}
              fill={
                isWishlisted(
                  product.id
                )
                  ? "currentColor"
                  : "none"
              }
            />

          </button>

        </div>

        {/* TRUST */}

        <div className="product-trust">

          <div>

            <Truck size={18} />

            Free Shipping

          </div>

          <div>

            <RotateCcw
              size={18}
            />

            Easy Returns

          </div>

          <div>

            <ShieldCheck
              size={18}
            />

            Secure Checkout

          </div>

        </div>

        {/* ACCORDION */}

        <div className="product-accordion">

          <details open>

            <summary>
              Product Details
            </summary>

            <p>

              {
                productDetails
                  ?.longDescription
              }

            </p>

          </details>

          <details>

            <summary>
              Fabric Details
            </summary>

            <p>

              {
                productDetails
                  ?.fabricDetails
              }

            </p>

          </details>

          <details>

            <summary>
              Wash Care
            </summary>

            <p>

              {
                productDetails
                  ?.washCare
              }

            </p>

          </details>

          <details>

            <summary>
              Shipping Info
            </summary>

            <p>

              {
                productDetails
                  ?.shippingInfo
              }

            </p>

          </details>

        </div>

      </div>

    </div>
  );
}