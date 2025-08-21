import React, { useEffect } from 'react';
import './RightSidebar.css';

const RightSidebar = () => {
  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const body = document.querySelector("body");
      if (!body) return;

      const sidebar = body.querySelector(".sidebar");
      const rightSidebar = body.querySelector(".right-sidebar");
      const toggle = body.querySelector(".toggle");
      const rightToggle = rightSidebar ? rightSidebar.querySelector(".toggle") : null;
      const searchBtn = body.querySelector(".search-box");
      const modeSwitch = body.querySelector(".toggle-switch");
      const modeText = body.querySelector(".mode-text") || { innerHTML: "" };

      const handleToggle = () => {
        if (sidebar) sidebar.classList.toggle("close");
      };
      const handleRightToggle = () => {
        if (rightSidebar) rightSidebar.classList.toggle("close");
      };
      const handleSearch = () => {
        if (sidebar) sidebar.classList.remove("close");
      };
      const handleModeSwitch = () => {
        if (body) body.classList.toggle("dark");
        if (modeText && modeText.innerText !== undefined) {
          modeText.innerText = body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
        }
      };

      if (toggle) toggle.addEventListener("click", handleToggle);
      if (rightToggle) rightToggle.addEventListener("click", handleRightToggle);
      if (searchBtn) searchBtn.addEventListener("click", handleSearch);
      if (modeSwitch) modeSwitch.addEventListener("click", handleModeSwitch);

      // Nettoyage des écouteurs d'événements
      return () => {
        if (toggle) toggle.removeEventListener("click", handleToggle);
        if (rightToggle) rightToggle.removeEventListener("click", handleRightToggle);
        if (searchBtn) searchBtn.removeEventListener("click", handleSearch);
        if (modeSwitch) modeSwitch.removeEventListener("click", handleModeSwitch);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      
      <nav className="sidebar close right-sidebar">
          <header>
            <div className="image-text">
              <span className="image">
                <h1>RIGHT</h1>
              </span>
            </div>
            <i className="bx bx-chevron-left toggle"></i>
          </header>
          <div className="menu-bar">
            <div className="menu">
              <li className="search-box">
                <i className="bx bx-search icon"></i>
                <input type="search" placeholder="Search..." />
              </li>
              
              <ul className="menu-links">
                <li className="nav-link">
                  <a href="">
                    <i className="bx bx-home-smile icon"></i>
                    <span className="text nav-text">Home</span>
                  </a>
                </li>
                <li className="nav-link">
                  <a href="">
                    <i className="bx bxs-shopping-bags icon"></i>
                    <span className="text nav-text">Shopping</span>
                  </a>
                </li>
                <li className="nav-link">
                  <a href="">
                    <i className="bx bxs-plane-take-off icon"></i>
                    <span className="text nav-text">Travel</span>
                  </a>
                </li>
                <li className="nav-link">
                  <a href="">
                    <i className="bx bxs-building-house icon"></i>
                    <span className="text nav-text">Hotel</span>
                  </a>
                </li>
                <li className="nav-link">
                  <a href="">
                    <i className="bx bx-car icon"></i>
                    <span className="text nav-text">Car</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="bottom-content">
              <li className="mode">
                <div className="moon-sun">
                  <i className="bx bx-moon icon moon"></i>
                  <i className="bx bx-sun icon sun"></i>
                </div>
                <span className="mode-text text">Dark Mode</span>
                <div className="toggle-switch">
                  <span className="switch"></span>
                </div>
              </li>
            </div>
          </div>
        </nav>
    </div>
  );
};

export default RightSidebar;