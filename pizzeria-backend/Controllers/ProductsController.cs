using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/products/v1.0")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IAzureBlobStorageService _azureBlobStorageService;

        public ProductsController(IProductService productsService, IAzureBlobStorageService azureBlobStorageService)
        {

            _productService = productsService;
            _azureBlobStorageService = azureBlobStorageService;
        }

        [HttpPost()]
        [Authorize(Policy = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> AddProductAsync([FromForm] ProductDto? product)
        {
            if (product == null)
            {
                return BadRequest("No body provided");
            }

            var imageLink = (await _azureBlobStorageService.UploadBlobAsync(product.Image.OpenReadStream(), product.Image.FileName)).ToString();
            Console.WriteLine(imageLink);
            var pr = await _productService.AddProductAsync(ConvertToProduct(product, imageLink));

            return Ok(pr);
        }


        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var pr = await _productService.GetProduct(id);

            if (pr == null)
            {
                return NotFound("Product not found");
            }

            return Ok(pr);
        }

        [HttpGet("")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAllProduct()
        {
            var pr = await _productService.GetAllProducts();

            return Ok(pr);
        }

        [HttpGet("menu")]
        [Produces("application/json")]
        public async Task<IActionResult> GetMenu()
        {
            var menu = await _productService.GetMenu();

            if (menu == null)
            {
                return NotFound("There are no items in the menu");
            }

            return Ok(menu);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var pr = await _productService.DeleteProduct(id);

            if (pr == null)
            {
                return NotFound("Product not found");
            }

            await _azureBlobStorageService.DeleteBlobAsync(pr.Image.Split("/").Last());

            return Ok(pr);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDto product)
        {
            var pr = await _productService.GetProduct(id);
            if (pr == null)
            {
                return NotFound("Product not found");
            }

            if (product.Image != null)
            {
                await _azureBlobStorageService.DeleteBlobAsync(pr.Image.Split("/").Last());
                var image = (await _azureBlobStorageService.UploadBlobAsync(product.Image.OpenReadStream(), product.Image.FileName)).ToString();
                pr = ConvertToProduct(product, image, id);

            }
            else
            {
                pr = ConvertToProduct(product, pr.Image, id);

            }

            pr = await _productService.UpdateProduct(pr);

            return Ok(pr);
        }

        private static Product ConvertToProduct(ProductDto productDto, string image)
        {
            return new Product
            {
                Image = image,
                Name = productDto.Name,
                Description = productDto.Description,
                CategoryId = productDto.CategoryId,
                Price = productDto.Price,
                IsAvailable = productDto.IsAvailable,
                IsInMenu = productDto.IsInMenu,
            };
        }

        private static Product ConvertToProduct(ProductDto productDto, string image, int id)
        {

            return new Product
            {
                Id = id,
                Image = image,
                Name = productDto.Name,
                Description = productDto.Description,
                CategoryId = productDto.CategoryId,
                Price = productDto.Price,
                IsAvailable = productDto.IsAvailable,
                IsInMenu = productDto.IsInMenu,
            };
        }

    }
}
