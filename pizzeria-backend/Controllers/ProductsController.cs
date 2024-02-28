﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/products/v1.0")]
    [ApiController]
    public class ProductsController(IProductService productService, IAzureBlobStorageService azureBlobStorageService) : ControllerBase
    {
        private readonly IProductService _productService = productService;
        private readonly IAzureBlobStorageService _azureBlobStorageService = azureBlobStorageService;


        [HttpPost()]
        [Authorize]
        [Produces("application/json")]
        public async Task<IActionResult> AddProductAsync([FromForm] ProductDto? product)
        {
            if (product == null)
            {
                return BadRequest("No body provided");
            }
            var imageLink = (await _azureBlobStorageService.UploadBlobAsync(product.Image.OpenReadStream(), product.Image.FileName + Guid.NewGuid().ToString())).ToString();
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
        [Authorize]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var pr = await _productService.DeleteProduct(id);
            if (pr == null)
            {
                return NotFound("Product not found");
            }
            return Ok(pr);
        }

        [HttpPatch("{id}")]
        [Authorize]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductDto product)
        {
            var pr = await _productService.GetProduct(id);
            if (pr == null)
            {
                return NotFound("Product not found");
            }


            await _azureBlobStorageService.DeleteBlobAsync(pr.Image.Split("/").Last());
            var image = (await _azureBlobStorageService.UploadBlobAsync(product.Image.OpenReadStream(), product.Image.FileName)).ToString();
            pr = ConvertToProduct(product, image, id);
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
