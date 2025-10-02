import React, { useState, useEffect, useRef } from "react";
import { Loader2, Package2 } from "lucide-react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance"; // ✅ Use real API instance
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export default function ConfirmedOrdersPage() {
  const { tenantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  
  // ✅ Refs for synchronized scrolling
  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);

  // ✅ Fetch confirmed orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get(`/admin/${tenantId}/orders/confirmed`);
        console.log("Fetched confirmed orders:", res);
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch confirmed orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Synchronized scrolling between top scrollbar and table
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const tableScroll = tableScrollRef.current;

    if (!topScroll || !tableScroll) return;

    // Sync the width of top scrollbar with table
    const syncWidth = () => {
      const table = tableScroll.querySelector('table');
      if (table) {
        const scrollbarContent = topScroll.querySelector('div');
        if (scrollbarContent) {
          scrollbarContent.style.width = `${table.scrollWidth}px`;
        }
      }
    };

    syncWidth();
    window.addEventListener('resize', syncWidth);

    const handleTopScroll = () => {
      tableScroll.scrollLeft = topScroll.scrollLeft;
    };

    const handleTableScroll = () => {
      topScroll.scrollLeft = tableScroll.scrollLeft;
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    tableScroll.addEventListener('scroll', handleTableScroll);

    return () => {
      window.removeEventListener('resize', syncWidth);
      topScroll.removeEventListener('scroll', handleTopScroll);
      tableScroll.removeEventListener('scroll', handleTableScroll);
    };
  }, [loading, orders]);

  // ✅ Select helpers
  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) setSelectedOrders([]);
    else setSelectedOrders(orders.map(o => o._id));
  };

  const toggleSelectOne = (id) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ✅ Generate PDF
const generatePDF = () => {
  const doc = new jsPDF();
  doc.text("Confirmed Orders Report", 14, 15);

  const selected = orders.filter(o => selectedOrders.includes(o._id));

  selected.forEach((order, index) => {
    // 📌 Decide layout
    const isTop = index % 2 === 0;
    const marginTop = isTop ? 30 : 160;

    // 📌 After 2 orders per page → add new page
    if (index > 0 && index % 2 === 0) {
      doc.addPage();
    }

    let y = marginTop;

    // 🔹 Order Header
    doc.setFontSize(14);
    doc.text(`Order #${order.orderIdForCustomer}`, 14, y);

    // 🔹 Customer Info
    y += 10;
    doc.setFontSize(11);
    doc.text("Customer Information", 14, y);
    autoTable(doc, {
      startY: y + 5,
      head: [["Name", "Email", "Phone"]],
      body: [[
        `${order.shippingAddress?.firstName || order.userId?.firstName || "N/A"} ${order.shippingAddress?.lastName || order.userId?.lastName || ""}`,
        order.shippingAddress?.email || order.userId?.email || "N/A",
        order.shippingAddress?.phoneNumber || "N/A"
      ]],
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;

    // 🔹 Shipping Address
    doc.text("Shipping Address", 14, y);
    autoTable(doc, {
      startY: y + 5,
      head: [["Address", "City", "State", "Postal Code", "Country"]],
      body: [[
        order.shippingAddress?.addressLine || "N/A",
        order.shippingAddress?.city || "N/A",
        order.shippingAddress?.state || "N/A",
        order.shippingAddress?.postalCode || "N/A",
        order.shippingAddress?.country || "N/A"
      ]],
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;

    // 🔹 Order Items
    doc.text("Order Items", 14, y);
    const itemRows = order.items.map(i => [
      i.title || i.productId?.title || "N/A",
      i.quantity,
      `$${i.price || i.currentPrice || i.salePrice || 0}`,
      `$${(i.quantity * (i.price || i.currentPrice || i.salePrice || 0)).toFixed(2)}`
    ]);
    autoTable(doc, {
      startY: y + 5,
      head: [["Product", "Qty", "Unit Price", "Total"]],
      body: itemRows,
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;

    // 🔹 Only Total Amount
    autoTable(doc, {
      startY: y + 5,
      body: [["Total Amount", `$${order.totalAmount}`]],
      margin: { left: 14, right: 14 },
    });
  });

  doc.save("confirmed-orders.pdf");
};





  return (
    <div className='bg-gray-100 dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-gray-900 dark:text-gray-100'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-x-3">
          <Package2 className="h-8 w-8 text-indigo-500" />
          Confirmed Orders
        </h1>
        {selectedOrders.length > 0 && (
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
            <span>Download Report</span>
          </button>
        )}
      </div>

      <div className='relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg'>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
          </div>
        ) : (
          <>
            {/* Top Scrollbar */}
            <div 
              ref={topScrollRef}
              className="overflow-x-auto custom-scrollbar sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 rounded-t-3xl"
              style={{ height: '12px' }}
            >
              <div style={{ width: 'max-content', height: '1px' }}>
                {/* This div forces the scrollbar to appear with the same width as the table */}
              </div>
            </div>
            
            {/* Table Container */}
            <div ref={tableScrollRef} className="overflow-x-auto custom-scrollbar">
              <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th className='px-6 py-4'>
                  <input
                    type="checkbox"
                    className="form-checkbox text-indigo-600 rounded"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope="col" className='px-6 py-4'>Order ID</th>
                <th scope="col" className='px-6 py-4'>Customer</th>
                <th scope="col" className='px-6 py-4'>Email</th>
                <th scope="col" className='px-6 py-4'>Total Qty</th>
                <th scope="col" className='px-6 py-4'>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => {
                  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
                  const totalPrice = order.items.reduce((s, i) => s + i.quantity * i.price, 0);

                  return (
                    <tr
                      key={order._id}
                      className="border-b odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <td className='px-6 py-4'>
                        <input
                          type="checkbox"
                          className="form-checkbox text-indigo-600 rounded"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelectOne(order._id)}
                        />
                      </td>
                      <td className='px-6 py-4 font-semibold text-gray-800 dark:text-gray-200'>{order.orderIdForCustomer}</td>
                      <td className='px-6 py-4'>{order.userId?.firstName || "N/A"}</td>
                      <td className='px-6 py-4'>{order.userId?.email || "N/A"}</td>
                      <td className='px-6 py-4'>{totalQty}</td>
                      <td className='px-6 py-4'>${totalPrice.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                    No confirmed orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
