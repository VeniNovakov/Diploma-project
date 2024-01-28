using Microsoft.AspNetCore.Mvc;

namespace pizzeria_backend.Controllers
{
    [Route("api/add-ons/v1.0")]
    [ApiController]
    public class AddOnsController : Controller
    {

        [HttpPost()]
        [Produces("application/json")]
        public async Task<IActionResult> AddAddOn()
        {
            return null;
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
    }
}
