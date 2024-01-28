using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/products/v1.0")]
    [ApiController]
    public class ProductsController(IProductService productService) : ControllerBase
    {
        private readonly IProductService _productService = productService;

        [HttpPost()]
        public async Task<IActionResult> AddProductAsync([FromBody] Product product)
        {
            await _productService.AddProductAsync(product);

            return Ok();
        }

        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var pr = await _productService.GetProduct(id);
            if (pr == null)
            {
                return NotFound();
            }
            return Ok(pr);
        }

        [HttpDelete("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var pr = await _productService.DeleteProduct(id);
            if (pr == null)
            {
                return NotFound();
            }
            return Ok(pr);
        }

        [HttpPatch("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateProduct(int id)
        {
            var pr = await _productService.GetProduct(id);
            if (pr == null)
            {
                return NotFound();
            }
            return Ok(pr);
        }
    }
}
