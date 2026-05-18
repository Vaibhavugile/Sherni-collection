import {
  LayoutDashboard,
  ShoppingBag,
  Layers3,
  Boxes,
  PackageCheck,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import "../css/admindashboard.css";

export default function AdminDashboard() {

  // DASHBOARD CARDS

  const dashboardCards = [

    {
      title:
        "Categories",

      description:
        "Manage product categories",

      icon:
        <Layers3 size={30} />,

      link:
        "/admin/categories",
    },

    {
      title:
        "Sub Categories",

      description:
        "Manage subcategories",

      icon:
        <Boxes size={30} />,

      link:
        "/admin/subcategories",
    },

    {
      title:
        "Add Products",

      description:
        "Create new products",

      icon:
        <ShoppingBag size={30} />,

      link:
        "/admin/products",
    },

    {
      title:
        "Products List",

      description:
        "View all products",

      icon:
        <LayoutDashboard
          size={30}
        />,

      link:
        "/admin/products/list",
    },

    {
      title:
        "Orders",

      description:
        "Manage customer orders",

      icon:
        <PackageCheck
          size={30}
        />,

      link:
        "/admin/orders",
    },
  ];

  return (
    <div className="admin-dashboard">

      {/* TOP */}

      <div className="admin-dashboard-top">

        <h1>
          Admin Dashboard
        </h1>

        <p>

          Manage your ecommerce
          store efficiently

        </p>

      </div>

      {/* GRID */}

      <div className="admin-dashboard-grid">

        {dashboardCards.map(
          (item, index) => (

            <Link
              key={index}
              to={item.link}
              className="admin-dashboard-card"
            >

              {/* ICON */}

              <div className="admin-dashboard-icon">

                {item.icon}

              </div>

              {/* CONTENT */}

              <div>

                <h2>
                  {item.title}
                </h2>

                <p>
                  {
                    item.description
                  }
                </p>

              </div>

            </Link>

          )
        )}

      </div>

    </div>
  );
}