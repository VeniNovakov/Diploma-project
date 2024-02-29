using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/product-categories/v1.0")]
    [ApiController]
    public class ProductCategoriesController : Controller
    {
        IProductCategoriesService _productCategoriesService;

        public ProductCategoriesController(IProductCategoriesService productCategoriesService)
        {
            _productCategoriesService = productCategoriesService;

        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ctgs = await _productCategoriesService.GetAll();

            return Ok(ctgs);
        }
    }
}
