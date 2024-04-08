using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;

namespace pizzeria_backend.Controllers
{
    [Route("api/add-ons/v1.0")]
    [ApiController]
    public class AddOnsController : Controller
    {
        private readonly IAddOnService _addOnService;

        public AddOnsController(IAddOnService addOnService)
        {
            _addOnService = addOnService;
        }

        [HttpPost()]
        [Authorize(Policy = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> AddAddOn([FromBody] AddOnDto addOn)
        {
            return Ok(await _addOnService.AddAddOn(ConvertToAddOn(addOn)));
        }

        [HttpGet()]
        [Produces("application/json")]
        public async Task<IActionResult> GetAddOns()
        {
            return Ok(await _addOnService.GetAllAddOns());
        }

        [HttpGet("{Id}")]
        [Produces("application/json")]
        public async Task<IActionResult> GetAddOn(int Id)
        {
            var addOn = await _addOnService.GetAddOn(Id);
            if (addOn == null)
            {
                return NotFound("Add on not found");
            }
            return Ok(addOn);
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateAddOn(int id, [FromBody] AddOnDto AddOn)
        {
            var addOn = await _addOnService.UpdateAddOn(ConvertToAddOn(AddOn, id));
            if (addOn == null)
            {
                return NotFound("Add on not found");
            }

            return Ok(addOn);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "Admin")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteAddOn(int id)
        {
            var addOn = await _addOnService.DeleteAddOn(id);

            if (addOn == null)
            {
                return NotFound("Add on not found");
            }

            return Ok(addOn);
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

        private static AddOn ConvertToAddOn(IAddOn addOn, int id)
        {
            return new AddOn
            {
                Id = id,
                Name = addOn.Name,
                Description = addOn.Description,
                CategoryId = addOn.CategoryId,
                Price = addOn.Price,
                AmountInGrams = addOn.AmountInGrams
            };
        }
    }
}
