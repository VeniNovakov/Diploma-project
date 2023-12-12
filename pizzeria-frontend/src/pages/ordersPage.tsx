// OrdersPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import ordersJson from '../json/orders.json'
import { BasketItem, BasketProps } from '../utilities/types';

interface Order {
  id: number;
  wanted_for: string;
  customer: {
    name: string;
    phone: string;
  };
  items: BasketItem[];
}

const OrderDetails: React.FC<{ selectedOrder: Order | null; onCompleteOrder: () => void }> = ({
  selectedOrder,
  onCompleteOrder,
}) => {

  if (!selectedOrder) {
    return <p className="text-center text-gray-500">Select an order to view details.</p>;
  }

  return (
    <div className="mb-8 p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Order #{selectedOrder.id}</h2>
      <p>Wanted for: {selectedOrder.wanted_for}</p>
      <p>
        Customer: {selectedOrder.customer.name} - Phone: {selectedOrder.customer.phone}
      </p>
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Items</h3>
        {selectedOrder.items.map((item) => (
          <div key={item.id} className="mb-2">
            <p>
              {item.amount}x {item.product.name} - {item.product.price * item.amount}
            </p>
            {item.addOns?.length && (
              <ul className="list-disc pl-4">
                {item.addOns.map((addOn) => (
                  <li key={addOn.id}>
                    {addOn.amount}x {addOn.name} - ${addOn.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}

          </div>
        ))}
      </div>
      <button
        className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded mt-4"
        onClick={onCompleteOrder}
      >
        Complete
      </button>
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(ordersJson.orders as Order[]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const ref = useRef(false);
  useEffect(() => {
    if(!ref.current)
      setOrders(ordersJson.orders as Order[])
    ref.current = true;
  },[])

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCompleteOrder = () => {

    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto mt-8 flex">
      <div className="w-1/3 pr-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              className={`mb-8 p-4 border rounded cursor-pointer ${
                selectedOrder === order ? 'bg-blue-200' : ''
              }`}
              onClick={() => handleOrderClick(order)}
            >
              <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
              <p>Wanted for: {order.wanted_for}</p>
              <p>Customer: {order.customer.name} - Phone: {order.customer.phone}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-grow p-4">
        <OrderDetails selectedOrder={selectedOrder} onCompleteOrder={handleCompleteOrder} />
      </div>
    </div>
  );
};

export default OrdersPage;
