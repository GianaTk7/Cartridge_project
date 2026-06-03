import React from 'react';

const Sidebar = ({ isOpen, toggleSidebar, navItems, activeSection, scrollToSection }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-sidebar" onClick={toggleSidebar}>×</button>
        <ul className="sidebar-nav">
          {navItems.map((item, idx) => (
            <li key={idx}>
              <button 
                className={`sidebar-nav-link ${activeSection === item.toLowerCase() ? 'active' : ''}`}
                onClick={() => {
                  scrollToSection(item.toLowerCase());
                  toggleSidebar();
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;