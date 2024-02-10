using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/orders/v1.0")]
    [ApiController]
    public class OrderController(IOrderService orderService) : Controller
    {
        private readonly IOrderService _orderService = orderService;


        [HttpPost()]
        public async Task<ActionResult> Order([FromBody] OrderDto Order)
        {

            return Ok(await _orderService.MakeOrder(Order));
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
            return Ok(ord);

        }

        [HttpGet("completed/{IsCompleted}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetOrders(bool IsCompleted)
        {
            var ord = await _orderService.GetOrders(IsCompleted);

            if (ord == null)
            {
                return NotFound("Order not found");
            }
            return Ok(ord);
        }

    }
}
