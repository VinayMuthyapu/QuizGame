import React from 'react';

const Toast = ({ message, type, onClose }) => {
  if (!message) return null;

  const backgroundColor = type === 'success' ? '#4CAF50' : '#ff4d4d';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      backgroundColor: backgroundColor,
      color: '#fff',
      borderRadius: '5px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      transition: 'opacity 0.5s',
    }}>
      <span>{message}</span>
      <button onClick={onClose} style={{
        marginLeft: '10px',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '16px',
        cursor: 'pointer',
      }}>✖</button>
    </div>
  );
};

export default Toast;