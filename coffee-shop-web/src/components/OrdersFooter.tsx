import React from 'react';

interface OrdersFooterProps {
  totalPrice: number;
  deliveryMode: 'Deliver' | 'Pick Up';
}

const OrdersFooter: React.FC<OrdersFooterProps> = ({ totalPrice, deliveryMode }) => {
  const deliveryFee = deliveryMode === 'Deliver' ? 1 : 0;
  const finalPrice = totalPrice + deliveryFee;

  return (
    <div className="mx-7 mt-6">
      <p className="text-gray-800 font-semibold">Payment Summary</p>
      <div className="flex justify-between mt-2">
        <p className="text-gray-600">Price</p>
        <p className="text-gray-800">$ {totalPrice.toFixed(2)}</p>
      </div>
      <div className="flex justify-between mt-1">
        <p className="text-gray-600">Delivery Fee</p>
        <p className="text-gray-800">$ {deliveryFee.toFixed(2)}</p>
      </div>
      <div className="flex justify-between mt-2 border-t pt-2">
        <p className="text-gray-800 font-semibold">Total</p>
        <p className="text-gray-800 font-semibold">$ {finalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default OrdersFooter;