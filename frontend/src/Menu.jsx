// import { useEffect, useState } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// function Menu({ onStaffLogin }) {
//   const [menuItems, setMenuItems] = useState([]);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [outlets, setOutlets] = useState([]);
//   const [selectedOutlet, setSelectedOutlet] = useState("All Outlets");

//   // AI Assistant states
//   const [aiQuestion, setAiQuestion] = useState("");
//   const [aiAnswer, setAiAnswer] = useState("");

//   useEffect(() => {
//     console.log("MENU ITEMS:", menuItems);

//     axios
//       .get("http://127.0.0.1:8000/menu")
//       .then((response) => {
//         setMenuItems(response.data.menu);
//       })
//       .catch((error) => {
//         console.error("Error fetching menu:", error);
//       });

//     axios
//       .get("http://127.0.0.1:8000/outlets")
//       .then((response) => {
//         setOutlets(response.data.outlets);
//       })
//       .catch((error) => {
//         console.error("Error fetching outlets:", error);
//       });
//   }, []);

//   // AI Assistant
//   const handleAskAI = () => {
//     if (!aiQuestion.trim()) {
//       alert("Please enter a question.");
//       return;
//     }

//     axios
//       .post("http://127.0.0.1:8000/ai/menu-assistant", {
//         question: aiQuestion,
//       })
//       .then((response) => {
//         setAiAnswer(response.data.answer);
//       })
//       .catch((error) => {
//         console.error("AI Assistant error:", error);
//         setAiAnswer(
//           "Sorry, I could not process your question."
//         );
//       });
//   };

//   // Filter menu items based on selected outlet
//   const filteredMenuItems =
//     selectedOutlet === "All Outlets"
//       ? menuItems
//       : menuItems.filter(
//           (item) => item.outlet === selectedOutlet
//         );

//   // Display individual menu item
//   const renderMenuItem = (item) => (
//     <div className="menu-item" key={item.id}>
//       <div>
//         <h4>{item.name}</h4>

//         <p>{item.description}</p>
//       </div>

//       <div>
//         <strong>₹{item.price}</strong>

//         <br />

//         <button
//           type="button"
//           onClick={() => {
//             setSelectedItem(item);
//           }}
//         >
//           🔍 View Ingredients & Allergens
//         </button>
//       </div>

//       {selectedItem && selectedItem.id === item.id && (
//         <div className="menu-details">
//           <h4>🔎 {item.name} Details</h4>

//           <p>
//             <strong>Ingredients:</strong>
//             <br />
//             {item.ingredients}
//           </p>

//           <p>
//             <strong>Allergens:</strong>
//             <br />
//             {item.allergens}
//           </p>

//           <p>
//             <strong>Outlet:</strong> {item.outlet}
//           </p>

//           <button
//             type="button"
//             onClick={() => setSelectedItem(null)}
//           >
//             ✖ Close
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div>

//       {/* AI Assistant */}
//       <div className="ai-assistant">
//         <h2>🤖 Meridian AI Assistant</h2>

//         <p>
//           Ask me about menu items, ingredients, or allergens.
//         </p>

//         <input
//           type="text"
//           placeholder="Example: Show me nut-free food"
//           value={aiQuestion}
//           onChange={(e) => setAiQuestion(e.target.value)}
//         />

//         <button
//           type="button"
//           onClick={handleAskAI}
//         >
//           Ask AI
//         </button>

//         {aiAnswer && (
//           <div className="ai-answer">
//             <h3>🤖 AI Response</h3>

//             <ReactMarkdown>{aiAnswer}</ReactMarkdown>
//           </div>
//         )}
//       </div>

//       {/* Main Menu Page */}
//       <div className="menu-page">

//         {/* Header */}
//         <header className="menu-header">
//           <h1>🍽️ Meridian Kitchens</h1>

//           <p>
//             Fresh food. Great taste. Every outlet.
//           </p>
//         </header>

//         {/* Navigation */}
//         <nav className="menu-nav">

//           <a href="#home">
//             🏠 Home
//           </a>

//           <a href="#menu">
//             📋 Menu
//           </a>

//           <a href="#about">
//             ℹ️ About Us
//           </a>

//           <button
//             type="button"
//             onClick={onStaffLogin}
//           >
//             🔐 Staff Login
//           </button>

//         </nav>

//         {/* Welcome Section */}
//         <section
//           id="home"
//           className="menu-welcome"
//         >
//           <h2>
//             Welcome to Meridian Kitchens
//           </h2>

//           <p>
//             Explore delicious dishes from our restaurant concepts.
//           </p>
//         </section>

//         {/* Menu Section */}
//         <section id="menu">

//           <h2>📋 Our Menu</h2>

//           {/* Outlet Selector */}
//           <div className="menu-outlet-selector">

//             <label>
//               Select Outlet:{" "}
//             </label>

//             <select
//               value={selectedOutlet}
//               onChange={(e) =>
//                 setSelectedOutlet(e.target.value)
//               }
//             >

//               <option value="All Outlets">
//                 All Outlets
//               </option>

//               {outlets.map((outlet) => (
//                 <option
//                   key={outlet}
//                   value={outlet}
//                 >
//                   {outlet}
//                 </option>
//               ))}

//             </select>

//           </div>

//           {/* Loading / Menu */}
//           {menuItems.length === 0 ? (

//             <p>
//               Loading menu...
//             </p>

//           ) : (

//             <>

//               {/* Main Course */}
//               <div className="menu-section">

//                 <h3>
//                   🍛 Main Course
//                 </h3>

//                 {filteredMenuItems
//                   .filter(
//                     (item) =>
//                       item.category === "Main Course"
//                   )
//                   .map(renderMenuItem)}

//               </div>

//               {/* Starters */}
//               <div className="menu-section">

//                 <h3>
//                   🥗 Starters
//                 </h3>

//                 {filteredMenuItems
//                   .filter(
//                     (item) =>
//                       item.category === "Starters"
//                   )
//                   .map(renderMenuItem)}

//               </div>

//               {/* Desserts */}
//               <div className="menu-section">

//                 <h3>
//                   🍰 Desserts
//                 </h3>

//                 {filteredMenuItems
//                   .filter(
//                     (item) =>
//                       item.category === "Desserts"
//                   )
//                   .map(renderMenuItem)}

//               </div>

//             </>

//           )}

//         </section>

//         {/* About Section */}
//         <section
//           id="about"
//           className="menu-about"
//         >

//           <h2>
//             ℹ️ About Meridian Kitchens
//           </h2>

//           <p>
//             Meridian Kitchens Collective brings
//             multiple restaurant concepts together
//             through a shared kitchen and hospitality
//             experience.
//           </p>

//         </section>

//       </div>

//     </div>
//   );
// }

// export default Menu;



import { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function Menu({ onStaffLogin }) {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Outlet filter
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState("All Outlets");

  // AI Assistant
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // =========================================================
  // FETCH MENU + OUTLETS
  // =========================================================

  useEffect(() => {
    // Fetch all menu items
    axios
      .get("http://127.0.0.1:8000/menu")
      .then((response) => {
        setMenuItems(response.data.menu || []);
      })
      .catch((error) => {
        console.error("Error fetching menu:", error);
      });

    // Fetch outlets
    axios
      .get("http://127.0.0.1:8000/outlets")
      .then((response) => {
        setOutlets(response.data.outlets || []);
      })
      .catch((error) => {
        console.error("Error fetching outlets:", error);
      });
  }, []);

  // =========================================================
  // AI MENU ASSISTANT
  // =========================================================

  const handleAskAI = () => {
    if (!aiQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }

    setAiLoading(true);
    setAiAnswer("");

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
          "Sorry, I could not process your question right now."
        );
      })
      .finally(() => {
        setAiLoading(false);
      });
  };

  // =========================================================
  // FILTER MENU BY OUTLET
  // =========================================================

  const filteredMenuItems =
    selectedOutlet === "All Outlets"
      ? menuItems
      : menuItems.filter(
          (item) => item.outlet === selectedOutlet
        );

  // =========================================================
  // RENDER INDIVIDUAL MENU ITEM
  // =========================================================

  const renderMenuItem = (item) => (
    <div className="menu-card" key={item.id}>

      {/* Food Visual */}
      <div className="menu-card-image">
        <span>🍽️</span>
      </div>

      {/* Card Content */}
      <div className="menu-card-content">

        <div className="menu-card-top">

          <h3>{item.name}</h3>

          <span className="menu-price">
            ₹{item.price}
          </span>

        </div>

        <p className="menu-description">
          {item.description}
        </p>

        <div className="menu-card-bottom">

          <span className="menu-outlet">
            📍 {item.outlet}
          </span>

          <button
            type="button"
            className="view-dish-btn"
            onClick={() => setSelectedItem(item)}
          >
            View Dish →
          </button>

        </div>

      </div>
    </div>
  );

  // =========================================================
  // CATEGORY FILTER HELPER
  // =========================================================

  const getCategoryItems = (category) => {
    return filteredMenuItems.filter(
      (item) => item.category === category
    );
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="menu-page">

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <header className="main-navbar">

        <div className="brand">

          <div className="brand-icon">
            M
          </div>

          <div>
            <h1>Meridian</h1>
            <span>KITCHENS COLLECTIVE</span>
          </div>

        </div>

        <nav className="main-nav">

          <a href="#home">
            Home
          </a>

          <a href="#menu">
            Menu
          </a>

          <a href="#ai-assistant">
            AI Assistant
          </a>

          <a href="#about">
            About
          </a>

          <button
            type="button"
            className="staff-login-btn"
            onClick={onStaffLogin}
          >
            Staff Login
          </button>

        </nav>

      </header>


      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        id="home"
        className="hero-section"
      >

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-tag">
            MERIDIAN KITCHENS COLLECTIVE
          </span>

          <h2>
            A Collection of
            <br />
            <span>Exceptional Flavors</span>
          </h2>

          <p>
            Discover thoughtfully crafted dishes from our
            restaurant concepts, brought together through one
            unforgettable dining experience.
          </p>

          <a
            href="#menu"
            className="hero-button"
          >
            Explore Our Menu
            <span>↓</span>
          </a>

        </div>

      </section>


      {/* =====================================================
          RESTAURANT INTRO
      ===================================================== */}

      <section className="intro-section">

        <div className="intro-line"></div>

        <p>
          FRESH INGREDIENTS
          &nbsp;•&nbsp;
          CRAFTED WITH CARE
          &nbsp;•&nbsp;
          SHARED WITH LOVE
        </p>

        <div className="intro-line"></div>

      </section>


      {/* =====================================================
          AI MENU ASSISTANT
      ===================================================== */}

      <section
        id="ai-assistant"
        className="ai-assistant"
      >

        <div className="ai-assistant-content">

          <span className="ai-label">
            INTELLIGENT DINING GUIDE
          </span>

          <h2>
            Ask Meridian AI
          </h2>

          <p>
            Looking for something specific?
            Ask about dishes, ingredients, allergens,
            or dietary preferences.
          </p>

          <div className="ai-question-box">

            <input
              type="text"
              placeholder="Example: Show me vegetarian dishes without nuts"
              value={aiQuestion}
              onChange={(e) =>
                setAiQuestion(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAskAI();
                }
              }}
            />

            <button
              type="button"
              onClick={handleAskAI}
              disabled={aiLoading}
            >
              {aiLoading
                ? "Thinking..."
                : "Ask AI"}
            </button>

          </div>

          {aiAnswer && (

            <div className="ai-answer">

              <div className="ai-answer-header">
                <span>✦</span>
                <strong>Meridian AI</strong>
              </div>

              <ReactMarkdown>
                {aiAnswer}
              </ReactMarkdown>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          MENU SECTION
      ===================================================== */}

      <section
        id="menu"
        className="menu-container"
      >

        {/* Section heading */}

        <div className="section-heading">

          <span>
            OUR COLLECTION
          </span>

          <h2>
            Explore the Menu
          </h2>

          <p>
            From comforting classics to carefully crafted
            favorites, there's something for every palate.
          </p>

        </div>


        {/* =================================================
            OUTLET SELECTOR
        ================================================= */}

        <div className="menu-outlet-wrapper">

          <div className="menu-outlet-selector">

            <div>

              <span className="outlet-label">
                DINING LOCATION
              </span>

              <h3>
                Choose Your Outlet
              </h3>

            </div>

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

          <p className="menu-result-count">
            Showing{" "}
            <strong>
              {filteredMenuItems.length}
            </strong>{" "}
            menu items
          </p>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {menuItems.length === 0 ? (

          <div className="menu-loading">

            <div className="loading-icon">
              🍽️
            </div>

            <p>
              Preparing our menu...
            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                MAIN COURSE
            ================================================= */}

            <div className="menu-category">

              <div className="category-heading">

                <span className="category-icon">
                  🍛
                </span>

                <div>

                  <h3>
                    Main Course
                  </h3>

                  <p>
                    Signature dishes made to satisfy
                  </p>

                </div>

              </div>

              <div className="menu-grid">

                {getCategoryItems("Main Course")
                  .map(renderMenuItem)}

              </div>

              {getCategoryItems("Main Course").length === 0 && (

                <p className="empty-category">
                  No main course items available
                  for this outlet.
                </p>

              )}

            </div>


            {/* =================================================
                STARTERS
            ================================================= */}

            <div className="menu-category">

              <div className="category-heading">

                <span className="category-icon">
                  🥗
                </span>

                <div>

                  <h3>
                    Starters
                  </h3>

                  <p>
                    A delicious beginning to your meal
                  </p>

                </div>

              </div>

              <div className="menu-grid">

                {getCategoryItems("Starters")
                  .map(renderMenuItem)}

              </div>

              {getCategoryItems("Starters").length === 0 && (

                <p className="empty-category">
                  No starter items available
                  for this outlet.
                </p>

              )}

            </div>


            {/* =================================================
                DESSERTS
            ================================================= */}

            <div className="menu-category">

              <div className="category-heading">

                <span className="category-icon">
                  🍰
                </span>

                <div>

                  <h3>
                    Desserts
                  </h3>

                  <p>
                    Something sweet to finish perfectly
                  </p>

                </div>

              </div>

              <div className="menu-grid">

                {getCategoryItems("Desserts")
                  .map(renderMenuItem)}

              </div>

              {getCategoryItems("Desserts").length === 0 && (

                <p className="empty-category">
                  No dessert items available
                  for this outlet.
                </p>

              )}

            </div>

          </>

        )}

      </section>


      {/* =====================================================
          DISH DETAILS MODAL
      ===================================================== */}

      {selectedItem && (

        <div
          className="dish-modal-overlay"
          onClick={() =>
            setSelectedItem(null)
          }
        >

          <div
            className="dish-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              type="button"
              className="modal-close"
              onClick={() =>
                setSelectedItem(null)
              }
              aria-label="Close"
            >
              ×
            </button>


            {/* Dish visual */}

            <div className="modal-image">

              <span>
                🍽️
              </span>

            </div>


            {/* Dish information */}

            <div className="modal-content">

              <span className="modal-category">
                MERIDIAN KITCHENS
              </span>

              <h2>
                {selectedItem.name}
              </h2>

              <p className="modal-description">
                {selectedItem.description}
              </p>

              <div className="modal-price">
                ₹{selectedItem.price}
              </div>


              <div className="modal-info">

                {/* Ingredients */}

                <div className="info-box">

                  <span className="info-icon">
                    🥘
                  </span>

                  <div>

                    <strong>
                      Ingredients
                    </strong>

                    <p>
                      {selectedItem.ingredients ||
                        "Ingredients information not available."}
                    </p>

                  </div>

                </div>


                {/* Allergens */}

                <div className="info-box">

                  <span className="info-icon">
                    ⚠️
                  </span>

                  <div>

                    <strong>
                      Allergens
                    </strong>

                    <p>
                      {selectedItem.allergens ||
                        "None listed"}
                    </p>

                  </div>

                </div>


                {/* Outlet */}

                <div className="info-box">

                  <span className="info-icon">
                    📍
                  </span>

                  <div>

                    <strong>
                      Available At
                    </strong>

                    <p>
                      {selectedItem.outlet}
                    </p>

                  </div>

                </div>

              </div>


              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedItem(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          ABOUT SECTION
      ===================================================== */}

      <section
        id="about"
        className="about-section"
      >

        <div className="about-content">

          <span className="about-label">
            OUR STORY
          </span>

          <h2>
            More Than Just
            <br />
            <span>A Meal</span>
          </h2>

          <p>
            Meridian Kitchens Collective brings
            multiple restaurant concepts together
            through a shared kitchen and hospitality
            experience.
          </p>

          <p>
            Every dish is prepared with carefully selected
            ingredients and a commitment to quality,
            consistency, and memorable dining experiences.
          </p>

        </div>


        <div className="about-decoration">

          <div className="decoration-circle">

            <span>
              ✦
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="menu-footer">

        <div className="footer-brand">

          <div className="brand-icon">
            M
          </div>

          <div>

            <strong>
              Meridian
            </strong>

            <span>
              KITCHENS COLLECTIVE
            </span>

          </div>

        </div>


        <p>
          Crafted with care. Served with hospitality.
        </p>


        <span className="footer-copy">
          © 2026 Meridian Kitchens Collective
        </span>

      </footer>

    </div>
  );
}

export default Menu;