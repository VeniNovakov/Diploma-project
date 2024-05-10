using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using pizzeria_backend.Extension;
using pizzeria_backend.Hubs;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace pizzeria_backend.Controllers
{
    [Route("api/orders/v1.0")]
    [ApiController]
    public class OrderController : Controller
    {
        private readonly IOrdersService _orderService;
        private readonly IHubContext<OrderHub> _hubContext;

        public OrderController(IOrdersService orderService, IHubContext<OrderHub> hubContext)
        {
            _orderService = orderService;
            _hubContext = hubContext;
        }

        [Authorize]
        [HttpPost()]
        public async Task<ActionResult> Order([FromBody] OrderDto Order)
        {

            var claimsRepo = HttpContext.User.Identity as ClaimsIdentity;

            try
            {

                var ord = await _orderService.MakeOrder(Order, Int32.Parse(claimsRepo.FindFirst("id").Value));
                await _hubContext.SendJsonAsync("NewOrder", ord);

                return Ok(ord);
            }
            catch (ValidationException ex)
            {
                return BadRequest("One or more of the items are not available or in the menu");
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("validate")]
        public async Task<ActionResult> ValidateOrder([FromBody] OrderDto Order)
        {
            var Ids = await _orderService.ValidateOrder(Order);

            return Ok(Ids);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(int id)
        {
            try
            {
                var ord = await _orderService.GetOrder(id);

                return Ok(ord);
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var ord = await _orderService.DeleteOrder(id);

                await _hubContext.SendJsonAsync("DeleteOrder", ord);
                return Ok(ord);
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("change-status/{id}")]
        [Authorize(Policy = "admin")]
        public async Task<IActionResult> ChangeCompletion(int id)
        {
            try
            {
                var ord = await _orderService.ChangeOrderCompletion(id);

                await _hubContext.SendJsonAsync("UpdateOrder", ord);

                return Ok(ord);
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet()]
        [Authorize(Policy = "admin")]
        [Produces("application/json")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderService.GetOrders();

            return Ok(orders);
        }
    }
}
