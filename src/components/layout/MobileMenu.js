import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import {
  Menu,
  X,
  Plus,
  Minus,
  Search,
  User,
  Phone,
  Mail,
} from "lucide-react";

import { db } from "../../firebase/config";

import "../../css/mobilemenu.css";

export default function MobileMenu() {

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [openCategory, setOpenCategory] =
    useState(null);

  const [categories, setCategories] =
    useState([]);

  const [subCategories, setSubCategories] =
    useState([]);

  // LOAD FIREBASE DATA

  useEffect(() => {

    async function loadData() {

      try {

        // CATEGORIES

        const categoriesQuery = query(
          collection(db, "categories"),
          orderBy("order")
        );

        const categoriesSnapshot =
          await getDocs(categoriesQuery);

        const categoriesData =
          categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCategories(categoriesData);

        // SUBCATEGORIES

        const subCategoriesQuery = query(
          collection(db, "subCategories"),
          orderBy("order")
        );

        const subCategoriesSnapshot =
          await getDocs(subCategoriesQuery);

        const subCategoriesData =
          subCategoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setSubCategories(subCategoriesData);

      } catch (error) {

        console.log(error);

      }
    }

    loadData();

  }, []);

  // TOGGLE CATEGORY

  function toggleCategory(id) {

    if (openCategory === id) {
      setOpenCategory(null);
    } else {
      setOpenCategory(id);
    }
  }

  return (
    <>

      {/* MENU BUTTON */}

      <button
        className="mobile-menu-btn"
        onClick={() =>
          setMenuOpen(true)
        }
      >

        <Menu size={28} />

      </button>

      {/* OVERLAY */}

      <div
        className={`mobile-overlay ${
          menuOpen ? "show-overlay" : ""
        }`}
        onClick={() =>
          setMenuOpen(false)
        }
      />

      {/* DRAWER */}

      <div
        className={`mobile-menu ${
          menuOpen ? "show-menu" : ""
        }`}
      >

        {/* TOP */}

        <div className="mobile-menu-top">

          <button
            onClick={() =>
              setMenuOpen(false)
            }
          >

            <X size={26} />

          </button>

        </div>

        {/* SEARCH */}

        <div className="mobile-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

        {/* MENU ITEMS */}

        <div className="mobile-menu-items">

          {categories.map((category) => {

            // RELATED SUBCATEGORIES

            const relatedSubCategories =
              subCategories.filter(
                (item) =>
                  item.categoryId ===
                  category.id
              );

            const hasDropdown =
              relatedSubCategories.length > 0;

            const isOpen =
              openCategory === category.id;

            return (
              <div
                key={category.id}
                className="mobile-category"
              >

                {/* CATEGORY ROW */}

                <div
                  className="mobile-category-row"
                  onClick={() => {

                    if (hasDropdown) {
                      toggleCategory(category.id);
                    }

                  }}
                >

                  <a
                    href={`/collections/${category.slug}`}
                  >

                    {category.name}

                  </a>

                  {hasDropdown && (

                    <span>

                      {isOpen ? (
                        <Minus size={18} />
                      ) : (
                        <Plus size={18} />
                      )}

                    </span>

                  )}

                </div>

                {/* SUBCATEGORIES */}

                {hasDropdown && isOpen && (

                  <div className="mobile-subcategories">

                    {relatedSubCategories.map(
                      (subCategory) => (

                        <a
                          key={subCategory.id}
                          href={`/collections/${subCategory.slug}`}
                        >

                          {subCategory.name}

                        </a>

                      )
                    )}

                  </div>

                )}

              </div>
            );
          })}

        </div>

        {/* CONTACT */}

        <div className="mobile-contact">

          <div className="mobile-contact-item">

            <Phone size={16} />

            <span>
              +91 98348 33867
            </span>

          </div>

          <div className="mobile-contact-item">

            <Mail size={16} />

            <span>
              contact@nehasharmalabel.com
            </span>

          </div>

        </div>

        {/* LOGIN */}

        <div className="mobile-login">

          <User size={16} />

          <span>
            Login / Register
          </span>

        </div>

      </div>

    </>
  );
}