import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const ChatMessage = ({ role, content, context }) => {
  const [showContext, setShowContext] = useState(false);
  
  const isAssistant = role === 'assistant';
  
  return (
    <div className={`message ${isAssistant ? 'assistant-message' : 'user-message'}`}>
      <div className="message-header">
        <div className="avatar">
          {isAssistant ? '🤖' : '👤'}
        </div>
        <div className="role-name">
          {isAssistant ? 'Medical Assistant' : 'You'}
        </div>
      </div>
      
      <div className="message-content">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
        
        {isAssistant && context && (
          <div className="context-container">
            <button 
              className="context-toggle" 
              onClick={() => setShowContext(!showContext)}
            >
              {showContext ? 'Hide medical context' : 'Show medical context'}
            </button>
            
            {showContext && (
              <div className="context-content">
                <h4>Retrieved Medical Information:</h4>
                <ReactMarkdown>
                  {context}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;