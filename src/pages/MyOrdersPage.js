import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import {
  PackageCheck,
  Truck,
  CircleCheck,
  Clock3,
} from "lucide-react";

import {
  db,
} from "../firebase/config";

import {
  useAuth,
} from "../context/AuthContext";

import "../css/myorderspage.css";

export default function MyOrdersPage() {

  const { currentUser } =
    useAuth();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================================
  // LOAD ORDERS
  // =========================================

  useEffect(() => {

    async function loadOrders() {

      if (!currentUser)
        return;

      try {

        const ordersQuery =
          query(
            collection(
              db,
              "orders"
            ),
            orderBy(
              "createdAt",
              "desc"
            )
          );

        const snapshot =
          await getDocs(
            ordersQuery
          );

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        // USER ORDERS

        const userOrders =
          data.filter(
            (item) =>
              item.userId ===
              currentUser.uid
          );

        setOrders(
          userOrders
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    }

    loadOrders();

  }, [currentUser]);

  // =========================================
  // STATUS ICON
  // =========================================

  function getStatusIcon(
    status
  ) {

    switch (status) {

      case "PLACED":
        return (
          <Clock3 size={18} />
        );

      case "SHIPPED":
        return (
          <Truck size={18} />
        );

      case "DELIVERED":
        return (
          <CircleCheck
            size={18}
          />
        );

      default:
        return (
          <PackageCheck
            size={18}
          />
        );
    }
  }

  return (
    <div className="my-orders-page">

      {/* HERO */}

      <div className="orders-hero">

        <h1>
          My Orders
        </h1>

        <p>

          Track and manage
          all your purchases

        </p>

      </div>

      {/* LOADING */}

      {loading ? (

        <div className="orders-loading">

          Loading Orders...

        </div>

      ) : orders.length ===
        0 ? (

        /* EMPTY */

        <div className="orders-empty">

          <PackageCheck
            size={60}
          />

          <h2>
            No Orders Yet
          </h2>

          <p>

            Your orders will
            appear here after
            checkout.

          </p>

          <a href="/">

            Continue Shopping

          </a>

        </div>

      ) : (

        /* ORDERS */

        <div className="orders-list">

          {orders.map(
            (order) => (

              <div
                key={order.id}
                className="order-card"
              >

                {/* TOP */}

                <div className="order-top">

                  {/* LEFT */}

                  <div>

                    <h3>

                      {
                        order.orderNumber
                      }

                    </h3>

                    <p>

                      {order.createdAt
                        ?.toDate()
                        ?.toLocaleDateString()}

                    </p>

                  </div>

                  {/* STATUS */}

                  <div
                    className={`order-status ${
                      order.orderStatus
                        ?.toLowerCase()
                    }`}
                  >

                    {getStatusIcon(
                      order.orderStatus
                    )}

                    <span>

                      {
                        order.orderStatus
                      }

                    </span>

                  </div>

                </div>

                {/* ITEMS */}

                <div className="order-items">

                  {order.items.map(
                    (item,
                    index) => (

                      <div
                        key={index}
                        className="order-item"
                      >

                        {/* IMAGE */}

                        <img
                          src={
                            item.thumbnail
                          }
                          alt=""
                        />

                        {/* CONTENT */}

                        <div className="order-item-content">

                          <h4>

                            {
                              item.title
                            }

                          </h4>

                          {/* VARIANT */}

                          {item.selectedSize && (

                            <p>

                              {
                                item.selectedSize
                              }

                              {" • "}

                              {
                                item.selectedColor
                              }

                            </p>

                          )}

                          <span>

                            Qty:
                            {" "}
                            {
                              item.quantity
                            }

                          </span>

                        </div>

                        {/* PRICE */}

                        <strong>

                          ₹
                          {
                            item.price *
                            item.quantity
                          }

                        </strong>

                      </div>

                    )
                  )}

                </div>

                {/* BOTTOM */}

                <div className="order-bottom">

                  {/* PAYMENT */}

                  <div>

                    <span>
                      Payment
                    </span>

                    <strong>

                      {
                        order.paymentStatus
                      }

                    </strong>

                  </div>

                  {/* TOTAL */}

                  <div>

                    <span>
                      Total
                    </span>

                    <strong>

                      ₹
                      {order.total}

                    </strong>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}