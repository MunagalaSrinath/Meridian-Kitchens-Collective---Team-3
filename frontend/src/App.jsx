import { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./Menu";
import StaffLogin from "./StaffLogin";

import "./App.css";

function App() {
  // -----------------------------
  // State
  // -----------------------------
  const [inventory, setInventory] = useState([]);
  const [loyalty, setLoyalty] = useState([]);
  const [reorders, setReorders] = useState([]);

  const [selectedOutlet, setSelectedOutlet] =
    useState("All Outlets");

  const [selectedItem, setSelectedItem] = useState(null);

  const [reorderQuantity, setReorderQuantity] =
    useState("");

  const [supplier, setSupplier] = useState("");

  // Staff stock editing
  const [editingItem, setEditingItem] =
    useState(null);

  const [editQuantity, setEditQuantity] =
    useState("");

  // Staff add inventory
  const [showAddItem, setShowAddItem] =
    useState(false);

  const [newIngredient, setNewIngredient] =
    useState("");

  const [newOutlet, setNewOutlet] =
    useState("");

  const [newQuantity, setNewQuantity] =
    useState("");

  const [newReorderThreshold, setNewReorderThreshold] =
    useState("");

  // Login
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [token, setToken] =
    useState("");

  const [role, setRole] =
    useState("");

  const [outlets, setOutlets] =
    useState([]);

  const [showLogin, setShowLogin] =
    useState(false);

  // -----------------------------
  // Staff / Manager Login
  // -----------------------------
  const handleStaffLogin = (data) => {
    setToken(data.access_token);
    setRole(data.role);
    setUsername(data.username);
    setShowLogin(false);

    // Managers can view reorder requests
    if (data.role === "manager") {
      fetchReorders(data.access_token);
    } else {
      setReorders([]);
    }
  };

  // -----------------------------
  // Fetch Inventory
  // -----------------------------
  const fetchInventory = () => {
    axios
      .get("http://127.0.0.1:8000/inventory")
      .then((response) => {
        setInventory(response.data.inventory);
      })
      .catch((error) => {
        console.error(
          "Error fetching inventory:",
          error
        );
      });
  };

  // -----------------------------
  // Fetch Loyalty
  // -----------------------------
  const fetchLoyalty = () => {
    axios
      .get("http://127.0.0.1:8000/loyalty")
      .then((response) => {
        setLoyalty(response.data.loyalty);
      })
      .catch((error) => {
        console.error(
          "Error fetching loyalty data:",
          error
        );
      });
  };

  // -----------------------------
  // Fetch Reorder Requests
  // -----------------------------
  const fetchReorders = (authToken) => {
    axios
      .get(
        "http://127.0.0.1:8000/reorders",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      )
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

  // -----------------------------
  // Fetch Outlets
  // -----------------------------
  const fetchOutlets = () => {
    axios
      .get("http://127.0.0.1:8000/outlets")
      .then((response) => {
        setOutlets(response.data.outlets);
      })
      .catch((error) => {
        console.error(
          "Error fetching outlets:",
          error
        );
      });
  };

  // -----------------------------
  // Add New Inventory Item
  // -----------------------------
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
      .post(
        "http://127.0.0.1:8000/inventory",
        {
          ingredient: newIngredient,
          outlet: newOutlet,
          quantity: Number(newQuantity),
          reorder_threshold:
            Number(newReorderThreshold),
        }
      )
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
          alert(
            "Failed to add inventory item."
          );
        }
      });
  };

  // -----------------------------
  // Update Existing Stock
  // -----------------------------
  const handleUpdateStock = () => {
    if (editQuantity === "") {
      alert("Please enter a quantity.");
      return;
    }

    axios
      .put(
        `http://127.0.0.1:8000/inventory/${editingItem.id}`,
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
          alert(
            "Failed to update stock."
          );
        }
      });
  };

  // -----------------------------
  // Create Reorder
  // -----------------------------
  const handleCreateReorder = () => {
    if (!reorderQuantity || !supplier) {
      alert(
        "Please enter quantity and supplier."
      );
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/reorders",
        {
          inventory_id: selectedItem.id,
          quantity_requested:
            Number(reorderQuantity),
          supplier: supplier,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        alert(
          response.data.message
        );

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

        alert(
          "Failed to create reorder request"
        );
      });
  };

  // -----------------------------
  // Load Data
  // -----------------------------
  useEffect(() => {
    fetchInventory();
    fetchLoyalty();
    fetchOutlets();
  }, []);

  // -----------------------------
  // Filter Inventory
  // -----------------------------
  const filteredInventory =
    selectedOutlet === "All Outlets"
      ? inventory
      : inventory.filter(
          (item) =>
            item.outlet === selectedOutlet
        );

  // -----------------------------
  // Filter Reorders
  // -----------------------------
  const filteredReorders =
    selectedOutlet === "All Outlets"
      ? reorders
      : reorders.filter(
          (reorder) =>
            reorder.outlet === selectedOutlet
        );

  // -----------------------------
  // Screen Navigation
  // -----------------------------

  // Login screen
  if (showLogin) {
    return (
      <StaffLogin
        onLogin={handleStaffLogin}
      />
    );
  }

  // Public menu
  if (!role) {
    return (
      <div>
        <Menu
          onStaffLogin={() =>
            setShowLogin(true)
          }
        />
      </div>
    );
  }

  // -----------------------------
  // Dashboard
  // -----------------------------
  return (
    <div>

      {/* =========================
          User Information
      ========================= */}

      <h1>Meridian Kitchens</h1>

      <p>
        Logged in as:{" "}
        <strong>{username}</strong>{" "}
        (
        <strong>{role}</strong>
        )
      </p>

      <button
        onClick={() => {
          setToken("");
          setRole("");
          setUsername("");
          setPassword("");

          setSelectedItem(null);
          setReorderQuantity("");
          setSupplier("");

          setEditingItem(null);
          setEditQuantity("");

          setShowAddItem(false);

          setReorders([]);
        }}
      >
        🚪 Logout
      </button>

      {/* =========================
          Inventory Dashboard
      ========================= */}

      <h2>Inventory Dashboard</h2>

      {/* Outlet Selector */}
      <div className="outlet-selector">

        <label>
          Select Outlet:{" "}
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

      {/* =========================
          Summary Cards
      ========================= */}

      <div className="summary-card">
        <h3>📦 Inventory Items</h3>

        <p>
          {filteredInventory.length}
        </p>
      </div>

      <div className="summary-card">
        <h3>⚠️ Low Stock Items</h3>

        <p>
          {
            filteredInventory.filter(
              (item) =>
                item.status ===
                "LOW STOCK"
            ).length
          }
        </p>
      </div>

      {/* Loyalty card only for Manager */}
      {role === "manager" && (
        <>
          <div className="summary-card">
            <h3>
              👥 Loyalty Members
            </h3>

            <p>
              {loyalty.length}
            </p>
          </div>

          <div className="summary-card">
            <h3>
              🎯 Total Loyalty Points
            </h3>

            <p>
              {loyalty.reduce(
                (total, member) =>
                  total +
                  member.points_balance,
                0
              )}
            </p>
          </div>
        </>
      )}

      {/* =========================
          Low Stock Count
      ========================= */}

      <p>
        Low Stock Items:{" "}
        {
          filteredInventory.filter(
            (item) =>
              item.status ===
              "LOW STOCK"
          ).length
        }
      </p>

      {/* =========================
          Low Stock Alerts
      ========================= */}

      <div className="alert-section">

        <h3>
          ⚠️ Low Stock Alerts
        </h3>

        <ul>
          {filteredInventory
            .filter(
              (item) =>
                item.status ===
                "LOW STOCK"
            )
            .map((item) => (
              <li key={item.id}>
                {item.ingredient} —{" "}
                {item.outlet} —{" "}
                {item.quantity} units
                remaining
              </li>
            ))}
        </ul>

      </div>

      {/* Refresh Inventory */}
      <button onClick={fetchInventory}>
        🔄 Refresh Inventory
      </button>

      {/* =========================
          Staff Add Inventory
      ========================= */}

      {role === "staff" && (
        <div>

          <br />

          <button
            onClick={() =>
              setShowAddItem(
                !showAddItem
              )
            }
          >
            ➕ Add Inventory Item
          </button>

          {showAddItem && (
            <div className="reorder-form">

              <h3>
                ➕ Add New Inventory Item
              </h3>

              <label>
                Ingredient:
              </label>

              <br />

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

              <br />

              <label>
                Outlet:
              </label>

              <br />

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

                {outlets.map((outlet) => (
                  <option
                    key={outlet}
                    value={outlet}
                  >
                    {outlet}
                  </option>
                ))}
              </select>

              <br />

              <label>
                Quantity:
              </label>

              <br />

              <input
                type="number"
                min="0"
                placeholder="Enter quantity"
                value={newQuantity}
                onChange={(e) =>
                  setNewQuantity(
                    e.target.value
                  )
                }
              />

              <br />

              <label>
                Reorder Threshold:
              </label>

              <br />

              <input
                type="number"
                min="0"
                placeholder="Enter reorder threshold"
                value={
                  newReorderThreshold
                }
                onChange={(e) =>
                  setNewReorderThreshold(
                    e.target.value
                  )
                }
              />

              <br />

              <button
                onClick={
                  handleAddInventory
                }
              >
                💾 Add Item
              </button>

              <button
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
          )}

        </div>
      )}

      {/* =========================
          Inventory Table
      ========================= */}

      <h2>Inventory</h2>

      <table>

        <thead>
          <tr>
            <th>Ingredient</th>
            <th>Outlet</th>
            <th>Quantity</th>
            <th>Reorder Threshold</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredInventory.map(
            (item) => (
              <tr key={item.id}>

                <td>
                  {item.ingredient}
                </td>

                <td>
                  {item.outlet}
                </td>

                <td>
                  {item.quantity}
                </td>

                <td>
                  {item.reorder_threshold}
                </td>

                <td
                  className={
                    item.status ===
                    "OUT OF STOCK"
                      ? "out-of-stock"
                      : item.status ===
                        "LOW STOCK"
                      ? "low-stock"
                      : "stock-ok"
                  }
                >
                  {item.status}
                </td>

                <td>

                  {/* Staff Edit */}
                  {role === "staff" && (
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setEditQuantity(
                          item.quantity
                        );
                      }}
                    >
                      ✏️ Edit Stock
                    </button>
                  )}

                  {/* Manager Reorder */}
                  {role === "manager" &&
                  (
                    item.status ===
                      "LOW STOCK" ||
                    item.status ===
                      "OUT OF STOCK"
                  ) ? (
                    <button
                      onClick={() =>
                        setSelectedItem(
                          item
                        )
                      }
                    >
                      🔄 Reorder
                    </button>
                  ) : role ===
                    "manager" ? (
                    "-"
                  ) : null}

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

      {/* =========================
          Staff Edit Stock Form
      ========================= */}

      {editingItem &&
        role === "staff" && (
          <div className="reorder-form">

            <h3>
              ✏️ Update Stock —{" "}
              {editingItem.ingredient}
            </h3>

            <p>
              Outlet:{" "}
              <strong>
                {editingItem.outlet}
              </strong>
            </p>

            <p>
              Current Stock:{" "}
              <strong>
                {editingItem.quantity}
              </strong>
            </p>

            <label>
              New Quantity:
            </label>

            <br />

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

            <br />

            <button
              onClick={
                handleUpdateStock
              }
            >
              💾 Update Stock
            </button>

            <button
              onClick={() => {
                setEditingItem(null);
                setEditQuantity("");
              }}
            >
              Cancel
            </button>

          </div>
        )}

      {/* =========================
          Manager Reorder Form
      ========================= */}

      {selectedItem &&
        role === "manager" && (
          <div className="reorder-form">

            <h3>
              🔄 Reorder{" "}
              {selectedItem.ingredient}
            </h3>

            <p>
              Outlet:{" "}
              <strong>
                {selectedItem.outlet}
              </strong>
            </p>

            <p>
              Current Stock:{" "}
              <strong>
                {selectedItem.quantity}
              </strong>
            </p>

            <label>
              Quantity:
            </label>

            <br />

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

            <br />

            <label>
              Supplier:
            </label>

            <br />

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

            <br />

            <button
              onClick={
                handleCreateReorder
              }
            >
              Create Reorder
            </button>

            <button
              onClick={() => {
                setSelectedItem(null);
                setReorderQuantity("");
                setSupplier("");
              }}
            >
              Cancel
            </button>

          </div>
        )}

      {/* =========================
          Manager Reorder Requests
      ========================= */}

      {role === "manager" && (
        <>
          <h2>
            🔄 Reorder Requests
          </h2>

          <table>

            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Outlet</th>
                <th>
                  Quantity Requested
                </th>
                <th>Supplier</th>
                <th>Status</th>
                <th>Requested By</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredReorders.map(
                (reorder) => (
                  <tr
                    key={reorder.id}
                  >

                    <td>
                      {reorder.ingredient}
                    </td>

                    <td>
                      {reorder.outlet}
                    </td>

                    <td>
                      {
                        reorder.quantity_requested
                      }
                    </td>

                    <td>
                      {reorder.supplier}
                    </td>

                    <td>{reorder.status}</td>

<td>{reorder.requested_by}</td>

<td>
  {reorder.status === "PENDING" ? (
    <>
      <button
        onClick={() => {
          axios
            .put(
              `http://127.0.0.1:8000/reorders/${reorder.id}`,
              {
                status: "APPROVED",
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
                  "Reorder approved successfully."
              );

              fetchReorders(token);
            })
            .catch((error) => {
              console.error(
                "Error approving reorder:",
                error
              );

              alert(
                "Failed to approve reorder."
              );
            });
        }}
      >
        ✅ Approve
      </button>

      <button
        onClick={() => {
          axios
            .put(
              `http://127.0.0.1:8000/reorders/${reorder.id}`,
              {
                status: "REJECTED",
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
                  "Reorder rejected successfully."
              );

              fetchReorders(token);
            })
            .catch((error) => {
              console.error(
                "Error rejecting reorder:",
                error
              );

              alert(
                "Failed to reject reorder."
              );
            });
        }}
      >
        ❌ Reject
      </button>
    </>
  ) : (
    "-"
  )}
</td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        </>
      )}

      {/* =========================
          Manager Loyalty Program
      ========================= */}

      {role === "manager" && (
        <>
          <h2>
            Loyalty Program
          </h2>

          <p>
            🥈 Silver:{" "}
            {
              loyalty.filter(
                (member) =>
                  member.tier ===
                  "Silver"
              ).length
            }{" "}
            members
          </p>

          <p>
            🥇 Gold:{" "}
            {
              loyalty.filter(
                (member) =>
                  member.tier ===
                  "Gold"
              ).length
            }{" "}
            members
          </p>

          <p>
            🏆 Platinum:{" "}
            {
              loyalty.filter(
                (member) =>
                  member.tier ===
                  "Platinum"
              ).length
            }{" "}
            members
          </p>

          <p>
            🎯 Total Loyalty Points:{" "}
            {loyalty.reduce(
              (total, member) =>
                total +
                member.points_balance,
              0
            )}
          </p>

          <table>

            <thead>
              <tr>
                <th>Member</th>
                <th>Points</th>
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
                      {member.member_name}
                    </td>

                    <td>
                      {
                        member.points_balance
                      }
                    </td>

                    <td>
                      {member.tier}
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>
        </>
      )}

    </div>
  );
}

export default App;