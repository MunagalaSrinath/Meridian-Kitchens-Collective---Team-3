// import { useEffect, useState } from "react";
// import axios from "axios";
// import Menu from "./Menu";
// import StaffLogin from "./StaffLogin";

// import "./App.css";

// function App() {
//   // -----------------------------
//   // State
//   // -----------------------------
//   const [inventory, setInventory] = useState([]);
//   const [loyalty, setLoyalty] = useState([]);
//   const [reorders, setReorders] = useState([]);
//   const [agentLoading, setAgentLoading] = useState(false);

//   const [selectedOutlet, setSelectedOutlet] =
//     useState("All Outlets");

//   const [selectedItem, setSelectedItem] = useState(null);

//   const [reorderQuantity, setReorderQuantity] =
//     useState("");

//   const [supplier, setSupplier] = useState("");

//   // Staff stock editing
//   const [editingItem, setEditingItem] =
//     useState(null);

//   const [editQuantity, setEditQuantity] =
//     useState("");

//   // Staff add inventory
//   const [showAddItem, setShowAddItem] =
//     useState(false);

//   const [newIngredient, setNewIngredient] =
//     useState("");

//   const [newOutlet, setNewOutlet] =
//     useState("");

//   const [newQuantity, setNewQuantity] =
//     useState("");

//   const [newReorderThreshold, setNewReorderThreshold] =
//     useState("");

//   // Login
//   const [username, setUsername] =
//     useState("");

//   const [password, setPassword] =
//     useState("");

//   const [token, setToken] =
//     useState("");

//   const [role, setRole] =
//     useState("");

//   const [outlets, setOutlets] =
//     useState([]);

//   const [showLogin, setShowLogin] =
//     useState(false);

//   // -----------------------------
//   // Staff / Manager Login
//   // -----------------------------
//   const handleStaffLogin = (data) => {
//     setToken(data.access_token);
//     setRole(data.role);
//     setUsername(data.username);
//     setShowLogin(false);

//     // Managers can view reorder requests
//     if (data.role === "manager") {
//       fetchReorders(data.access_token);
//     } else {
//       setReorders([]);
//     }
//   };

//   // -----------------------------
//   // Fetch Inventory
//   // -----------------------------
//   const fetchInventory = () => {
//     axios
//       .get("http://127.0.0.1:8000/inventory")
//       .then((response) => {
//         setInventory(response.data.inventory);
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching inventory:",
//           error
//         );
//       });
//   };

//   // -----------------------------
//   // Fetch Loyalty
//   // -----------------------------
//   const fetchLoyalty = () => {
//     axios
//       .get("http://127.0.0.1:8000/loyalty")
//       .then((response) => {
//         setLoyalty(response.data.loyalty);
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching loyalty data:",
//           error
//         );
//       });
//   };

//   // -----------------------------
//   // Fetch Reorder Requests
//   // -----------------------------
//   const fetchReorders = (authToken) => {
//     axios
//       .get(
//         "http://127.0.0.1:8000/reorders",
//         {
//           headers: {
//             Authorization: `Bearer ${authToken}`,
//           },
//         }
//       )
//       .then((response) => {
//         setReorders(response.data.reorders);
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching reorder requests:",
//           error
//         );
//       });
//   };

//   // -----------------------------
//   // Fetch Outlets
//   // -----------------------------
//   const fetchOutlets = () => {
//     axios
//       .get("http://127.0.0.1:8000/outlets")
//       .then((response) => {
//         setOutlets(response.data.outlets);
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching outlets:",
//           error
//         );
//       });
//   };



//   const runInventoryAgent = () => {
//   if (!token) {
//     alert("Please login as a manager first.");
//     return;
//   }

//   setAgentLoading(true);

//   axios
//     .post(
//       "http://127.0.0.1:8000/ai/inventory-agent",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     )
//     .then((response) => {
//       const created = response.data.created_requests || [];

//       if (created.length === 0) {
//         alert("AI Agent completed. No new reorder requests were created.");
//       } else {
//         alert(
//           `AI Agent created ${created.length} new reorder request(s).`
//         );
//       }

//       fetchReorders(token);
//       fetchInventory();
//     })
//     .catch((error) => {
//       console.error("AI Inventory Agent error:", error);

//       alert(
//         error.response?.data?.message ||
//         "AI Inventory Agent failed."
//       );
//     })
//     .finally(() => {
//       setAgentLoading(false);
//     });
// };

//   // -----------------------------
//   // Add New Inventory Item
//   // -----------------------------
//   const handleAddInventory = () => {
//     if (
//       !newIngredient ||
//       !newOutlet ||
//       newQuantity === "" ||
//       newReorderThreshold === ""
//     ) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     axios
//       .post(
//         "http://127.0.0.1:8000/inventory",
//         {
//           ingredient: newIngredient,
//           outlet: newOutlet,
//           quantity: Number(newQuantity),
//           reorder_threshold:
//             Number(newReorderThreshold),
//         }
//       )
//       .then((response) => {
//         alert(
//           response.data.message ||
//             "Inventory item added successfully."
//         );

//         setNewIngredient("");
//         setNewOutlet("");
//         setNewQuantity("");
//         setNewReorderThreshold("");

//         setShowAddItem(false);

//         fetchInventory();
//       })
//       .catch((error) => {
//         console.error(
//           "Error adding inventory:",
//           error
//         );

//         if (error.response) {
//           alert(
//             error.response.data.message ||
//               "Failed to add inventory item."
//           );
//         } else {
//           alert(
//             "Failed to add inventory item."
//           );
//         }
//       });
//   };

//   // -----------------------------
//   // Update Existing Stock
//   // -----------------------------
//   const handleUpdateStock = () => {
//     if (editQuantity === "") {
//       alert("Please enter a quantity.");
//       return;
//     }

//     axios
//       .put(
//         `http://127.0.0.1:8000/inventory/${editingItem.id}`,
//         {
//           quantity: Number(editQuantity),
//           reorder_threshold:
//             editingItem.reorder_threshold,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       .then((response) => {
//         alert(
//           response.data.message ||
//             "Stock updated successfully."
//         );

//         setEditingItem(null);
//         setEditQuantity("");

//         fetchInventory();
//       })
//       .catch((error) => {
//         console.error(
//           "Error updating stock:",
//           error
//         );

//         if (error.response) {
//           alert(
//             error.response.data.message ||
//               "Failed to update stock."
//           );
//         } else {
//           alert(
//             "Failed to update stock."
//           );
//         }
//       });
//   };

//   // -----------------------------
//   // Create Reorder
//   // -----------------------------
//   const handleCreateReorder = () => {
//     if (!reorderQuantity || !supplier) {
//       alert(
//         "Please enter quantity and supplier."
//       );
//       return;
//     }

//     axios
//       .post(
//         "http://127.0.0.1:8000/reorders",
//         {
//           inventory_id: selectedItem.id,
//           quantity_requested:
//             Number(reorderQuantity),
//           supplier: supplier,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       )
//       .then((response) => {
//         alert(
//           response.data.message
//         );

//         setSelectedItem(null);
//         setReorderQuantity("");
//         setSupplier("");

//         fetchReorders(token);
//       })
//       .catch((error) => {
//         console.error(
//           "Error creating reorder:",
//           error
//         );

//         alert(
//           "Failed to create reorder request"
//         );
//       });
//   };

//   // -----------------------------
//   // Load Data
//   // -----------------------------
//   useEffect(() => {
//     fetchInventory();
//     fetchLoyalty();
//     fetchOutlets();
//   }, []);

//   // -----------------------------
//   // Filter Inventory
//   // -----------------------------
//   const filteredInventory =
//     selectedOutlet === "All Outlets"
//       ? inventory
//       : inventory.filter(
//           (item) =>
//             item.outlet === selectedOutlet
//         );

//   // -----------------------------
//   // Filter Reorders
//   // -----------------------------
//   const filteredReorders =
//     selectedOutlet === "All Outlets"
//       ? reorders
//       : reorders.filter(
//           (reorder) =>
//             reorder.outlet === selectedOutlet
//         );

//   // -----------------------------
//   // Screen Navigation
//   // -----------------------------

//   // Login screen
//   if (showLogin) {
//     return (
//       <StaffLogin
//         onLogin={handleStaffLogin}
//       />
//     );
//   }

//   // Public menu
//   if (!role) {
//     return (
//       <div>
//         <Menu
//           onStaffLogin={() =>
//             setShowLogin(true)
//           }
//         />
//       </div>
//     );
//   }

//   // -----------------------------
//   // Dashboard
//   // -----------------------------
//   return (
//     <div>

//       {/* =========================
//           User Information
//       ========================= */}

//       <h1>Meridian Kitchens</h1>

//       <p>
//         Logged in as:{" "}
//         <strong>{username}</strong>{" "}
//         (
//         <strong>{role}</strong>
//         )
//       </p>

//       <button
//         onClick={() => {
//           setToken("");
//           setRole("");
//           setUsername("");
//           setPassword("");

//           setSelectedItem(null);
//           setReorderQuantity("");
//           setSupplier("");

//           setEditingItem(null);
//           setEditQuantity("");

//           setShowAddItem(false);

//           setReorders([]);
//         }}
//       >
//         🚪 Logout
//       </button>

//       {/* =========================
//           Inventory Dashboard
//       ========================= */}

//       <h2>Inventory Dashboard</h2>

//       {/* Outlet Selector */}
//       <div className="outlet-selector">

//         <label>
//           Select Outlet:{" "}
//         </label>

//         <select
//           value={selectedOutlet}
//           onChange={(e) =>
//             setSelectedOutlet(
//               e.target.value
//             )
//           }
//         >
//           <option value="All Outlets">
//             All Outlets
//           </option>

//           {outlets.map((outlet) => (
//             <option
//               key={outlet}
//               value={outlet}
//             >
//               {outlet}
//             </option>
//           ))}
//         </select>

//       </div>

//       {/* =========================
//           Summary Cards
//       ========================= */}

//       <div className="summary-card">
//         <h3>📦 Inventory Items</h3>

//         <p>
//           {filteredInventory.length}
//         </p>
//       </div>

//       <div className="summary-card">
//         <h3>⚠️ Low Stock Items</h3>

//         <p>
//           {
//             filteredInventory.filter(
//               (item) =>
//                 item.status ===
//                 "LOW STOCK"
//             ).length
//           }
//         </p>
//       </div>

//       {/* Loyalty card only for Manager */}
//       {role === "manager" && (
//         <>
//           <div className="summary-card">
//             <h3>
//               👥 Loyalty Members
//             </h3>

//             <p>
//               {loyalty.length}
//             </p>
//           </div>

//           <div className="summary-card">
//             <h3>
//               🎯 Total Loyalty Points
//             </h3>

//             <p>
//               {loyalty.reduce(
//                 (total, member) =>
//                   total +
//                   member.points_balance,
//                 0
//               )}
//             </p>
//           </div>
//         </>
//       )}

//       {/* =========================
//           Low Stock Count
//       ========================= */}

//       <p>
//         Low Stock Items:{" "}
//         {
//           filteredInventory.filter(
//             (item) =>
//               item.status ===
//               "LOW STOCK"
//           ).length
//         }
//       </p>

//       {/* =========================
//           Low Stock Alerts
//       ========================= */}

//       <div className="alert-section">

//         <h3>
//           ⚠️ Low Stock Alerts
//         </h3>

//         <ul>
//           {filteredInventory
//             .filter(
//               (item) =>
//                 item.status ===
//                 "LOW STOCK"
//             )
//             .map((item) => (
//               <li key={item.id}>
//                 {item.ingredient} —{" "}
//                 {item.outlet} —{" "}
//                 {item.quantity} units
//                 remaining
//               </li>
//             ))}
//         </ul>

//       </div>

//       {/* Refresh Inventory */}
//       <button onClick={fetchInventory}>
//         🔄 Refresh Inventory
//       </button>

//       {/* =========================
//           Staff Add Inventory
//       ========================= */}

//       {role === "staff" && (
//         <div>

//           <br />

//           <button
//             onClick={() =>
//               setShowAddItem(
//                 !showAddItem
//               )
//             }
//           >
//             ➕ Add Inventory Item
//           </button>

//           {showAddItem && (
//             <div className="reorder-form">

//               <h3>
//                 ➕ Add New Inventory Item
//               </h3>

//               <label>
//                 Ingredient:
//               </label>

//               <br />

//               <input
//                 type="text"
//                 placeholder="Enter ingredient"
//                 value={newIngredient}
//                 onChange={(e) =>
//                   setNewIngredient(
//                     e.target.value
//                   )
//                 }
//               />

//               <br />

//               <label>
//                 Outlet:
//               </label>

//               <br />

//               <select
//                 value={newOutlet}
//                 onChange={(e) =>
//                   setNewOutlet(
//                     e.target.value
//                   )
//                 }
//               >
//                 <option value="">
//                   Select Outlet
//                 </option>

//                 {outlets.map((outlet) => (
//                   <option
//                     key={outlet}
//                     value={outlet}
//                   >
//                     {outlet}
//                   </option>
//                 ))}
//               </select>

//               <br />

//               <label>
//                 Quantity:
//               </label>

//               <br />

//               <input
//                 type="number"
//                 min="0"
//                 placeholder="Enter quantity"
//                 value={newQuantity}
//                 onChange={(e) =>
//                   setNewQuantity(
//                     e.target.value
//                   )
//                 }
//               />

//               <br />

//               <label>
//                 Reorder Threshold:
//               </label>

//               <br />

//               <input
//                 type="number"
//                 min="0"
//                 placeholder="Enter reorder threshold"
//                 value={
//                   newReorderThreshold
//                 }
//                 onChange={(e) =>
//                   setNewReorderThreshold(
//                     e.target.value
//                   )
//                 }
//               />

//               <br />

//               <button
//                 onClick={
//                   handleAddInventory
//                 }
//               >
//                 💾 Add Item
//               </button>

//               <button
//                 onClick={() => {
//                   setShowAddItem(false);
//                   setNewIngredient("");
//                   setNewOutlet("");
//                   setNewQuantity("");
//                   setNewReorderThreshold("");
//                 }}
//               >
//                 Cancel
//               </button>

//             </div>
//           )}

//         </div>
//       )}



//             {/* =========================
//           AI Inventory Agent
//       ========================= */}

//       {role === "manager" && (
//         <div className="ai-agent-section">
//           <h2>🤖 AI Inventory Agent</h2>

//           <p>
//             Automatically detect low-stock items and draft reorder requests
//             for manager approval.
//           </p>

//           <button
//             type="button"
//             onClick={runInventoryAgent}
//             disabled={agentLoading}
//           >
//             {agentLoading
//               ? "🤖 Agent Running..."
//               : "🤖 Run AI Inventory Agent"}
//           </button>
//         </div>
//       )}


//       {/* =========================
//           Inventory Table
//       ========================= */}

//       <h2>Inventory</h2>

//       <table>

//         <thead>
//           <tr>
//             <th>Ingredient</th>
//             <th>Outlet</th>
//             <th>Quantity</th>
//             <th>Reorder Threshold</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>

//         <tbody>

//           {filteredInventory.map(
//             (item) => (
//               <tr key={item.id}>

//                 <td>
//                   {item.ingredient}
//                 </td>

//                 <td>
//                   {item.outlet}
//                 </td>

//                 <td>
//                   {item.quantity}
//                 </td>

//                 <td>
//                   {item.reorder_threshold}
//                 </td>

//                 <td
//                   className={
//                     item.status ===
//                     "OUT OF STOCK"
//                       ? "out-of-stock"
//                       : item.status ===
//                         "LOW STOCK"
//                       ? "low-stock"
//                       : "stock-ok"
//                   }
//                 >
//                   {item.status}
//                 </td>

//                 <td>

//                   {/* Staff Edit */}
//                   {role === "staff" && (
//                     <button
//                       onClick={() => {
//                         setEditingItem(item);
//                         setEditQuantity(
//                           item.quantity
//                         );
//                       }}
//                     >
//                       ✏️ Edit Stock
//                     </button>
//                   )}

//                   {/* Manager Reorder */}
//                   {role === "manager" &&
//                   (
//                     item.status ===
//                       "LOW STOCK" ||
//                     item.status ===
//                       "OUT OF STOCK"
//                   ) ? (
//                     <button
//                       onClick={() =>
//                         setSelectedItem(
//                           item
//                         )
//                       }
//                     >
//                       🔄 Reorder
//                     </button>
//                   ) : role ===
//                     "manager" ? (
//                     "-"
//                   ) : null}

//                 </td>

//               </tr>
//             )
//           )}

//         </tbody>

//       </table>

//       {/* =========================
//           Staff Edit Stock Form
//       ========================= */}

//       {editingItem &&
//         role === "staff" && (
//           <div className="reorder-form">

//             <h3>
//               ✏️ Update Stock —{" "}
//               {editingItem.ingredient}
//             </h3>

//             <p>
//               Outlet:{" "}
//               <strong>
//                 {editingItem.outlet}
//               </strong>
//             </p>

//             <p>
//               Current Stock:{" "}
//               <strong>
//                 {editingItem.quantity}
//               </strong>
//             </p>

//             <label>
//               New Quantity:
//             </label>

//             <br />

//             <input
//               type="number"
//               min="0"
//               value={editQuantity}
//               onChange={(e) =>
//                 setEditQuantity(
//                   e.target.value
//                 )
//               }
//             />

//             <br />

//             <button
//               onClick={
//                 handleUpdateStock
//               }
//             >
//               💾 Update Stock
//             </button>

//             <button
//               onClick={() => {
//                 setEditingItem(null);
//                 setEditQuantity("");
//               }}
//             >
//               Cancel
//             </button>

//           </div>
//         )}

//       {/* =========================
//           Manager Reorder Form
//       ========================= */}

//       {selectedItem &&
//         role === "manager" && (
//           <div className="reorder-form">

//             <h3>
//               🔄 Reorder{" "}
//               {selectedItem.ingredient}
//             </h3>

//             <p>
//               Outlet:{" "}
//               <strong>
//                 {selectedItem.outlet}
//               </strong>
//             </p>

//             <p>
//               Current Stock:{" "}
//               <strong>
//                 {selectedItem.quantity}
//               </strong>
//             </p>

//             <label>
//               Quantity:
//             </label>

//             <br />

//             <input
//               type="number"
//               min="1"
//               placeholder="Enter quantity"
//               value={reorderQuantity}
//               onChange={(e) =>
//                 setReorderQuantity(
//                   e.target.value
//                 )
//               }
//             />

//             <br />

//             <label>
//               Supplier:
//             </label>

//             <br />

//             <input
//               type="text"
//               placeholder="Enter supplier"
//               value={supplier}
//               onChange={(e) =>
//                 setSupplier(
//                   e.target.value
//                 )
//               }
//             />

//             <br />

//             <button
//               onClick={
//                 handleCreateReorder
//               }
//             >
//               Create Reorder
//             </button>

//             <button
//               onClick={() => {
//                 setSelectedItem(null);
//                 setReorderQuantity("");
//                 setSupplier("");
//               }}
//             >
//               Cancel
//             </button>

//           </div>
//         )}

//       {/* =========================
//           Manager Reorder Requests
//       ========================= */}

//       {role === "manager" && (
//         <>
//           <h2>
//             🔄 Reorder Requests
//           </h2>

//           <table>

//             <thead>
//               <tr>
//                 <th>Ingredient</th>
//                 <th>Outlet</th>
//                 <th>
//                   Quantity Requested
//                 </th>
//                 <th>Supplier</th>
//                 <th>Status</th>
//                 <th>Requested By</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>

//               {filteredReorders.map(
//                 (reorder) => (
//                   <tr
//                     key={reorder.id}
//                   >

//                     <td>
//                       {reorder.ingredient}
//                     </td>

//                     <td>
//                       {reorder.outlet}
//                     </td>

//                     <td>
//                       {
//                         reorder.quantity_requested
//                       }
//                     </td>

//                     <td>
//                       {reorder.supplier}
//                     </td>

//                     <td>{reorder.status}</td>

// <td>{reorder.requested_by}</td>

// <td>
//   {reorder.status === "PENDING" ? (
//     <>
//       <button
//         onClick={() => {
//           axios
//             .put(
//               `http://127.0.0.1:8000/reorders/${reorder.id}`,
//               {
//                 status: "APPROVED",
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             )
//             .then((response) => {
//               alert(
//                 response.data.message ||
//                   "Reorder approved successfully."
//               );

//               fetchReorders(token);
//             })
//             .catch((error) => {
//               console.error(
//                 "Error approving reorder:",
//                 error
//               );

//               alert(
//                 "Failed to approve reorder."
//               );
//             });
//         }}
//       >
//         ✅ Approve
//       </button>

//       <button
//         onClick={() => {
//           axios
//             .put(
//               `http://127.0.0.1:8000/reorders/${reorder.id}`,
//               {
//                 status: "REJECTED",
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                 },
//               }
//             )
//             .then((response) => {
//               alert(
//                 response.data.message ||
//                   "Reorder rejected successfully."
//               );

//               fetchReorders(token);
//             })
//             .catch((error) => {
//               console.error(
//                 "Error rejecting reorder:",
//                 error
//               );

//               alert(
//                 "Failed to reject reorder."
//               );
//             });
//         }}
//       >
//         ❌ Reject
//       </button>
//     </>
//   ) : (
//     "-"
//   )}
// </td>

//                   </tr>
//                 )
//               )}

//             </tbody>

//           </table>
//         </>
//       )}

//       {/* =========================
//           Manager Loyalty Program
//       ========================= */}

//       {role === "manager" && (
//         <>
//           <h2>
//             Loyalty Program
//           </h2>

//           <p>
//             🥈 Silver:{" "}
//             {
//               loyalty.filter(
//                 (member) =>
//                   member.tier ===
//                   "Silver"
//               ).length
//             }{" "}
//             members
//           </p>

//           <p>
//             🥇 Gold:{" "}
//             {
//               loyalty.filter(
//                 (member) =>
//                   member.tier ===
//                   "Gold"
//               ).length
//             }{" "}
//             members
//           </p>

//           <p>
//             🏆 Platinum:{" "}
//             {
//               loyalty.filter(
//                 (member) =>
//                   member.tier ===
//                   "Platinum"
//               ).length
//             }{" "}
//             members
//           </p>

//           <p>
//             🎯 Total Loyalty Points:{" "}
//             {loyalty.reduce(
//               (total, member) =>
//                 total +
//                 member.points_balance,
//               0
//             )}
//           </p>

//           <table>

//             <thead>
//               <tr>
//                 <th>Member</th>
//                 <th>Points</th>
//                 <th>Tier</th>
//               </tr>
//             </thead>

//             <tbody>

//               {loyalty.map(
//                 (member) => (
//                   <tr
//                     key={member.id}
//                   >

//                     <td>
//                       {member.member_name}
//                     </td>

//                     <td>
//                       {
//                         member.points_balance
//                       }
//                     </td>

//                     <td>
//                       {member.tier}
//                     </td>

//                   </tr>
//                 )
//               )}

//             </tbody>

//           </table>
//         </>
//       )}

//     </div>
//   );
// }

// export default App;




import { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";
import StaffLogin from "./StaffLogin";
import { API_URL } from "./config";
import "./App.css";

function App() {
  // =========================================================
  // STATE
  // =========================================================

  const [inventory, setInventory] = useState([]);
  const [loyalty, setLoyalty] = useState([]);
  const [reorders, setReorders] = useState([]);
  const [agentLoading, setAgentLoading] = useState(false);

  const [selectedOutlet, setSelectedOutlet] =
    useState("All Outlets");

  const [selectedItem, setSelectedItem] = useState(null);

  const [reorderQuantity, setReorderQuantity] =
    useState("");

  const [supplier, setSupplier] = useState("");

  // Staff stock editing
  const [editingItem, setEditingItem] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  // Staff add inventory
  const [showAddItem, setShowAddItem] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newOutlet, setNewOutlet] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newReorderThreshold, setNewReorderThreshold] =
    useState("");

  // Login
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [outlets, setOutlets] = useState([]);
  const [showLogin, setShowLogin] = useState(false);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleStaffLogin = (data) => {
    setToken(data.access_token);
    setRole(data.role);
    setUsername(data.username);
    setShowLogin(false);

    if (data.role === "manager") {
      fetchReorders(data.access_token);
    } else {
      setReorders([]);
    }
  };

  // =========================================================
  // FETCH INVENTORY
  // =========================================================

  const fetchInventory = () => {
    axios
      .get(`${API_URL}/inventory`)
      .then((response) => {
        setInventory(response.data.inventory);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
      });
  };

  // =========================================================
  // FETCH LOYALTY
  // =========================================================

  const fetchLoyalty = () => {
    axios
      .get(`${API_URL}/loyalty`)
      .then((response) => {
        setLoyalty(response.data.loyalty);
      })
      .catch((error) => {
        console.error("Error fetching loyalty data:", error);
      });
  };

  // =========================================================
  // FETCH REORDERS
  // =========================================================

  const fetchReorders = (authToken) => {
    axios
      .get(`${API_URL}/reorders`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
      .then((response) => {
        setReorders(response.data.reorders);
      })
      .catch((error) => {
        console.error(
          "Error fetching reorder requests:",
          error
        );
      });
  };

  // =========================================================
  // FETCH OUTLETS
  // =========================================================

  const fetchOutlets = () => {
    axios
      .get(`${API_URL}/outlets`)
      .then((response) => {
        setOutlets(response.data.outlets);
      })
      .catch((error) => {
        console.error("Error fetching outlets:", error);
      });
  };

  // =========================================================
  // AI INVENTORY AGENT
  // =========================================================

  const runInventoryAgent = () => {
    if (!token) {
      alert("Please login as a manager first.");
      return;
    }

    setAgentLoading(true);

    axios
      .post(
        `${API_URL}/ai/inventory-agent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const created =
          response.data.created_requests || [];

        if (created.length === 0) {
          alert(
            "AI Agent completed. No new reorder requests were created."
          );
        } else {
          alert(
            `AI Agent created ${created.length} new reorder request(s).`
          );
        }

        fetchReorders(token);
        fetchInventory();
      })
      .catch((error) => {
        console.error(
          "AI Inventory Agent error:",
          error
        );

        alert(
          error.response?.data?.message ||
            "AI Inventory Agent failed."
        );
      })
      .finally(() => {
        setAgentLoading(false);
      });
  };

  // =========================================================
  // ADD INVENTORY
  // =========================================================

  const handleAddInventory = () => {
    if (
      !newIngredient ||
      !newOutlet ||
      newQuantity === "" ||
      newReorderThreshold === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    axios
      .post(`${API_URL}/inventory`, {
        ingredient: newIngredient,
        outlet: newOutlet,
        quantity: Number(newQuantity),
        reorder_threshold: Number(newReorderThreshold),
      })
      .then((response) => {
        alert(
          response.data.message ||
            "Inventory item added successfully."
        );

        setNewIngredient("");
        setNewOutlet("");
        setNewQuantity("");
        setNewReorderThreshold("");
        setShowAddItem(false);

        fetchInventory();
      })
      .catch((error) => {
        console.error(
          "Error adding inventory:",
          error
        );

        if (error.response) {
          alert(
            error.response.data.message ||
              "Failed to add inventory item."
          );
        } else {
          alert("Failed to add inventory item.");
        }
      });
  };

  // =========================================================
  // UPDATE STOCK
  // =========================================================

  const handleUpdateStock = () => {
    if (editQuantity === "") {
      alert("Please enter a quantity.");
      return;
    }

    axios
      .put(
        `${API_URL}/inventory/${editingItem.id}`,
        {
          quantity: Number(editQuantity),
          reorder_threshold:
            editingItem.reorder_threshold,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(
          response.data.message ||
            "Stock updated successfully."
        );

        setEditingItem(null);
        setEditQuantity("");

        fetchInventory();
      })
      .catch((error) => {
        console.error(
          "Error updating stock:",
          error
        );

        if (error.response) {
          alert(
            error.response.data.message ||
              "Failed to update stock."
          );
        } else {
          alert("Failed to update stock.");
        }
      });
  };

  // =========================================================
  // CREATE REORDER
  // =========================================================

  const handleCreateReorder = () => {
    if (!reorderQuantity || !supplier) {
      alert("Please enter quantity and supplier.");
      return;
    }

    axios
      .post(
        `${API_URL}/reorders`,
        {
          inventory_id: selectedItem.id,
          quantity_requested: Number(reorderQuantity),
          supplier: supplier,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(response.data.message);

        setSelectedItem(null);
        setReorderQuantity("");
        setSupplier("");

        fetchReorders(token);
      })
      .catch((error) => {
        console.error(
          "Error creating reorder:",
          error
        );

        alert("Failed to create reorder request");
      });
  };

  // =========================================================
  // APPROVE / REJECT REORDER
  // =========================================================

  const updateReorderStatus = (reorderId, status) => {
    axios
      .put(
        `${API_URL}/reorders/${reorderId}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(
          response.data.message ||
            `Reorder ${status.toLowerCase()} successfully.`
        );

        fetchReorders(token);
      })
      .catch((error) => {
        console.error(
          `Error updating reorder:`,
          error
        );

        alert(
          `Failed to ${status.toLowerCase()} reorder.`
        );
      });
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    fetchInventory();
    fetchLoyalty();
    fetchOutlets();
  }, []);

  // =========================================================
  // FILTERS
  // =========================================================

  const filteredInventory =
    selectedOutlet === "All Outlets"
      ? inventory
      : inventory.filter(
          (item) => item.outlet === selectedOutlet
        );

  const filteredReorders =
    selectedOutlet === "All Outlets"
      ? reorders
      : reorders.filter(
          (reorder) =>
            reorder.outlet === selectedOutlet
        );

  // =========================================================
  // DASHBOARD NUMBERS
  // =========================================================

  const lowStockCount = filteredInventory.filter(
    (item) => item.status === "LOW STOCK"
  ).length;

  const outOfStockCount = filteredInventory.filter(
    (item) => item.status === "OUT OF STOCK"
  ).length;

  const stockOkCount = filteredInventory.filter(
    (item) => item.status === "STOCK OK"
  ).length;

  const pendingReorders = filteredReorders.filter(
    (reorder) => reorder.status === "PENDING"
  ).length;

  const totalPoints = loyalty.reduce(
    (total, member) =>
      total + member.points_balance,
    0
  );

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    setToken("");
    setRole("");
    setUsername("");

    setSelectedItem(null);
    setReorderQuantity("");
    setSupplier("");

    setEditingItem(null);
    setEditQuantity("");

    setShowAddItem(false);
    setReorders([]);
  };

  // =========================================================
  // LOGIN SCREEN
  // =========================================================

  if (showLogin) {
    return (
      <StaffLogin
        onLogin={handleStaffLogin}
      />
    );
  }

  // =========================================================
  // PUBLIC MENU
  // =========================================================

  if (!role) {
    return (
      <Menu
        onStaffLogin={() =>
          setShowLogin(true)
        }
      />
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="dashboard-navbar">

        <div className="dashboard-brand">
          <div className="dashboard-brand-icon">
            M
          </div>

          <div>
            <h1>Meridian</h1>
            <span>Kitchens Collective</span>
          </div>
        </div>

        <div className="dashboard-user">

          <div className="dashboard-user-info">
            <span>Welcome back</span>

            <strong>
              {username}
            </strong>

            <small>
              {role === "manager"
                ? "Manager"
                : "Staff"}
            </small>
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="dashboard-main">

        {/* PAGE HEADER */}

        <section className="dashboard-header">

          <div>
            <span className="dashboard-eyebrow">
              OPERATIONS CENTER
            </span>

            <h2>
              {role === "manager"
                ? "Manager Dashboard"
                : "Staff Dashboard"}
            </h2>

            <p>
              {role === "manager"
                ? "Monitor inventory, manage replenishment and track loyalty performance."
                : "Monitor outlet inventory and keep stock levels updated."}
            </p>
          </div>

          <div className="dashboard-date">
            <span>LIVE STATUS</span>
            <strong>● System Online</strong>
          </div>

        </section>


        {/* ===================================================
            OUTLET FILTER
        =================================================== */}

        <section className="dashboard-toolbar">

          <div className="toolbar-title">
            <span className="toolbar-icon">
              ◉
            </span>

            <div>
              <span>VIEWING OUTLET</span>

              <strong>
                {selectedOutlet}
              </strong>
            </div>
          </div>

          <div className="toolbar-select">

            <label>
              Select Outlet
            </label>

            <select
              value={selectedOutlet}
              onChange={(e) =>
                setSelectedOutlet(
                  e.target.value
                )
              }
            >
              <option value="All Outlets">
                All Outlets
              </option>

              {outlets.map((outlet) => (
                <option
                  key={outlet}
                  value={outlet}
                >
                  {outlet}
                </option>
              ))}
            </select>

          </div>

        </section>


        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <section className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📦
            </div>

            <div className="stat-content">
              <span>INVENTORY ITEMS</span>

              <strong>
                {filteredInventory.length}
              </strong>

              <small>
                Current stock records
              </small>
            </div>

          </div>


          <div className="stat-card warning">

            <div className="stat-icon">
              ⚠
            </div>

            <div className="stat-content">
              <span>LOW STOCK</span>

              <strong>
                {lowStockCount}
              </strong>

              <small>
                Items need attention
              </small>
            </div>

          </div>


          <div className="stat-card danger">

            <div className="stat-icon">
              !
            </div>

            <div className="stat-content">
              <span>OUT OF STOCK</span>

              <strong>
                {outOfStockCount}
              </strong>

              <small>
                Immediate action required
              </small>
            </div>

          </div>


          {role === "manager" && (
            <div className="stat-card premium">

              <div className="stat-icon">
                ✦
              </div>

              <div className="stat-content">
                <span>LOYALTY MEMBERS</span>

                <strong>
                  {loyalty.length}
                </strong>

                <small>
                  Active members
                </small>
              </div>

            </div>
          )}

        </section>


        {/* ===================================================
            INVENTORY HEALTH
        =================================================== */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>
              <span className="panel-eyebrow">
                STOCK MANAGEMENT
              </span>

              <h3>
                Inventory Health
              </h3>

              <p>
                Real-time ingredient availability
                across the selected outlet.
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={fetchInventory}
            >
              ↻ Refresh
            </button>

          </div>


          {/* STOCK MINI SUMMARY */}

          <div className="stock-summary">

            <div>
              <span className="stock-dot healthy"></span>
              <strong>{stockOkCount}</strong>
              <small>Stock OK</small>
            </div>

            <div>
              <span className="stock-dot low"></span>
              <strong>{lowStockCount}</strong>
              <small>Low Stock</small>
            </div>

            <div>
              <span className="stock-dot empty"></span>
              <strong>{outOfStockCount}</strong>
              <small>Out of Stock</small>
            </div>

          </div>


          {/* INVENTORY TABLE */}

          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Outlet</th>
                  <th>Quantity</th>
                  <th>Threshold</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredInventory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="empty-table"
                    >
                      No inventory items found.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map(
                    (item) => (
                      <tr key={item.id}>

                        <td>
                          <div className="ingredient-cell">
                            <span className="ingredient-icon">
                              ◇
                            </span>

                            <strong>
                              {item.ingredient}
                            </strong>
                          </div>
                        </td>

                        <td>
                          <span className="outlet-badge">
                            {item.outlet}
                          </span>
                        </td>

                        <td>
                          <strong className="quantity-value">
                            {item.quantity}
                          </strong>
                        </td>

                        <td>
                          {item.reorder_threshold}
                        </td>

                        <td>

                          <span
                            className={
                              `status-badge ${
                                item.status ===
                                "OUT OF STOCK"
                                  ? "status-danger"
                                  : item.status ===
                                    "LOW STOCK"
                                  ? "status-warning"
                                  : "status-success"
                              }`
                            }
                          >
                            <span>●</span>
                            {item.status}
                          </span>

                        </td>

                        <td>

                          {role === "staff" && (
                            <button
                              className="table-action-button"
                              onClick={() => {
                                setEditingItem(item);
                                setEditQuantity(
                                  item.quantity
                                );
                              }}
                            >
                              ✎ Edit Stock
                            </button>
                          )}


                          {role === "manager" &&
                          (
                            item.status ===
                              "LOW STOCK" ||
                            item.status ===
                              "OUT OF STOCK"
                          ) ? (
                            <button
                              className="table-action-button reorder-action"
                              onClick={() =>
                                setSelectedItem(
                                  item
                                )
                              }
                            >
                              ↻ Reorder
                            </button>
                          ) : role ===
                            "manager" ? (
                            <span className="no-action">
                              —
                            </span>
                          ) : null}

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>


        {/* ===================================================
            STAFF SECTION
        =================================================== */}

        {role === "staff" && (
          <section className="staff-tools-panel">

            <div className="section-title-row">

              <div>
                <span className="panel-eyebrow">
                  STAFF TOOLS
                </span>

                <h3>
                  Inventory Operations
                </h3>
              </div>

              <button
                className="primary-dashboard-button"
                onClick={() =>
                  setShowAddItem(
                    !showAddItem
                  )
                }
              >
                + Add Inventory Item
              </button>

            </div>


            {/* ADD INVENTORY */}

            {showAddItem && (
              <div className="operation-form">

                <div className="form-heading">
                  <span>+</span>

                  <div>
                    <h4>
                      Add New Inventory Item
                    </h4>

                    <p>
                      Create a stock record for an outlet.
                    </p>
                  </div>
                </div>


                <div className="form-grid">

                  <div className="form-field">
                    <label>
                      Ingredient
                    </label>

                    <input
                      type="text"
                      placeholder="Enter ingredient"
                      value={newIngredient}
                      onChange={(e) =>
                        setNewIngredient(
                          e.target.value
                        )
                      }
                    />
                  </div>


                  <div className="form-field">
                    <label>
                      Outlet
                    </label>

                    <select
                      value={newOutlet}
                      onChange={(e) =>
                        setNewOutlet(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Outlet
                      </option>

                      {outlets.map(
                        (outlet) => (
                          <option
                            key={outlet}
                            value={outlet}
                          >
                            {outlet}
                          </option>
                        )
                      )}
                    </select>
                  </div>


                  <div className="form-field">
                    <label>
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={newQuantity}
                      onChange={(e) =>
                        setNewQuantity(
                          e.target.value
                        )
                      }
                    />
                  </div>


                  <div className="form-field">
                    <label>
                      Reorder Threshold
                    </label>

                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={
                        newReorderThreshold
                      }
                      onChange={(e) =>
                        setNewReorderThreshold(
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>


                <div className="form-actions">

                  <button
                    className="primary-dashboard-button"
                    onClick={
                      handleAddInventory
                    }
                  >
                    Save Item
                  </button>

                  <button
                    className="secondary-dashboard-button"
                    onClick={() => {
                      setShowAddItem(false);
                      setNewIngredient("");
                      setNewOutlet("");
                      setNewQuantity("");
                      setNewReorderThreshold("");
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}


            {/* EDIT STOCK */}

            {editingItem && (
              <div className="operation-form edit-form">

                <div className="form-heading">

                  <span>✎</span>

                  <div>
                    <h4>
                      Update Stock
                    </h4>

                    <p>
                      {editingItem.ingredient} ·{" "}
                      {editingItem.outlet}
                    </p>
                  </div>

                </div>


                <div className="current-stock-display">

                  <span>
                    Current Stock
                  </span>

                  <strong>
                    {editingItem.quantity}
                  </strong>

                </div>


                <div className="form-field">

                  <label>
                    New Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={editQuantity}
                    onChange={(e) =>
                      setEditQuantity(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="form-actions">

                  <button
                    className="primary-dashboard-button"
                    onClick={
                      handleUpdateStock
                    }
                  >
                    Update Stock
                  </button>

                  <button
                    className="secondary-dashboard-button"
                    onClick={() => {
                      setEditingItem(null);
                      setEditQuantity("");
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </section>
        )}


        {/* ===================================================
            MANAGER AI AGENT
        =================================================== */}

        {role === "manager" && (
          <section className="ai-agent-dashboard">

            <div className="ai-agent-content">

              <div className="ai-agent-icon">
                ✦
              </div>

              <div className="ai-agent-text">

                <span className="panel-eyebrow">
                  INTELLIGENT OPERATIONS
                </span>

                <h3>
                  AI Inventory Agent
                </h3>

                <p>
                  Automatically detect low-stock
                  ingredients and draft reorder
                  requests for manager approval.
                </p>

              </div>

              <button
                className="ai-agent-button"
                type="button"
                onClick={runInventoryAgent}
                disabled={agentLoading}
              >
                {agentLoading
                  ? "Agent Running..."
                  : "Run AI Agent →"}
              </button>

            </div>

          </section>
        )}


        {/* ===================================================
            MANAGER REORDER FORM
        =================================================== */}

        {role === "manager" &&
          selectedItem && (
            <section className="dashboard-panel reorder-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    PROCUREMENT
                  </span>

                  <h3>
                    Create Reorder Request
                  </h3>

                  <p>
                    Request replenishment for{" "}
                    <strong>
                      {selectedItem.ingredient}
                    </strong>{" "}
                    at {selectedItem.outlet}.
                  </p>
                </div>

              </div>


              <div className="reorder-info">

                <div>
                  <span>Ingredient</span>
                  <strong>
                    {selectedItem.ingredient}
                  </strong>
                </div>

                <div>
                  <span>Outlet</span>
                  <strong>
                    {selectedItem.outlet}
                  </strong>
                </div>

                <div>
                  <span>Current Stock</span>
                  <strong>
                    {selectedItem.quantity}
                  </strong>
                </div>

              </div>


              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Quantity Requested
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={reorderQuantity}
                    onChange={(e) =>
                      setReorderQuantity(
                        e.target.value
                      )
                    }
                  />

                </div>


                <div className="form-field">

                  <label>
                    Supplier
                  </label>

                  <input
                    type="text"
                    placeholder="Enter supplier"
                    value={supplier}
                    onChange={(e) =>
                      setSupplier(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>


              <div className="form-actions">

                <button
                  className="primary-dashboard-button"
                  onClick={
                    handleCreateReorder
                  }
                >
                  Create Request
                </button>

                <button
                  className="secondary-dashboard-button"
                  onClick={() => {
                    setSelectedItem(null);
                    setReorderQuantity("");
                    setSupplier("");
                  }}
                >
                  Cancel
                </button>

              </div>

            </section>
          )}


        {/* ===================================================
            MANAGER REORDER REQUESTS
        =================================================== */}

        {role === "manager" && (
          <section className="dashboard-panel">

            <div className="panel-header">

              <div>
                <span className="panel-eyebrow">
                  PROCUREMENT
                </span>

                <h3>
                  Reorder Requests
                </h3>

                <p>
                  Review and approve inventory
                  replenishment requests.
                </p>
              </div>

              <div className="pending-count">
                <strong>
                  {pendingReorders}
                </strong>

                <span>
                  Pending
                </span>
              </div>

            </div>


            <div className="dashboard-table-wrapper">

              <table className="dashboard-table">

                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Outlet</th>
                    <th>Quantity</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredReorders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="empty-table"
                      >
                        No reorder requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredReorders.map(
                      (reorder) => (
                        <tr
                          key={reorder.id}
                        >

                          <td>
                            <strong>
                              {reorder.ingredient}
                            </strong>
                          </td>

                          <td>
                            <span className="outlet-badge">
                              {reorder.outlet}
                            </span>
                          </td>

                          <td>
                            <strong>
                              {reorder.quantity_requested}
                            </strong>
                          </td>

                          <td>
                            {reorder.supplier}
                          </td>

                          <td>

                            <span
                              className={
                                `status-badge ${
                                  reorder.status ===
                                  "PENDING"
                                    ? "status-warning"
                                    : reorder.status ===
                                      "APPROVED"
                                    ? "status-success"
                                    : "status-danger"
                                }`
                              }
                            >
                              <span>●</span>
                              {reorder.status}
                            </span>

                          </td>

                          <td>
                            {reorder.requested_by}
                          </td>

                          <td>

                            {reorder.status ===
                            "PENDING" ? (
                              <div className="request-actions">

                                <button
                                  className="approve-button"
                                  onClick={() =>
                                    updateReorderStatus(
                                      reorder.id,
                                      "APPROVED"
                                    )
                                  }
                                >
                                  ✓
                                </button>

                                <button
                                  className="reject-button"
                                  onClick={() =>
                                    updateReorderStatus(
                                      reorder.id,
                                      "REJECTED"
                                    )
                                  }
                                >
                                  ×
                                </button>

                              </div>
                            ) : (
                              <span className="no-action">
                                —
                              </span>
                            )}

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}


        {/* ===================================================
            MANAGER LOYALTY
        =================================================== */}

        {role === "manager" && (
          <section className="loyalty-dashboard">

            <div className="panel-header">

              <div>
                <span className="panel-eyebrow">
                  MEMBER EXPERIENCE
                </span>

                <h3>
                  Loyalty Program
                </h3>

                <p>
                  Monitor member tiers and points
                  performance.
                </p>
              </div>

              <div className="loyalty-total">

                <span>
                  TOTAL POINTS
                </span>

                <strong>
                  {totalPoints.toLocaleString()}
                </strong>

              </div>

            </div>


            {/* LOYALTY TIER CARDS */}

            <div className="loyalty-tier-grid">

              <div className="tier-card silver-tier">

                <span className="tier-icon">
                  🥈
                </span>

                <div>
                  <span>Silver</span>

                  <strong>
                    {
                      loyalty.filter(
                        (member) =>
                          member.tier ===
                          "Silver"
                      ).length
                    }
                  </strong>

                  <small>
                    Members
                  </small>
                </div>

              </div>


              <div className="tier-card gold-tier">

                <span className="tier-icon">
                  🥇
                </span>

                <div>
                  <span>Gold</span>

                  <strong>
                    {
                      loyalty.filter(
                        (member) =>
                          member.tier ===
                          "Gold"
                      ).length
                    }
                  </strong>

                  <small>
                    Members
                  </small>
                </div>

              </div>


              <div className="tier-card platinum-tier">

                <span className="tier-icon">
                  🏆
                </span>

                <div>
                  <span>Platinum</span>

                  <strong>
                    {
                      loyalty.filter(
                        (member) =>
                          member.tier ===
                          "Platinum"
                      ).length
                    }
                  </strong>

                  <small>
                    Members
                  </small>
                </div>

              </div>

            </div>


            {/* LOYALTY TABLE */}

            <div className="dashboard-table-wrapper">

              <table className="dashboard-table loyalty-table">

                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Points Balance</th>
                    <th>Tier</th>
                  </tr>
                </thead>

                <tbody>

                  {loyalty.map(
                    (member) => (
                      <tr
                        key={member.id}
                      >

                        <td>
                          <div className="member-cell">

                            <span className="member-avatar">
                              {member.member_name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </span>

                            <strong>
                              {member.member_name}
                            </strong>

                          </div>
                        </td>

                        <td>
                          <strong>
                            {member.points_balance.toLocaleString()}
                          </strong>
                        </td>

                        <td>

                          <span
                            className={
                              `tier-badge ${
                                member.tier
                                  .toLowerCase()
                              }`
                            }
                          >
                            {member.tier}
                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="dashboard-footer">

        <div>
          <strong>
            MERIDIAN KITCHENS COLLECTIVE
          </strong>

          <span>
            Operations Management Platform
          </span>
        </div>

        <span>
          {role === "manager"
            ? "Manager Access"
            : "Staff Access"}
        </span>

      </footer>

    </div>
  );
}

export default App;