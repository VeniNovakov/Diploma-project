using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/products/v1.0")]
    [ApiController]
    public class ProductsController(IProductService productService) : ControllerBase
    {
        private readonly IProductService _productService = productService;


        [HttpPost()]
        [Produces("application/json")]
        public async Task<IActionResult> AddProductAsync([FromBody] ProductDto? product)
        {
            if (product == null)
            {
                return BadRequest("message: " + "No body provided");
            }

            var pr = await _productService.AddProductAsync(ConvertToProduct(product));

            return Ok(pr);
        }

        private static Product ConvertToProduct(ProductDto productDto)
        {
            return new Product
            {
                Name = productDto.Name,
                Description = productDto.Description,
                Category = productDto.Category,
                Price = productDto.Price,
                IsAvailable = productDto.IsAvailable,
                IsInMenu = productDto.IsInMenu,
            };
        }

        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var pr = await _productService.GetProduct(id);
            Console.WriteLine(pr);
            if (pr == null)
            {
                return NotFound("message: " + "Product not found");
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
                return NotFound("message: " + "Product not found");
            }
            return Ok(pr);
        }

        [HttpPatch("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateProduct([FromBody] Product product)
        {
            var pr = await _productService.UpdateProduct(product);
            if (pr == null)
            {
                return NotFound("message: " + "Product not found");
            }
            return Ok(pr);
        }
    }
}
