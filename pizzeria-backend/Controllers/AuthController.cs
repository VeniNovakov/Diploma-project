﻿using Microsoft.AspNetCore.Mvc;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services;
using System.Security.Claims;
using System.Security.Principal;
using System.Web.Http;
using Authorize = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;
using FromBody = Microsoft.AspNetCore.Mvc.FromBodyAttribute;
using HttpPost = Microsoft.AspNetCore.Mvc.HttpPostAttribute;

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
                return BadRequest("Email is already in use or passwords don't match");
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
        [@Authorize(Policy = "refreshToken")]
        public async Task<IActionResult> Refresh()
        {

            var refreshObj = DecodeRefreshToken(HttpContext.User.Identity);

            RefreshDto tokens = await _authService.Refresh(refreshObj);
            if (tokens is null)
            {
                return Unauthorized();
            }
            return Ok(tokens);
        }

        [HttpPost("revoke")]
        [@Authorize(Policy = "refreshToken")]
        public async Task<IActionResult> Revoke()
        {
            var refreshObj = DecodeRefreshToken(HttpContext.User.Identity);

            RefreshDto tokens = await _authService.Revoke(refreshObj);
            if (tokens is null)
            {
                return Unauthorized();
            }
            return Ok(tokens);


        }

        [@Authorize(Policy = "Admin")]
        [HttpPost("prot")]
        public async Task<IActionResult> ProtectedEndpoint([FromBody] RefreshDto refresh)
        {

            return Ok("Oh so you are an admin, cool");


        }

        private JWTRefreshDto DecodeRefreshToken(IIdentity identity)
        {
            var claimsRepo = identity as ClaimsIdentity;
            if (claimsRepo.FindFirst("Id") == null)
            {
                return null;
            }
            var refreshObj = new JWTRefreshDto
            {
                Id = Int32.Parse(claimsRepo.FindFirst("Id").Value),
                randGuid = claimsRepo.FindFirst("randGuid").Value
            };
            return refreshObj;
        }

    }
}
