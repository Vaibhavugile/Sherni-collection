import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Header from "./components/layout/Header";

import CategoryBar from "./components/layout/CategoryBar";

import HeroSection from "./components/layout/HeroSection";

import ShopTheLook from "./components/layout/ShopTheLook";

import ShopByCategory from "./components/layout/ShopByCategory";

// PAGES

import CollectionPage from "./pages/CollectionPage";

// ADMIN

import AdminPage from "./admin/AdminPage";

import SubCategories from "./admin/Subcategorypage";

import AdminProducts from "./admin/AdminProductsPage";

import AdminProductListing from "./admin/AdminProductListing";
import LoginPage
from "./pages/LoginPage";
import WishlistPage
from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import CartDrawer
from "./components/layout/CartDrawer";
import ProductPage
from "./pages/ProductPage";
import CheckoutPage
from "./pages/CheckoutPage";
export default function App() {

  return (
    <BrowserRouter>
     <CartDrawer />

      <Routes>

        {/* ======================================
            FRONTEND
        ====================================== */}

        <Route
          path="/"
          element={
            <>

              <Navbar />

              <Header />

              <CategoryBar />

              <HeroSection />

              <ShopTheLook />

              <ShopByCategory />

            </>
          }
        />

        {/* COLLECTION PAGE */}

        <Route
          path="/collections/:slug"
          element={
            <>

              <Navbar />

              <Header />

              <CategoryBar />

              <CollectionPage />

            </>
          }
        />
        <Route
  path="/wishlist"
  element={
    <>

      <Navbar />

      <Header />

      <CategoryBar />

      <WishlistPage />

    </>
  }
/>
       <Route
  path="/wishlist"
  element={
    <>

      <Navbar />

      <Header />

      <CategoryBar />

      <WishlistPage />

    </>
  }
/>
<Route
  path="/cart"
  element={
    <>

      <Navbar />

      <Header />

      <CategoryBar />

      <CartPage />

    </>
  }
/>
<Route
  path="/product/:slug"
  element={
    <>

      <Navbar />

      <Header />

      <CategoryBar />

      <ProductPage />

    </>
  }
/>
<Route
  path="/checkout"
  element={
    <>

      <Navbar />

      <Header />

      <CategoryBar />

      <CheckoutPage />

    </>
  }
/>

        {/* ======================================
            ADMIN
        ====================================== */}

        {/* CATEGORY ADMIN */}

        <Route
          path="/admin/categories"
          element={<AdminPage />}
        />

        {/* SUBCATEGORY ADMIN */}

        <Route
          path="/admin/subcategories"
          element={<SubCategories />}
        />

        {/* ADD PRODUCTS */}

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        {/* PRODUCT LISTING */}

        <Route
          path="/admin/products/list"
          element={
            <AdminProductListing />
          }
        />
        <Route
  path="/login"
  element={<LoginPage />}
/>


      </Routes>

    </BrowserRouter>
  );
}