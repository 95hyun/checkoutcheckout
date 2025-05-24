import React, { useEffect } from 'react';

const CharacterModal: React.FC = () => {
  const isOpen = true; // Replace with actual state

  useEffect(() => {
    if (isOpen) {
      const modalContainer = document.createElement('div');
      modalContainer.setAttribute('aria-hidden', 'true');
      modalContainer.id = 'modal-container';
      document.body.appendChild(modalContainer);
      
      return () => {
        const container = document.getElementById('modal-container');
        if (container) {
          document.body.removeChild(container);
        }
      };
    }
  }, [isOpen]);

  return (
    // Rest of the component code
  );
};

export default CharacterModal; 