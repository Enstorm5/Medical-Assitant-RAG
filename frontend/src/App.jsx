import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import InputBox from './components/InputBox';
import Sidebar from './components/Sidebar';
import { fetchChatResponse } from './services/api';
import ReactMarkdown from 'react-markdown';

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    
    // Set loading state
    setLoading(true);
    
    try {
      // Create message history for API
      const messageHistory = [...messages, userMessage];
      
      // Get response from API
      const response = await fetchChatResponse(messageHistory);
      
      // Add assistant message
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: response.response, context: response.context }
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
      />
      
      <main className="main-content">
        <header className="header">
          <button 
            className="menu-button" 
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1>Medical Assistant</h1>
        </header>
        
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome-container">
              <h2>Welcome to the Medical Assistant</h2>
              <p>Ask any medical question to get started.</p>
              <p className="disclaimer">
                Responses are based solely on retrieved medical information and should not replace professional medical advice.
              </p>
            </div>
          ) : (
            <div className="messages-container">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  role={message.role} 
                  content={message.content}
                  context={message.context}
                />
              ))}
              {loading && (
                <div className="loading-message">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
        
        <div className="input-container">
          <InputBox onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;
