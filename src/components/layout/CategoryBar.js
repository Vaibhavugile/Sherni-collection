import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { ChevronDown } from "lucide-react";

import { db } from "../../firebase/config";

import "../../css/categorybar.css";

export default function CategoryBar() {

  const [categories, setCategories] =
    useState([]);

  const [subCategories, setSubCategories] =
    useState([]);

  // LOAD FIREBASE DATA

  useEffect(() => {

    async function loadData() {

      try {

        console.log("LOADING DATA...");

        // GET CATEGORIES

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

        console.log(
          "CATEGORIES => ",
          categoriesData
        );

        setCategories(categoriesData);

        // GET SUBCATEGORIES

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

        console.log(
          "SUBCATEGORIES => ",
          subCategoriesData
        );

        setSubCategories(subCategoriesData);

      } catch (error) {

        console.log(
          "FIREBASE ERROR => ",
          error
        );

      }
    }

    loadData();

  }, []);

  return (
    <div className="categorybar">

      {categories.map((category) => {

        console.log(
          "CURRENT CATEGORY => ",
          category.slug
        );

        // FILTER SUBCATEGORIES

       const relatedSubCategories =
  subCategories.filter((item) => {

    return (
      item.categoryId ===
      category.id
    );
  });

        console.log(
          "MATCHED SUBCATEGORIES => ",
          relatedSubCategories
        );

        // HAS DROPDOWN

        const hasDropdown =
          relatedSubCategories.length > 0;

        return (
          <div
            key={category.id}
            className="category-item"
          >

            {/* CATEGORY LINK */}

            <a
              href={`/collections/${category.slug}`}
              className="category-link"
            >

              {category.name}

              {hasDropdown && (
                <ChevronDown size={14} />
              )}

            </a>

            {/* DROPDOWN */}

            {hasDropdown && (

              <div className="subcategory-dropdown">

                {relatedSubCategories.map(
                  (subCategory) => (

                    <a
                      key={subCategory.id}
                      href={`/collections/${subCategory.slug}`}
                      className="subcategory-link"
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
  );
}