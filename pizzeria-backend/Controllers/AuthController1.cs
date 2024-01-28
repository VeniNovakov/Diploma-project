using Microsoft.AspNetCore.Mvc;

namespace pizzeria_backend.Controllers
{
    [Route("api/auth/v1.0")]
    [ApiController]
    public class Auth : Controller
    {

        [HttpPost("register")]
        public IActionResult Reigster()
        {
            return null;
        }

        [HttpPost("login")]
        public IActionResult Login()
        {
            return null;
        }

        [HttpGet("access-token")]
        public IActionResult GetAccessToken()
        {
            return null;
        }

    }
}
