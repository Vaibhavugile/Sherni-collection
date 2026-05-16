import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

import "./admin.css";

export default function SubCategories() {

  // CATEGORY STATES

  const [categories, setCategories] =
    useState([]);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  // SUBCATEGORY STATES

  const [name, setName] = useState("");

  const [slug, setSlug] = useState("");

  const [order, setOrder] = useState("");

  const [loading, setLoading] =
    useState(false);

  // LOAD CATEGORIES

  useEffect(() => {

    async function loadCategories() {

      const snapshot = await getDocs(
        collection(db, "categories")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(data);
    }

    loadCategories();

  }, []);

  // SAVE SUBCATEGORY

  async function handleAddSubCategory() {

    if (
      !name ||
      !slug ||
      !order ||
      !selectedCategory
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      await addDoc(
        collection(db, "subCategories"),
        {
          name,

          slug,

          order: Number(order),

          categoryId: selectedCategory,

          active: true,

          createdAt: serverTimestamp(),
        }
      );

      alert("Sub Category Added");

      setName("");
      setSlug("");
      setOrder("");
      setSelectedCategory("");

    } catch (error) {

      console.log(error);

      alert("Something went wrong");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="admin">

      {/* SIDEBAR */}

      <div className="admin-sidebar">

        <h2 className="admin-logo">
          ADMIN
        </h2>

      </div>

      {/* CONTENT */}

      <div className="admin-content">

        <div className="admin-topbar">

          <h1>
            Add Sub Category
          </h1>

        </div>

        {/* FORM */}

        <div className="admin-form">

          {/* CATEGORY SELECT */}

          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >

            <option value="">
              Select Category
            </option>

            {categories.map((category) => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            ))}

          </select>

          {/* NAME */}

          <input
            type="text"
            placeholder="Sub Category Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          {/* SLUG */}

          <input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
          />

          {/* ORDER */}

          <input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) =>
              setOrder(e.target.value)
            }
          />

          {/* BUTTON */}

          <button
            onClick={handleAddSubCategory}
          >

            {loading
              ? "Saving..."
              : "Save Sub Category"}

          </button>

        </div>

      </div>

    </div>
  );
}