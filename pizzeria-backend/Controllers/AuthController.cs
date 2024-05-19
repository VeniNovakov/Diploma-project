using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services.Interfaces;
using System.Security.Claims;
using System.Security.Principal;

namespace pizzeria_backend.Controllers
{
    [Route("api/auth/v1.0")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto? user)
        {
            try
            {
                RefreshDto tokens = await _authService.Register(user);


                return Ok(tokens);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto login)
        {
            try
            {
                RefreshDto tokens = await _authService.Login(login);

                return Ok(tokens);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("refresh")]
        [Authorize(Policy = "refreshToken")]
        public async Task<IActionResult> Refresh()
        {
            try
            {
                string token = getTokenFromHeader(HttpContext);
                Console.WriteLine(token);

                var refreshObj = DecodeRefreshToken(identity: HttpContext.User.Identity);
                Console.WriteLine(refreshObj.Id);


                RefreshDto tokens = await _authService.Refresh(refreshObj, token);

                return Ok(tokens);
            }
            catch (BadHttpRequestException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("revoke")]
        [Authorize(Policy = "refreshToken")]
        public async Task<IActionResult> Revoke()
        {
            try
            {
                string token = getTokenFromHeader(HttpContext);

                var refreshObj = DecodeRefreshToken(HttpContext.User.Identity);

                await _authService.Revoke(refreshObj, token);

                return Ok();
            }
            catch (BadHttpRequestException ex)
            {

                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("isAdmin")]
        [Authorize]
        public async Task<IActionResult> IsAdmin()
        {
            var claimsRepo = HttpContext.User.Identity as ClaimsIdentity;

            if (claimsRepo == null)
            {
                return BadRequest();
            }

            return Ok(Boolean.Parse(claimsRepo.FindFirst("admin").Value));
        }

        private string getTokenFromHeader(HttpContext httpContext)
        {
            if (httpContext == null)
            {
                throw new Exception("No token provided");
            }
            return httpContext.Request!.Headers["Authorization"]!.FirstOrDefault(h =>
                h.StartsWith("Bearer ")
            ).Substring(7);
        }

        private JWTRefreshDto DecodeRefreshToken(IIdentity identity)
        {
            var claimsRepo = identity as ClaimsIdentity;
            if (claimsRepo == null)
            {
                throw new BadHttpRequestException("No claims in token");
            }
            if (claimsRepo.FindFirst("id") == null || claimsRepo.FindFirst("randGuid") == null)
            {
                Console.WriteLine("claims problem check");
                throw new BadHttpRequestException("Claims do not match");
            }
            var refreshObj = new JWTRefreshDto
            {
                Id = Int32.Parse(claimsRepo.FindFirst("id").Value),
                randGuid = claimsRepo.FindFirst("randGuid").Value
            };
            return refreshObj;
        }
    }
}
