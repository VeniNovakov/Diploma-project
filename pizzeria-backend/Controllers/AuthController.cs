using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;
using System.Web.Http;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;
using FromBodyAttribute = Microsoft.AspNetCore.Mvc.FromBodyAttribute;
using HttpGetAttribute = Microsoft.AspNetCore.Mvc.HttpGetAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

namespace pizzeria_backend.Controllers
{
    [Route("api/auth/v1.0")]
    [ApiController]
    public class Auth(IAuthService authService) : Controller
    {

        private readonly IAuthService _authService = authService;
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto? user)
        {
            var obj = _authService.Register(user);

            return Ok(obj);
        }

        [HttpPost("login")]
        public IActionResult Login()
        {
            return Ok();
        }

        [HttpPost("refresh")]
        public IActionResult Refresh([FromBody] RefreshDto refresh)
        {
            _authService.Refresh(refresh.AccessToken);
            return Ok();
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult prot()
        {
            return Ok(HttpContext.User.Claims.ToList());
        }

    }
}
