using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/add-on-categories/v1.0")]
    [ApiController]
    public class AddOnCategoriesController : Controller
    {
        IAddOnCategoriesService _addOnCategoriesService;
        public AddOnCategoriesController(IAddOnCategoriesService addOnCategoriesService)
        {
            _addOnCategoriesService = addOnCategoriesService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var ctgs = await _addOnCategoriesService.GetAll();

            return Ok(ctgs);
        }
    }
}
