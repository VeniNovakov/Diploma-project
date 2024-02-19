using Microsoft.AspNetCore.Mvc;
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
        private readonly IOrderHub _hubContext;

        public OrderController(IOrderService orderService, IOrderHub hubContext)
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
            var orders = await _orderService.GetOrders();
            await _hubContext.UpdateOrders(orders);
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

        [HttpGet("change-status/{Id}")]
        public async Task<IActionResult> ChangeCompletion(int Id)
        {
            var ord = await _orderService.ChangeOrderCompletion(Id);
            if (ord == null)
            {
                return NotFound("Order not found");
            }
            var orders = await _orderService.GetOrders();
            await _hubContext.UpdateOrders(orders);

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

            await _hubContext.UpdateOrders(orders);

            return Ok(orders);
        }

    }
}