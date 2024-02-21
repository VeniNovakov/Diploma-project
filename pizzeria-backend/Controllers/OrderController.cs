using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using pizzeria_backend.Hubs;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/orders/v1.0")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly IOrderService _orderService;
        private readonly IHubContext<OrderHub> _hubContext;

        public OrderController(IOrderService orderService, IHubContext<OrderHub> hubContext)
        {
            _orderService = orderService;
            _hubContext = hubContext;
        }

        [HttpPost()]
        public async Task<ActionResult> Order([FromBody] OrderDto Order)
        {

            var ord = await _orderService.MakeOrder(Order);

            if (ord == null)
            {
                return BadRequest("One or more of the items are not available or in the menu");
            }

            string orderString = JsonConvert.SerializeObject(ord, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                Formatting = Formatting.Indented,
                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
            });

            await _hubContext.Clients.All.SendAsync("NewOrder", orderString);
            return Ok(ord);
        }


        [HttpGet("{Id}")]
        public async Task<IActionResult> GetOrder(int Id)
        {
            var ord = await _orderService.GetOrder(Id);
            if (ord == null)
            {
                return NotFound("Order not found");
            }

            return Ok(ord);
        }
        [HttpDelete("{Id}")]
        public async Task<IActionResult> DeleteOrder(int Id)
        {
            var ord = await _orderService.DeleteOrder(Id);
            if (ord == null)
            {
                return NotFound("Order not found");
            }
            string orderString = JsonConvert.SerializeObject(ord, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                Formatting = Formatting.Indented,
                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
            });
            await _hubContext.Clients.All.SendAsync("DeleteOrder", orderString);
            return Ok(orderString);
        }

        [HttpGet("change-status/{Id}")]
        public async Task<IActionResult> ChangeCompletion(int Id)
        {
            var ord = await _orderService.ChangeOrderCompletion(Id);

            if (ord == null)
            {
                return NotFound("Order not found");
            }

            string orderString = JsonConvert.SerializeObject(ord, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                Formatting = Formatting.Indented,
                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
            });

            await _hubContext.Clients.All.SendAsync("UpdateOrder", orderString);

            return Ok(ord);
        }

        [HttpGet()]
        [Produces("application/json")]
        public async Task<IActionResult> GetOrders()
        {

            var orders = await _orderService.GetOrders();
            if (orders == null)
            {
                return NotFound("Order not found");
            }

            return Ok(orders);
        }

    }
}