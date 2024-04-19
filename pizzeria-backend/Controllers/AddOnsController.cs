using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services.Interfaces;

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
        [Authorize(Policy = "admin")]
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
            try
            {
                var addOn = await _addOnService.GetAddOn(Id);

                return Ok(addOn);
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPatch("{id}")]
        [Authorize(Policy = "admin")]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateAddOn(int id, [FromBody] AddOnDto AddOn)
        {
            try
            {
                var addOn = await _addOnService.UpdateAddOn(ConvertToAddOn(AddOn, id));

                return Ok(addOn);
            }
            catch (BadHttpRequestException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "admin")]
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
