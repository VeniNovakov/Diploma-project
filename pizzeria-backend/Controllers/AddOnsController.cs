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
            var addOn = await _addOnService.GetAddOn(Id);
            if (addOn == null)
            {
                return BadRequest("Add on not found");

            }
            return Ok(addOn);
        }

        [HttpPatch()]
        [Produces("application/json")]
        public async Task<IActionResult> UpdateAddOn([FromBody] AddOn AddOn)
        {
            var addOn = await _addOnService.UpdateAddOn(ConvertToAddOn(AddOn));
            if (addOn == null)
            {
                return BadRequest("Add on not found");

            }

            return Ok(addOn);
        }

        [HttpDelete("{Id}")]
        [Produces("application/json")]
        public async Task<IActionResult> DeleteAddOn(int Id)
        {
            var addOn = await _addOnService.DeleteAddOn(Id);
            if (addOn == null)
            {
                return BadRequest("Add on not found");
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

    }
}
