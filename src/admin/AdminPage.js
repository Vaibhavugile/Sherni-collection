import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
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

import "./admin.css";

export default function AdminPage() {

  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [order, setOrder] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [editId, setEditId] =
    useState(null);

  // AUTO SLUG

  function generateSlug(text) {

    return text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // IMAGE CHANGE

  function handleImageChange(e) {

    const file =
      e.target.files[0];

    if (!file) return;

    setImageFile(file);

    setImagePreview(
      URL.createObjectURL(file)
    );
  }

  // LOAD CATEGORIES

  useEffect(() => {

    loadCategories();

  }, []);

  async function loadCategories() {

    try {

      const categoriesQuery = query(
        collection(db, "categories"),
        orderBy("order")
      );

      const snapshot =
        await getDocs(
          categoriesQuery
        );

      const data =
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setCategories(data);

    } catch (error) {

      console.log(error);

    }
  }

  // SAVE CATEGORY

  async function handleSaveCategory() {

    if (
      !name ||
      !slug ||
      !order
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      let imageUrl =
        imagePreview;

      // UPLOAD NEW IMAGE

      if (imageFile) {

        const imageRef = ref(
          storage,
          `categories/${Date.now()}-${imageFile.name}`
        );

        await uploadBytes(
          imageRef,
          imageFile
        );

        imageUrl =
          await getDownloadURL(
            imageRef
          );
      }

      // EDIT

      if (editId) {

        await updateDoc(
          doc(
            db,
            "categories",
            editId
          ),
          {
            name,

            slug,

            image: imageUrl,

            order:
              Number(order),
          }
        );

        alert(
          "Category Updated"
        );

      } else {

        // ADD

        await addDoc(
          collection(
            db,
            "categories"
          ),
          {
            name,

            slug,

            image: imageUrl,

            order:
              Number(order),

            showInNavbar: true,

            active: true,

            createdAt:
              serverTimestamp(),
          }
        );

        alert(
          "Category Added"
        );
      }

      // RESET

      resetForm();

      loadCategories();

    } catch (error) {

      console.log(error);

      alert(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  // RESET FORM

  function resetForm() {

    setName("");

    setSlug("");

    setOrder("");

    setImageFile(null);

    setImagePreview("");

    setEditId(null);
  }

  // EDIT CATEGORY

  function handleEdit(category) {

    setEditId(category.id);

    setName(category.name);

    setSlug(category.slug);

    setOrder(category.order);

    setImagePreview(
      category.image
    );
  }

  // DELETE CATEGORY

  async function handleDelete(id) {

    const confirmDelete =
      window.confirm(
        "Delete this category?"
      );

    if (!confirmDelete) return;

    try {

      await deleteDoc(
        doc(
          db,
          "categories",
          id
        )
      );

      loadCategories();

    } catch (error) {

      console.log(error);

    }
  }

  return (
    <div className="admin">

      {/* SIDEBAR */}

      <div className="admin-sidebar">

        <h2 className="admin-logo">
          ADMIN
        </h2>

        <div className="admin-menu">

          <button>
            Categories
          </button>

          <button>
            Sub Categories
          </button>

          <button>
            Products
          </button>

          <button>
            Orders
          </button>

        </div>

      </div>

      {/* CONTENT */}

      <div className="admin-content">

        {/* TOPBAR */}

        <div className="admin-topbar">

          <h1>

            {editId
              ? "Edit Category"
              : "Add Category"}

          </h1>

        </div>

        {/* FORM */}

        <div className="admin-form">

          {/* NAME */}

          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => {

              setName(
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

          {/* IMAGE */}

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

          {/* PREVIEW */}

          {imagePreview && (

            <div className="admin-image-preview">

              <img
                src={imagePreview}
                alt="preview"
              />

            </div>

          )}

          {/* ORDER */}

          <input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) =>
              setOrder(
                e.target.value
              )
            }
          />

          {/* BUTTONS */}

          <div className="admin-buttons">

            <button
              onClick={
                handleSaveCategory
              }
            >

              {loading
                ? "Saving..."
                : editId
                ? "Update Category"
                : "Save Category"}

            </button>

            {editId && (

              <button
                className="cancel-btn"
                onClick={
                  resetForm
                }
              >

                Cancel

              </button>

            )}

          </div>

        </div>

        {/* CATEGORY LIST */}

        <div className="admin-category-list">

          {categories.map(
            (category) => (

              <div
                key={category.id}
                className="admin-category-card"
              >

                <img
                  src={
                    category.image
                  }
                  alt={
                    category.name
                  }
                />

                <div>

                  <h3>
                    {category.name}
                  </h3>

                  <p>
                    {
                      category.slug
                    }
                  </p>

                </div>

                <div className="admin-category-actions">

                  <button
                    onClick={() =>
                      handleEdit(
                        category
                      )
                    }
                  >

                    Edit

                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        category.id
                      )
                    }
                  >

                    Delete

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}