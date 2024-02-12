using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;
using System.Web.Http;
using FromBodyAttribute = Microsoft.AspNetCore.Mvc.FromBodyAttribute;
using HttpPostAttribute = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

namespace pizzeria_backend.Controllers
{
    [Route("api/auth/v1.0")]
    [ApiController]
    public class Auth(IAuthService authService) : Controller
    {

        private readonly IAuthService _authService = authService;
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto? user)
        {
            RefreshDto tokens = await _authService.Register(user);
            if (tokens is null)
            {
                return BadRequest("Email is already in use or passwords dont match");
            }
            return Ok(tokens);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            RefreshDto tokens = await _authService.Login(login);
            if (tokens is null)
            {
                return BadRequest("Bad credentials");
            }
            return Ok();
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshDto refresh)
        {
            RefreshDto tokens = await _authService.Refresh(refresh);
            if (tokens is null)
            {
                return Unauthorized();
            }
            return Ok(tokens);
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> Revoke([FromBody] RefreshDto refresh)
        {
            RefreshDto tokens = await _authService.Revoke(refresh);
            if (tokens is null)
            {
                return Unauthorized();
            }
            return Ok(tokens);


        }

    }
}
