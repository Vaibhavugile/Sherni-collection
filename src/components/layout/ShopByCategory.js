import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import {
  Link,
} from "react-router-dom";

import { db } from "../../firebase/config";

import "../../css/shopbycategory.css";

// PLACEHOLDER


export default function ShopByCategory() {

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // LOAD CATEGORIES

  useEffect(() => {

    async function loadCategories() {

      try {

        const categoriesQuery = query(
          collection(db, "categories"),
          orderBy("order")
        );

        const snapshot =
          await getDocs(categoriesQuery);

        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        // ACTIVE ONLY

        const activeCategories =
          data.filter(
            (item) => item.active
          );

        setCategories(
          activeCategories
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }
    }

    loadCategories();

  }, []);

  return (
    <section className="shop-category">

      {/* TITLE */}

      <div className="shop-category-top">

        <h2>
          SHOP BY CATEGORY
        </h2>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="shop-category-loading">

          Loading Categories...

        </div>

      ) : (

        /* GRID */

        <div className="shop-category-grid">

          {categories.map(
            (category) => (

              <Link
  key={category.id}
  to={`/collections/${category.slug}`}
  className="shop-category-card"
>

                {/* IMAGE */}

                <img
                  src={
                    category.image 
                  }
                  alt={
                    category.name
                  }
                />

                {/* OVERLAY */}

                <div className="shop-category-overlay">

                  <div>

                    <h3>
                      {
                        category.name
                      }
                    </h3>

                    <span>
                      SHOP NOW
                    </span>

                  </div>

                </div>

              </Link>

            )
          )}

        </div>

      )}

    </section>
  );
}