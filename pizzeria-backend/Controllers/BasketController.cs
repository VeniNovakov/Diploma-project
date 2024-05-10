using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services.Interfaces;
using System.Security.Claims;

namespace pizzeria_backend.Controllers
{
    [Route("api/basket/v1.0")]
    [ApiController]
    public class BasketController : Controller
    {

        private readonly IBasketService _basketService;

        public BasketController(IBasketService basketService)
        {
            _basketService = basketService;
        }

        [Authorize]
        [HttpGet()]
        public async Task<IActionResult> GetBasket()
        {
            try
            {
                var claimsRepo = HttpContext.User.Identity as ClaimsIdentity;

                if (claimsRepo == null)
                {
                    return BadRequest();
                }

                var basket = await _basketService.GetBasket(Int32.Parse(claimsRepo.FindFirst("id").Value));
                return Ok(basket);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPost("{id}")]
        public async Task<IActionResult> AddProductToBasket([FromBody] AddProductToBasketDto product)
        {
            try
            {
                var claimsRepo = HttpContext.User.Identity as ClaimsIdentity;

                if (claimsRepo == null)
                {
                    return BadRequest();
                }


                var basketProduct = await _basketService.AddProduct(product, Int32.Parse(claimsRepo.FindFirst("id").Value));
                return Ok(basketProduct);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditProductAmount([FromQuery] int id, [FromQuery] bool addToProduct)
        {
            try
            {
                var basketProduct = await _basketService.EditAmount(id, addToProduct);
                return Ok(basketProduct);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveProductFromBasket([FromQuery] int id)
        {
            try
            {
                await _basketService.RemoveProduct(id);
                return NoContent();
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
