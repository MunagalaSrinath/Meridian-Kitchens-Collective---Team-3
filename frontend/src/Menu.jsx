import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
function Menu({ onStaffLogin }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState("All Outlets");

  // AI Assistant states
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");

  useEffect(() => {
    console.log("MENU ITEMS:", menuItems);

    axios
      .get("http://127.0.0.1:8000/menu")
      .then((response) => {
        setMenuItems(response.data.menu);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      });

    axios
      .get("http://127.0.0.1:8000/outlets")
      .then((response) => {
        setOutlets(response.data.outlets);
      })
      .catch((error) => {
        console.error("Error fetching outlets:", error);
      });
  }, []);

  // AI Assistant
  const handleAskAI = () => {
    if (!aiQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/ai/menu-assistant", {
        question: aiQuestion,
      })
      .then((response) => {
        setAiAnswer(response.data.answer);
      })
      .catch((error) => {
        console.error("AI Assistant error:", error);
        setAiAnswer(
          "Sorry, I could not process your question."
        );
      });
  };

  // Filter menu items based on selected outlet
  const filteredMenuItems =
    selectedOutlet === "All Outlets"
      ? menuItems
      : menuItems.filter(
          (item) => item.outlet === selectedOutlet
        );

  // Display individual menu item
  const renderMenuItem = (item) => (
    <div className="menu-item" key={item.id}>
      <div>
        <h4>{item.name}</h4>

        <p>{item.description}</p>
      </div>

      <div>
        <strong>₹{item.price}</strong>

        <br />

        <button
          type="button"
          onClick={() => {
            setSelectedItem(item);
          }}
        >
          🔍 View Ingredients & Allergens
        </button>
      </div>

      {selectedItem && selectedItem.id === item.id && (
        <div className="menu-details">
          <h4>🔎 {item.name} Details</h4>

          <p>
            <strong>Ingredients:</strong>
            <br />
            {item.ingredients}
          </p>

          <p>
            <strong>Allergens:</strong>
            <br />
            {item.allergens}
          </p>

          <p>
            <strong>Outlet:</strong> {item.outlet}
          </p>

          <button
            type="button"
            onClick={() => setSelectedItem(null)}
          >
            ✖ Close
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>

      {/* AI Assistant */}
      <div className="ai-assistant">
        <h2>🤖 Meridian AI Assistant</h2>

        <p>
          Ask me about menu items, ingredients, or allergens.
        </p>

        <input
          type="text"
          placeholder="Example: Show me nut-free food"
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
        />

        <button
          type="button"
          onClick={handleAskAI}
        >
          Ask AI
        </button>

        {aiAnswer && (
          <div className="ai-answer">
            <h3>🤖 AI Response</h3>

            <ReactMarkdown>{aiAnswer}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Main Menu Page */}
      <div className="menu-page">

        {/* Header */}
        <header className="menu-header">
          <h1>🍽️ Meridian Kitchens</h1>

          <p>
            Fresh food. Great taste. Every outlet.
          </p>
        </header>

        {/* Navigation */}
        <nav className="menu-nav">

          <a href="#home">
            🏠 Home
          </a>

          <a href="#menu">
            📋 Menu
          </a>

          <a href="#about">
            ℹ️ About Us
          </a>

          <button
            type="button"
            onClick={onStaffLogin}
          >
            🔐 Staff Login
          </button>

        </nav>

        {/* Welcome Section */}
        <section
          id="home"
          className="menu-welcome"
        >
          <h2>
            Welcome to Meridian Kitchens
          </h2>

          <p>
            Explore delicious dishes from our restaurant concepts.
          </p>
        </section>

        {/* Menu Section */}
        <section id="menu">

          <h2>📋 Our Menu</h2>

          {/* Outlet Selector */}
          <div className="menu-outlet-selector">

            <label>
              Select Outlet:{" "}
            </label>

            <select
              value={selectedOutlet}
              onChange={(e) =>
                setSelectedOutlet(e.target.value)
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

          {/* Loading / Menu */}
          {menuItems.length === 0 ? (

            <p>
              Loading menu...
            </p>

          ) : (

            <>

              {/* Main Course */}
              <div className="menu-section">

                <h3>
                  🍛 Main Course
                </h3>

                {filteredMenuItems
                  .filter(
                    (item) =>
                      item.category === "Main Course"
                  )
                  .map(renderMenuItem)}

              </div>

              {/* Starters */}
              <div className="menu-section">

                <h3>
                  🥗 Starters
                </h3>

                {filteredMenuItems
                  .filter(
                    (item) =>
                      item.category === "Starters"
                  )
                  .map(renderMenuItem)}

              </div>

              {/* Desserts */}
              <div className="menu-section">

                <h3>
                  🍰 Desserts
                </h3>

                {filteredMenuItems
                  .filter(
                    (item) =>
                      item.category === "Desserts"
                  )
                  .map(renderMenuItem)}

              </div>

            </>

          )}

        </section>

        {/* About Section */}
        <section
          id="about"
          className="menu-about"
        >

          <h2>
            ℹ️ About Meridian Kitchens
          </h2>

          <p>
            Meridian Kitchens Collective brings
            multiple restaurant concepts together
            through a shared kitchen and hospitality
            experience.
          </p>

        </section>

      </div>

    </div>
  );
}

export default Menu;