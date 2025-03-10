import React from 'react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, onNewChat }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Medical Assistant</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="sidebar-content">
        <button className="new-chat-button" onClick={() => {
          onNewChat();
          onClose();
        }}>
          <span>+</span> New Chat
        </button>
        
        <div className="sidebar-section">
          <h3>About</h3>
          <p>This Medical Assistant uses RAG (Retrieval-Augmented Generation) to provide information based solely on retrieved medical data.</p>
        </div>
        
        <div className="sidebar-section">
          <h3>Disclaimer</h3>
          <p>This tool is for informational purposes only and not a substitute for professional medical advice, diagnosis, or treatment.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
