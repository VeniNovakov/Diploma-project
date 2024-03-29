﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using pizzeria_backend.Hubs;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;
using System.ComponentModel.DataAnnotations;
using System.Web.Http;
using Authorize = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;
using FromBody = Microsoft.AspNetCore.Mvc.FromBodyAttribute;
using HttpDelete = Microsoft.AspNetCore.Mvc.HttpDeleteAttribute;
using HttpGet = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPost = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

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


        [HttpPost("create")]
        public async Task<ActionResult> Order([FromBody] OrderDto Order)
        {
            try
            {
                var ord = await _orderService.MakeOrder(Order);

                Console.WriteLine(ord);
                await _hubContext.Clients.All.SendAsync("NewOrder", JsonConvert.SerializeObject(ord,
                    new JsonSerializerSettings
                    {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                        ContractResolver = new CamelCasePropertyNamesContractResolver
                        {

                            NamingStrategy = new CamelCaseNamingStrategy()
                        }
                    })
                    );
                return Ok(ord);
            }
            catch (ValidationException ex)
            {
                return BadRequest("One or more of the items are not available or in the menu");
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
            var ord = await _orderService.GetOrder(id);
            if (ord == null)
            {
                return NotFound("Order not found");
            }

            return Ok(ord);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var ord = await _orderService.DeleteOrder(id);
            if (ord == null)
            {
                return NotFound("Order not found");
            }

            await _hubContext.Clients.All.SendAsync("DeleteOrder", ord);
            return Ok(ord);
        }

        [HttpGet("change-status/{id}")]
        [Authorize(Policy = "Admin")]
        public async Task<IActionResult> ChangeCompletion(int id)
        {
            var ord = await _orderService.ChangeOrderCompletion(id);


            if (ord == null)
            {
                return NotFound("Order not found");
            }

            await _hubContext.Clients.All.SendAsync("UpdateOrder", ord);

            return Ok(ord);

        }

        [HttpGet()]
        [Authorize(Policy = "Admin")]
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