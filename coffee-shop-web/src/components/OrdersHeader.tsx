import React from 'react';

interface OrdersHeaderProps {
  deliveryMode: 'Deliver' | 'Pick Up';
  address: string;
  setAddress: (address: string) => void;
  onToggle: (mode: 'Deliver' | 'Pick Up') => void;
  addressError: string | null;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ deliveryMode, address, setAddress, onToggle, addressError }) => {
  return (
    <div className="mx-7 mb-4">
      <div className="flex space-x-4">
        <button
          onClick={() => onToggle('Deliver')}
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors duration-200 ${
            deliveryMode === 'Deliver'
              ? ' text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          style={{ backgroundColor: deliveryMode === 'Deliver' ? '#C67C4E' : undefined }}
        >
          Deliver
        </button>
        <button
          onClick={() => onToggle('Pick Up')}
          className={`px-4 py-2 rounded-lg font-semibold cursor-pointer transition-colors duration-200 ${
            deliveryMode === 'Pick Up'
              ? ' text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          style={{ backgroundColor: deliveryMode === 'Pick Up' ? '#C67C4E' : undefined }}
        >
          Pick Up
        </button>
      </div>
      {deliveryMode === 'Deliver' && (
        <div className="mt-4">
          <p className="text-gray-800 font-semibold">Delivery Address</p>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter delivery address"
            className="w-full mt-2 p-2 border rounded-lg"
          />
          {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
        </div>
      )}
    </div>
  );
};

export default OrdersHeader;