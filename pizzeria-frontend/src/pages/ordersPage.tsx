import React, { useEffect, useRef, useState } from "react";
import ordersJson from "../json/orders.json";
import { Order } from "../utilities/types";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import toast, { Toaster } from 'react-hot-toast';
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

  const deleteOrder = () =>{
    console.log(selectedOrder.id);
    fetch(window.location.origin+"/api/orders/v1.0/"+ selectedOrder.id, {method:"DELETE"}).then(data => data.json()).then(d => console.log(d));
  }
  return (
    <div className="mb-8 p-4 border rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Order #{selectedOrder.id}</h2>
      <p>Wanted for: {selectedOrder.wantedFor}</p>

      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Items</h3>
        {selectedOrder.orderedProducts.map((item) => {
          const itemTotal = item.product.price * item.amount;
          total += itemTotal;

          return (
            <div key={item.Id} className="mb-2">
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
      {selectedOrder.isCompleted && <button 
       className="bg-gray-300 hover:bg-gray-500 text-black px-4 py-2 rounded mt-4"
      onClick={()=>deleteOrder()}>Remove</button>}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [connectionRef, setConnection] = useState < HubConnection > ();
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  function createHubConnection() {
    const con = new HubConnectionBuilder()
      .withUrl(window.location.origin+"/ws")
      .withAutomaticReconnect()
      .build();
    setConnection(con);

  }
  const ref = useRef(false);
  useEffect(()=>{
    createHubConnection();
    if (!ref.current) {
      toast.loading("Loading orders", {position: "top-center"})
      fetch(window.location.origin+"/api/orders/v1.0", {
        headers:{
          "Accepts":"application/json"
        }, 
      }
        )
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          toast.dismiss()
          setOrders(data as Order[]);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    ref.current = true;

  }, [])

  useEffect(() => {
    if (connectionRef) {
      try {
        connectionRef
          .start()
          .then(() => {
            connectionRef.on("NewOrder", (data) => {
              const newOrder = JSON.parse(data) as Order;
              console.log(orders);
              console.log(newOrder);
              const infoString = "New order #"+ newOrder.id + " came";
              toast(infoString,
                {
                  duration:4000,
                  position:"top-right"
              });

              setOrders(prevOrders => [...prevOrders, newOrder]);
            });

            connectionRef.on('UpdateOrder', (data) => {
              const updatedOrder = JSON.parse(data) as Order;
              const infoString = "Order #"+ updatedOrder.id + " changed status to " + (updatedOrder.isCompleted?"Completed":"Pending");
              toast(infoString,
              {
                duration:4000,
                position:"top-right"
            })
              
              setOrders(prevOrders => {
                const updatedOrders = prevOrders.map(ord => {
                  if (ord.id === updatedOrder.id) {
                    return { ...ord, isCompleted: updatedOrder.isCompleted };
                  }
                  return ord;
                });
                return updatedOrders; 
              });
            });

            connectionRef.on('DeleteOrder', (data) => {
              const orderToDelete = JSON.parse(data) as Order;
              const infoString = "Order #"+ orderToDelete.id + " removed"; 
              toast(infoString,
              {
                duration:4000,
                position:"top-right"
            })
              setOrders(prevOrders => {
                const updatedOrders = prevOrders.filter(ord => {
                  return ord.id !== orderToDelete.id;
                });
                return updatedOrders; 
              });
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
  };

  const handleCompleteOrder = () => {

    fetch(window.location.origin+"/api/orders/v1.0/change-status/"+selectedOrder?.id, {method:"GET"})
    setSelectedOrder(null);
  };
  const filteredOrders = showCompleted
    ? orders.filter(order => order.isCompleted)
    : orders.filter(order => !order.isCompleted);

  const handleToggle = () => {
    setShowCompleted(prev => !prev);
    setSelectedOrder(null); // Clear selected order when toggling
  };

  return (
    <div className="container mx-auto mt-8 flex">
      <div className="w-1/3 pr-4">
        <h1 className="text-2xl font-bold mb-4">Orders</h1>
        <div>
          <button className="mb-2" onClick={handleToggle}>
            {showCompleted ? 'Completed Orders' : 'Pending Orders'}
          </button>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`mb-8 p-4 border rounded cursor-pointer ${
                  selectedOrder === order ? "bg-blue-200" : ""
                }`}
                onClick={() => handleOrderClick(order)}
              >
                <h2 className="text-lg font-semibold mb-2">Order #{order.id}</h2>
                <p>Wanted for: {order.wantedFor}</p>
              </div>
            ))
          ) : (
            <p>No {showCompleted ? 'completed' : 'pending'} orders</p>
          )}
        </div>
      </div>
      <div className="flex-grow p-4">
        <OrderDetails
          selectedOrder={selectedOrder}
          onCompleteOrder={handleCompleteOrder}
        />
      </div>
      <Toaster />
    </div>
  );
};
export default OrdersPage;
