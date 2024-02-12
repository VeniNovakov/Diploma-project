using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using System.Security.Claims;

namespace pizzeria_backend.Services
{

    public interface IAuthService
    {
        public Task<RefreshDto> Register(RegisterDto user);
        public Task<RefreshDto> Login(LoginDto loginInfo);
        public Task<RefreshDto> Revoke(RefreshDto tokens);
        public Task<RefreshDto> Refresh(RefreshDto tokens);

    }
    public class AuthService : IAuthService
    {

        AppDbContext _context;
        ITokenService _tokenService;

        public AuthService(AppDbContext context, ITokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }
        public async Task<RefreshDto> Register(RegisterDto user)
        {
            /*  var IsUser = (await FindByEmail(user.Email));
              if (user is not null)
              {
                  return null;
              }
            */

            if (user.Password != user.ConfirmPassword)
            {
                return null;
            }

            var refreshToken = _tokenService.GenerateRefreshToken();
            var newUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                Password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password),
                RefreshToken = refreshToken,
                RefreshTokenExpiry = DateTime.UtcNow.AddDays(30),
                IsAdmin = false
            };

            var accessToken = _tokenService.GenerateJWTAccess(newUser);

            return new RefreshDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };


        }
        public async Task<RefreshDto> Login(LoginDto loginInfo)
        {

            var user = (await FindByEmail(loginInfo.Email));

            if (BCrypt.Net.BCrypt.EnhancedVerify(loginInfo.Password, user.Password) is false)
            {
                return null;
            }


            //when table is added update refresh token

            var accessToken = _tokenService.GenerateJWTAccess(user);
            var refreshToken = _tokenService.GenerateRefreshToken();

            return new RefreshDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

        }
        public async Task<RefreshDto> Refresh(RefreshDto tokens)
        {
            var pr = _tokenService.GetPrincipalTokenExpiredToken(tokens.AccessToken).Identity as ClaimsIdentity;
            if (pr?.FindFirst("Email")?.Value is null)
            {
                return null;
            }
            /*
            var user = (await FindByEmail(pr.FindFirst("Email")!.Value!));
            if (user is not null)
            {
                return null;
            }
            //when table implemented add check if refresh token is the same as the refresh stored for the user
            */

            return null; //not permanent thing, code below is the thing its supposed to be

            /*return new RefreshDto
            {
                AccessToken = _tokenService.GenerateJWTAccess(user),
                RefreshToken = tokens.RefreshToken
            };
            */
        }
        public async Task<RefreshDto> Revoke(RefreshDto tokens)
        {
            var pr = _tokenService.GetPrincipalTokenExpiredToken(tokens.AccessToken).Identity as ClaimsIdentity;
            if (pr?.FindFirst("Email")?.Value is null)
            {
                return null;
            }
            /*
            var user = (await FindByEmail(pr.FindFirst("Email")!.Value!));
            if (user is not null)
            {
                return null;
            }
            // if user.RefreshToken != tokens.refreshToken => null
            user.RefreshToken = null;

            //save
            */
            return null;

        }

        private async Task<User> FindByEmail(string Email)
        {
            return await _context.Users.Where(u => u.Email == Email).FirstOrDefaultAsync();
        }

    }
}
