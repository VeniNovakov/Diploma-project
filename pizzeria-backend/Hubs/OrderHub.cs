using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using pizzeria_backend.Models;

namespace pizzeria_backend.Hubs
{

    public interface IOrderHub
    {
        public Task SendMessage(string user, string message);
        public Task UpdateOrders(List<Order> orders);

    }
    public class OrderHub : Hub
    {
        public override async Task OnConnectedAsync()
        {

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            await base.OnDisconnectedAsync(exception);
        }
    }


    public class OrderHubService : IOrderHub
    {
        private readonly IHubContext<OrderHub> _hubContext;

        public OrderHubService(IHubContext<OrderHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task SendMessage(string user, string message)
        {

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task UpdateOrders(List<Order> orders)
        {

            string ordersString = JsonConvert.SerializeObject(orders, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            await _hubContext.Clients.All.SendAsync("GetOrders", ordersString);
        }
    }
}
