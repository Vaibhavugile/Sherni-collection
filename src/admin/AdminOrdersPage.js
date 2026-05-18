import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import {
  Search,
  Truck,
  PackageCheck,
  CircleCheck,
  XCircle,
} from "lucide-react";

import {
  db,
} from "../firebase/config";

import "../css/adminorders.css";

export default function AdminOrdersPage() {

  // =========================================
  // STATES
  // =========================================

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter] =
    useState("ALL");

  // =========================================
  // LOAD ORDERS REALTIME
  // =========================================

  useEffect(() => {

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

    // REALTIME

    const unsubscribe =
      onSnapshot(
        ordersQuery,
        (snapshot) => {

          const data =
            snapshot.docs.map(
              (doc) => ({
                id: doc.id,
                ...doc.data(),
              })
            );

          setOrders(data);

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // =========================================
  // UPDATE STATUS
  // =========================================

  async function updateStatus(
    orderId,
    status
  ) {

    try {

      await updateDoc(
        doc(
          db,
          "orders",
          orderId
        ),
        {
          orderStatus:
            status,
        }
      );

    } catch (error) {

      console.log(error);
    }
  }

  // =========================================
  // STATS
  // =========================================

  const totalOrders =
    orders.length;

  const totalRevenue =
    orders.reduce(
      (total, order) =>

        total + order.total,

      0
    );

  const pendingOrders =
    orders.filter(
      (order) =>

        order.orderStatus ===
        "PLACED"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>

        order.orderStatus ===
        "DELIVERED"
    ).length;

  // =========================================
  // FILTERED ORDERS
  // =========================================

  const filteredOrders =
    orders.filter(
      (order) => {

        // SEARCH

        const matchesSearch =

          order.orderNumber
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||

          order.customerName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        // STATUS

        const matchesStatus =

          statusFilter ===
          "ALL"

            ? true

            : order.orderStatus ===
              statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  return (
    <div className="admin-orders-page">

      {/* =========================================
          TOP
      ========================================= */}

      <div className="admin-orders-top">

        {/* LEFT */}

        <div>

          <h1>
            Orders
          </h1>

          <p>

            Manage all customer
            orders

          </p>

        </div>

        {/* SEARCH */}

        <div className="admin-orders-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =========================================
          FILTERS
      ========================================= */}

      <div className="admin-order-filters">

        <button
          className={
            statusFilter ===
            "ALL"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setStatusFilter(
              "ALL"
            )
          }
        >

          All

        </button>

        <button
          className={
            statusFilter ===
            "PLACED"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setStatusFilter(
              "PLACED"
            )
          }
        >

          Placed

        </button>

        <button
          className={
            statusFilter ===
            "PACKED"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setStatusFilter(
              "PACKED"
            )
          }
        >

          Packed

        </button>

        <button
          className={
            statusFilter ===
            "SHIPPED"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setStatusFilter(
              "SHIPPED"
            )
          }
        >

          Shipped

        </button>

        <button
          className={
            statusFilter ===
            "DELIVERED"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setStatusFilter(
              "DELIVERED"
            )
          }
        >

          Delivered

        </button>

      </div>

      {/* =========================================
          STATS
      ========================================= */}

      <div className="admin-orders-stats">

        {/* TOTAL */}

        <div className="orders-stat-card">

          <h3>
            Total Orders
          </h3>

          <strong>
            {totalOrders}
          </strong>

        </div>

        {/* REVENUE */}

        <div className="orders-stat-card">

          <h3>
            Revenue
          </h3>

          <strong>

            ₹
            {totalRevenue}

          </strong>

        </div>

        {/* PENDING */}

        <div className="orders-stat-card">

          <h3>
            Pending
          </h3>

          <strong>
            {pendingOrders}
          </strong>

        </div>

        {/* DELIVERED */}

        <div className="orders-stat-card">

          <h3>
            Delivered
          </h3>

          <strong>
            {deliveredOrders}
          </strong>

        </div>

      </div>

      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (

        <div className="admin-orders-loading">

          Loading Orders...

        </div>

      ) : (

        <div className="admin-orders-list">

          {filteredOrders.map(
            (order) => (

              <div
                key={order.id}
                className="admin-order-card"
              >

                {/* =========================================
                    HEADER
                ========================================= */}

                <div className="admin-order-header">

                  {/* LEFT */}

                  <div>

                    <h2>

                      {
                        order.orderNumber
                      }

                    </h2>

                    <p>

                      {order.createdAt
                        ?.toDate()
                        ?.toLocaleDateString()}

                    </p>

                  </div>

                  {/* STATUS */}

                  <div
                    className={`admin-order-status ${
                      order.orderStatus
                        ?.toLowerCase()
                    }`}
                  >

                    {
                      order.orderStatus
                    }

                  </div>

                </div>

                {/* =========================================
                    CUSTOMER
                ========================================= */}

                <div className="admin-order-customer">

                  <h3>
                    Customer
                  </h3>

                  <p>

                    {
                      order.customerName
                    }

                  </p>

                  <span>

                    {order.phone}

                  </span>

                  <small>

                    {order.email}

                  </small>

                </div>

                {/* =========================================
                    ADDRESS
                ========================================= */}

                <div className="admin-order-address">

                  <h3>
                    Shipping Address
                  </h3>

                  <p>

                    {
                      order.address
                    }

                    {", "}

                    {
                      order.city
                    }

                    {", "}

                    {
                      order.state
                    }

                    {" - "}

                    {
                      order.pincode
                    }

                  </p>

                </div>

                {/* =========================================
                    ITEMS
                ========================================= */}

                <div className="admin-order-items">

                  {order.items.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        key={index}
                        className="admin-order-item"
                      >

                        {/* IMAGE */}

                        <img
                          src={
                            item.thumbnail
                          }
                          alt=""
                        />

                        {/* CONTENT */}

                        <div className="admin-order-item-content">

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

                {/* =========================================
                    FOOTER
                ========================================= */}

                <div className="admin-order-footer">

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

                  {/* PAYMENT */}

                  <div>

                    <span>
                      Payment
                    </span>

                    <strong
                      className={`payment-badge ${
                        order.paymentStatus
                          ?.toLowerCase()
                      }`}
                    >

                      {
                        order.paymentStatus
                      }

                    </strong>

                  </div>

                </div>

                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="admin-order-actions">

                  {/* PACKED */}

                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "PACKED"
                      )
                    }
                  >

                    <PackageCheck
                      size={16}
                    />

                    Packed

                  </button>

                  {/* SHIPPED */}

                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "SHIPPED"
                      )
                    }
                  >

                    <Truck
                      size={16}
                    />

                    Shipped

                  </button>

                  {/* DELIVERED */}

                  <button
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "DELIVERED"
                      )
                    }
                  >

                    <CircleCheck
                      size={16}
                    />

                    Delivered

                  </button>

                  {/* CANCEL */}

                  <button
                    className="cancel-order-btn"
                    onClick={() =>
                      updateStatus(
                        order.id,
                        "CANCELLED"
                      )
                    }
                  >

                    <XCircle
                      size={16}
                    />

                    Cancel

                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}