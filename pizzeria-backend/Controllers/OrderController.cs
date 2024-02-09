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
            return Ok(await _orderService.GetOrder(Id));
        }

        [HttpGet("complete/{Id}")]
        public async Task<IActionResult> CompleteOrder(int Id)
        {
            return Ok(await _orderService.ChangeOrderCompletion(Id));
        }

    }
}
