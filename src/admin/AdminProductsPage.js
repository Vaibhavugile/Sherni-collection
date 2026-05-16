import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  db,
  storage,
} from "../firebase/config";

import "./adminaddproduct.css";

export default function AdminProducts() {

  // PRODUCT

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [salePrice, setSalePrice] =
    useState("");
    // DETAILS

const [description, setDescription] =
  useState("");

const [longDescription, setLongDescription] =
  useState("");

const [fabricDetails, setFabricDetails] =
  useState("");

const [washCare, setWashCare] =
  useState("");

const [shippingInfo, setShippingInfo] =
  useState("");
  // INVENTORY

const [sku, setSku] =
  useState("");

const [totalStock, setTotalStock] =
  useState("");

const [stockStatus, setStockStatus] =
  useState("in_stock");

// VARIANTS
// FLAGS

const [featured, setFeatured] =
  useState(false);

const [bestseller, setBestseller] =
  useState(false);

const [trending, setTrending] =
  useState(false);

const [newArrival, setNewArrival] =
  useState(false);

// SEO

const [seoTitle, setSeoTitle] =
  useState("");

const [seoDescription, setSeoDescription] =
  useState("");
const [variants, setVariants] =
  useState([
    {
      size: "",
      color: "",
      stock: "",
      price: "",
    },
  ]);

  // THUMBNAIL

  const [thumbnailFile, setThumbnailFile] =
    useState(null);

  const [thumbnailPreview, setThumbnailPreview] =
    useState("");

  // GALLERY

  const [galleryFiles, setGalleryFiles] =
    useState([]);

  const [galleryPreviews, setGalleryPreviews] =
    useState([]);

  // CATEGORY

  const [categories, setCategories] =
    useState([]);

  const [subCategories, setSubCategories] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedSubCategory, setSelectedSubCategory] =
    useState("");

  // LOADING

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // AUTO SLUG

  function generateSlug(text) {

    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // THUMBNAIL CHANGE

  function handleThumbnailChange(e) {

    const file =
      e.target.files[0];

    if (!file) return;

    setThumbnailFile(file);

    setThumbnailPreview(
      URL.createObjectURL(file)
    );
  }

  // GALLERY CHANGE

  function handleGalleryChange(e) {

    const files =
      Array.from(e.target.files);

    if (!files.length) return;

    setGalleryFiles(files);

    const previews =
      files.map((file) =>
        URL.createObjectURL(file)
      );

    setGalleryPreviews(
      previews
    );
  }

  // ADD VARIANT

function addVariant() {

  setVariants([
    ...variants,

    {
      size: "",
      color: "",
      stock: "",
      price: "",
    },
  ]);
}

// REMOVE VARIANT

function removeVariant(index) {

  const updated =
    [...variants];

  updated.splice(index, 1);

  setVariants(updated);
}

// UPDATE VARIANT

function updateVariant(
  index,
  field,
  value
) {

  const updated =
    [...variants];

  updated[index][field] =
    value;

  setVariants(updated);
}
  // LOAD DATA

  useEffect(() => {

    async function loadData() {

      try {

        // CATEGORIES

        const categoriesQuery = query(
          collection(db, "categories"),
          orderBy("order")
        );

        const categoriesSnapshot =
          await getDocs(
            categoriesQuery
          );

        const categoriesData =
          categoriesSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setCategories(
          categoriesData
        );

        // SUBCATEGORIES

        const subCategoriesQuery = query(
          collection(
            db,
            "subCategories"
          ),
          orderBy("order")
        );

        const subCategoriesSnapshot =
          await getDocs(
            subCategoriesQuery
          );

        const subCategoriesData =
          subCategoriesSnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setSubCategories(
          subCategoriesData
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    }

    loadData();

  }, []);

  // FILTER SUBCATEGORIES

  const filteredSubCategories =
    subCategories.filter(
      (item) =>
        item.categoryId ===
        selectedCategory
    );

  // SAVE PRODUCT

  async function handleSaveProduct() {

    if (
      !title ||
      !slug ||
      !selectedCategory ||
      !price ||
      !thumbnailFile
    ) {

      alert(
        "Please fill required fields"
      );

      return;
    }

    try {

      setSaving(true);

      // THUMBNAIL

      const thumbnailRef = ref(
        storage,
        `products/${Date.now()}-${thumbnailFile.name}`
      );

      await uploadBytes(
        thumbnailRef,
        thumbnailFile
      );

      const thumbnailUrl =
        await getDownloadURL(
          thumbnailRef
        );

      // GALLERY

      const galleryUrls = [];

      for (const file of galleryFiles) {

        const galleryRef = ref(
          storage,
          `products/gallery-${Date.now()}-${file.name}`
        );

        await uploadBytes(
          galleryRef,
          file
        );

        const imageUrl =
          await getDownloadURL(
            galleryRef
          );

        galleryUrls.push(
          imageUrl
        );
      }

      // CATEGORY DATA

      const categoryData =
        categories.find(
          (item) =>
            item.id ===
            selectedCategory
        );

      const subCategoryData =
        subCategories.find(
          (item) =>
            item.id ===
            selectedSubCategory
        );

      // PUBLIC DATA

      const productPublicData = {

        title,

        slug,

        categoryId:
          selectedCategory,

        categoryName:
          categoryData?.name || "",

        subCategoryId:
          selectedSubCategory,

        subCategoryName:
          subCategoryData?.name || "",

        price:
          Number(price),

        salePrice:
          Number(salePrice) || 0,

        thumbnail:
          thumbnailUrl,

        galleryPreview:
          galleryUrls.slice(0, 4),

        featured,

bestseller,

trending,

newArrival,

        stockStatus:
          "in_stock",

        active: true,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      };

      // SAVE PUBLIC

      const publicDoc =
        await addDoc(
          collection(
            db,
            "productPublic"
          ),
          productPublicData
        );

      // DETAILS

      const productDetails = {

  productId:
    publicDoc.id,

  description,

  longDescription,

  fabricDetails,

  washCare,

  shippingInfo,
seoTitle:
  seoTitle || title,

seoDescription,
  inventory: {

  sku,

  totalStock:
    Number(totalStock),

  stockStatus,
},

variants:
  variants.map(
    (variant) => ({
      size:
        variant.size,

      color:
        variant.color,

      stock:
        Number(
          variant.stock
        ),

      price:
        Number(
          variant.price
        ),
    })
  ),

  gallery:
    galleryUrls,

  createdAt:
    serverTimestamp(),

  updatedAt:
    serverTimestamp(),
};

      // SAVE DETAILS

      await addDoc(
        collection(
          db,
          "products"
        ),
        productDetails
      );

      alert(
        "Product Added Successfully"
      );

      // RESET

      setTitle("");

      setSlug("");

      setPrice("");

      setSalePrice("");

      setSelectedCategory("");

      setSelectedSubCategory("");

      setThumbnailFile(null);

      setThumbnailPreview("");

      setGalleryFiles([]);
setSku("");

setTotalStock("");

setStockStatus(
  "in_stock"
);

setVariants([
  {
    size: "",
    color: "",
    stock: "",
    price: "",
  },
]);
      setGalleryPreviews([]);
      setDescription("");

setLongDescription("");

setFabricDetails("");

setWashCare("");
setFeatured(false);

setBestseller(false);

setTrending(false);

setNewArrival(false);

setSeoTitle("");

setSeoDescription("");

setShippingInfo("");

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setSaving(false);

    }
  }

  return (
    <div className="admin-products">

      {/* TOP */}

      <div className="admin-products-top">

        <h1>
          Add Product
        </h1>

      </div>

      {/* LOADING */}

      {loading ? (

        <p>
          Loading...
        </p>

      ) : (

        <div className="admin-products-form">

          {/* TITLE */}

          <input
            type="text"
            placeholder="Product Title"
            value={title}
            onChange={(e) => {

              setTitle(
                e.target.value
              );

              setSlug(
                generateSlug(
                  e.target.value
                )
              );

            }}
          />

          {/* SLUG */}

          <input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
              )
            }
          />

          {/* CATEGORY */}

          <select
            value={
              selectedCategory
            }
            onChange={(e) => {

              setSelectedCategory(
                e.target.value
              );

              setSelectedSubCategory(
                ""
              );

            }}
          >

            <option value="">
              Select Category
            </option>

            {categories.map(
              (category) => (

                <option
                  key={category.id}
                  value={
                    category.id
                  }
                >

                  {category.name}

                </option>

              )
            )}

          </select>

          {/* SUBCATEGORY */}

          <select
            value={
              selectedSubCategory
            }
            onChange={(e) =>
              setSelectedSubCategory(
                e.target.value
              )
            }
          >

            <option value="">
              Select Sub Category
            </option>

            {filteredSubCategories.map(
              (subCategory) => (

                <option
                  key={
                    subCategory.id
                  }
                  value={
                    subCategory.id
                  }
                >

                  {
                    subCategory.name
                  }

                </option>

              )
            )}

          </select>

          {/* PRICE */}

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) =>
              setPrice(
                e.target.value
              )
            }
          />

          {/* SALE PRICE */}

          <input
            type="number"
            placeholder="Sale Price"
            value={salePrice}
            onChange={(e) =>
              setSalePrice(
                e.target.value
              )
            }
          />
          {/* SHORT DESCRIPTION */}

<textarea
  placeholder="Short Description"
  value={description}
  onChange={(e) =>
    setDescription(
      e.target.value
    )
  }
/>

{/* LONG DESCRIPTION */}

<textarea
  placeholder="Long Description"
  value={longDescription}
  onChange={(e) =>
    setLongDescription(
      e.target.value
    )
  }
/>

{/* FABRIC DETAILS */}

<textarea
  placeholder="Fabric Details"
  value={fabricDetails}
  onChange={(e) =>
    setFabricDetails(
      e.target.value
    )
  }
/>

{/* WASH CARE */}

<textarea
  placeholder="Wash Care"
  value={washCare}
  onChange={(e) =>
    setWashCare(
      e.target.value
    )
  }
/>

{/* SHIPPING INFO */}

<textarea
  placeholder="Shipping Information"
  value={shippingInfo}
  onChange={(e) =>
    setShippingInfo(
      e.target.value
    )
  }
/>
{/* INVENTORY */}

<h3 className="admin-section-title">
  Inventory
</h3>

<input
  type="text"
  placeholder="SKU"
  value={sku}
  onChange={(e) =>
    setSku(
      e.target.value
    )
  }
/>

<input
  type="number"
  placeholder="Total Stock"
  value={totalStock}
  onChange={(e) =>
    setTotalStock(
      e.target.value
    )
  }
/>

<select
  value={stockStatus}
  onChange={(e) =>
    setStockStatus(
      e.target.value
    )
  }
>

  <option value="in_stock">
    In Stock
  </option>

  <option value="low_stock">
    Low Stock
  </option>

  <option value="out_of_stock">
    Out Of Stock
  </option>

</select>

{/* VARIANTS */}

<h3 className="admin-section-title">
  Variants
</h3>

<div className="admin-variants">

  {variants.map(
    (variant, index) => (

      <div
        key={index}
        className="admin-variant-card"
      >

        <input
          type="text"
          placeholder="Size"
          value={variant.size}
          onChange={(e) =>
            updateVariant(
              index,
              "size",
              e.target.value
            )
          }
        />

        <input
          type="text"
          placeholder="Color"
          value={variant.color}
          onChange={(e) =>
            updateVariant(
              index,
              "color",
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={variant.stock}
          onChange={(e) =>
            updateVariant(
              index,
              "stock",
              e.target.value
            )
          }
        />

        <input
          type="number"
          placeholder="Price"
          value={variant.price}
          onChange={(e) =>
            updateVariant(
              index,
              "price",
              e.target.value
            )
          }
        />

        <button
          type="button"
          className="admin-remove-variant"
          onClick={() =>
            removeVariant(index)
          }
        >

          Remove

        </button>

      </div>

    )
  )}

  <button
    type="button"
    className="admin-add-variant"
    onClick={addVariant}
  >

    Add Variant

  </button>

</div>
{/* PRODUCT FLAGS */}

<h3 className="admin-section-title">
  Product Flags
</h3>

<div className="admin-checkboxes">

  <label>

    <input
      type="checkbox"
      checked={featured}
      onChange={(e) =>
        setFeatured(
          e.target.checked
        )
      }
    />

    Featured

  </label>

  <label>

    <input
      type="checkbox"
      checked={bestseller}
      onChange={(e) =>
        setBestseller(
          e.target.checked
        )
      }
    />

    Bestseller

  </label>

  <label>

    <input
      type="checkbox"
      checked={trending}
      onChange={(e) =>
        setTrending(
          e.target.checked
        )
      }
    />

    Trending

  </label>

  <label>

    <input
      type="checkbox"
      checked={newArrival}
      onChange={(e) =>
        setNewArrival(
          e.target.checked
        )
      }
    />

    New Arrival

  </label>

</div>

{/* SEO */}

<h3 className="admin-section-title">
  SEO
</h3>

<input
  type="text"
  placeholder="SEO Title"
  value={seoTitle}
  onChange={(e) =>
    setSeoTitle(
      e.target.value
    )
  }
/>

<textarea
  placeholder="SEO Description"
  value={seoDescription}
  onChange={(e) =>
    setSeoDescription(
      e.target.value
    )
  }
/>

          {/* THUMBNAIL */}

          <div className="admin-upload">

            <label>
              Product Thumbnail
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleThumbnailChange
              }
            />

          </div>

          {/* THUMBNAIL PREVIEW */}

          {thumbnailPreview && (

            <div className="admin-thumbnail-preview">

              <img
                src={
                  thumbnailPreview
                }
                alt="thumbnail"
              />

            </div>

          )}

          {/* GALLERY */}

          <div className="admin-upload">

            <label>
              Product Gallery
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleGalleryChange
              }
            />

          </div>

          {/* GALLERY PREVIEW */}

          {galleryPreviews.length > 0 && (

            <div className="admin-gallery-preview">

              {galleryPreviews.map(
                (
                  image,
                  index
                ) => (

                  <div
                    key={index}
                    className="admin-gallery-image"
                  >

                    <img
                      src={image}
                      alt=""
                    />

                  </div>

                )
              )}

            </div>

          )}

          {/* BUTTON */}

          <button
            onClick={
              handleSaveProduct
            }
          >

            {saving
              ? "Saving..."
              : "Save Product"}

          </button>

        </div>

      )}

    </div>
  );
}