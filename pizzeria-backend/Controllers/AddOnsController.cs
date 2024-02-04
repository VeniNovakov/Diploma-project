using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/add-ons/v1.0")]
    [ApiController]
    public class AddOnsController(IAddOnService addOnService) : Controller
    {

        private readonly IAddOnService _addOnService = addOnService;

        [HttpPost()]
        [Produces("application/json")]
        public async Task<IActionResult> AddAddOn([FromBody] AddOnDto addOn)
        {

            return Ok(await _addOnService.AddAddOn(ConvertToAddOn(addOn)));
        }

        [HttpGet("{Id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAddOn(int Id)
        {

            return Ok(await _addOnService.GetAddOn(Id));
        }

        [HttpPatch("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateAddOn(int id)
        {
            return null;
        }

        [HttpDelete("{id}")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteAddOn(int id)
        {
            return null;
        }


        private static AddOn ConvertToAddOn(IAddOn addOn)
        {
            return new AddOn
            {
                Name = addOn.Name,
                Description = addOn.Description,
                CategoryId = addOn.CategoryId,
                Price = addOn.Price,
                AmountInGrams = addOn.AmountInGrams
            };

        }
    }
}
