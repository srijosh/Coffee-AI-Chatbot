import React from 'react';

interface DeliveryToggleProps {
  onToggle: (mode: 'Deliver' | 'Pick Up') => void;
  deliveryMode: 'Deliver' | 'Pick Up';
}

const DeliveryToggle: React.FC<DeliveryToggleProps> = ({ onToggle, deliveryMode }) => {
  return (
    <div className="flex justify-between bg-gray-200 mx-7 p-1 rounded-xl mt-7">
      <button
        // className={`py-1 px-[15%] rounded-xl font-semibold ${deliveryMode === 'Deliver' ? 'bg-app_orange_color text-white' : 'text-black'}`}
        onClick={() => onToggle('Deliver')}
      >
        Deliver
      </button>
      <button
        // className={`py-1 px-[15%] rounded-xl font-semibold ${deliveryMode === 'Pick Up' ? 'bg-app_orange_color text-white' : 'text-black'}`}
        onClick={() => onToggle('Pick Up')}
      >
        Pick Up
      </button>
    </div>
  );
};

export default DeliveryToggle;