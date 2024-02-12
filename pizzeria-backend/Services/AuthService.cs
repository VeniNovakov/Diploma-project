using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using System.Security.Claims;

namespace pizzeria_backend.Services
{

    public interface IAuthService
    {
        public (string refreshToken, string accessToken) Register(RegisterDto user);
        public void Login();
        public void Revoke();
        public void Logout();
        public string Refresh(string token);

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
        public (string refreshToken, string accessToken) Register(RegisterDto user)
        {
            if (user.Password != user.ConfirmPassword)
            {
                return (" ", " ");
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

            return (refreshToken, accessToken);


        }
        public void Login()
        {

        }
        public string Refresh(string token)
        {
            var pr = _tokenService.GetPrincipalTokenExpiredToken(token).Identity as ClaimsIdentity;

            Console.WriteLine(pr);
            return " ";
        }
        public void Revoke()
        {

        }
        public void Logout()
        {

        }
        private async Task<User> FindByEmail(string Email)
        {
            return await _context.Users.Where(u => u.Email == Email).FirstOrDefaultAsync();
        }

    }
}
