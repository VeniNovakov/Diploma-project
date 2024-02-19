import React, { useEffect, useRef, useState } from "react";
import ordersJson from "../json/orders.json";
import { Order } from "../utilities/types";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

const OrderDetails: React.FC<{
  selectedOrder: Order | null;
  onCompleteOrder: () => void;
}> = ({ selectedOrder, onCompleteOrder }) => {
  if (!selectedOrder) {
    return (
      <p className="text-center text-gray-500">
        Select an order to view details.
      </p>
    );
  }

  let total = 0;

  return (
    <div className="mb-8 p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Order #{selectedOrder.Id}</h2>
      <p>Wanted for: {selectedOrder.wantedFor}</p>

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Items</h3>
        {selectedOrder.orderedProducts.map((item) => {
          const itemTotal = item.product.price * item.amount;
          total += itemTotal;

          return (
            <div key={item.id} className="mb-2">
              <p>
                {item.amount}x {item.product.name} - {itemTotal}
              </p>
              {item.addOns?.length && (
                <ul className="list-disc pl-4">
                  {item.addOns.map((addOn) => {
                    const addOnTotal = addOn.addOn.price * addOn.amount;
                    total += addOnTotal;

                    return (
                      <li key={addOn.id}>
                        {addOn.amount}x {addOn.addOn.name} - ${addOnTotal.toFixed(2)}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xl font-semibold mt-4">Total: ${total.toFixed(2)}</p>
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [connectionRef, setConnection] = useState < HubConnection > ();

  function createHubConnection() {
    const con = new HubConnectionBuilder()
      .withUrl("https://localhost:7010/ws")
      .withAutomaticReconnect()
      .build();
    setConnection(con);

  }
  const ref = useRef(false);
  useEffect(()=>{
    createHubConnection();
  }, [])
  useEffect(() => {
    if (!ref.current) {
      fetch('https://localhost:7010/api/orders/v1.0', {
        headers:{
          "Accepts":"application/json"
        }, 
        mode:"cors"
      }
        )
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data[0]);
          setOrders(data as Order[]);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    ref.current = true;

    if (connectionRef) {
      try {
        connectionRef
          .start()
          .then(() => {
            connectionRef.on('GetOrders', (data) => {
              setOrders(data as Order[]);
            });
          })
          .catch((err) => {
            console.log(`Error: ${err}`);
          });
      } catch (error) {
        console.log(error as Error);
      }
    }
  }, [connectionRef]);

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    console.log(orders)
  };

  const handleCompleteOrder = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container mx-auto mt-8 flex">
      <div className="w-1/3 pr-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div>
        {Array.isArray(orders) && orders.length > 0 ? (
    orders.map((order) => ( 
      <div
              key={order.Id}
              className={`mb-8 p-4 border rounded cursor-pointer ${
                selectedOrder === order ? "bg-blue-200" : ""
              }`}
              onClick={() => handleOrderClick(order)}
            >
              <h2 className="text-lg font-semibold mb-2">Order #{order.Id}</h2>
              <p>Wanted for: {order.wantedFor}</p>
            </div>
          ))): (
            <p>No orders available</p>
          )}
        </div>
      </div>
      <div className="flex-grow p-4">
        <OrderDetails
          selectedOrder={selectedOrder}
          onCompleteOrder={handleCompleteOrder}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
