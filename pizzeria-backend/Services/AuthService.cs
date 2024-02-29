using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services
{

    public interface IAuthService
    {
        public Task<RefreshDto> Register(RegisterDto user);
        public Task<RefreshDto> Login(LoginDto loginInfo);
        public Task<RefreshDto> Revoke(JWTRefreshDto tokens, string refreshToken);
        public Task<RefreshDto> Refresh(JWTRefreshDto jwtObj, string refreshToken);

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
            var IsUser = (await FindByEmail(user.Email));
            if (IsUser is not null)
            {
                return null;
            }

            if (user.Password != user.ConfirmPassword)
            {
                return null;
            }

            var newUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                Password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.Password),
                IsAdmin = false
            };

            await _context.Users.AddAsync(newUser);
            var refreshToken = _tokenService.GenerateJwtRefreshToken(newUser);
            newUser.RefreshToken = BCrypt.Net.BCrypt.EnhancedHashPassword(refreshToken);

            var accessToken = _tokenService.GenerateJWTAccess(newUser);



            await _context.SaveChangesAsync();

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


            var accessToken = _tokenService.GenerateJWTAccess(user);
            var refreshToken = _tokenService.GenerateJwtRefreshToken(user);

            user.RefreshToken = BCrypt.Net.BCrypt.EnhancedHashPassword(refreshToken);
            await _context.SaveChangesAsync();

            return new RefreshDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

        }
        public async Task<RefreshDto> Refresh(JWTRefreshDto jwtObj, string refreshToken)
        {

            var user = (await FindById(jwtObj.Id));
            if (user is null)
            {
                Console.WriteLine("Chupi 1");
                return null;
            }

            var accessToken = _tokenService.GenerateJWTAccess(user);
            if (BCrypt.Net.BCrypt.EnhancedVerify(refreshToken, user.RefreshToken) is false)
            {
                Console.WriteLine("Chupi 2");

                return null;
            }

            return new RefreshDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

        }
        public async Task<RefreshDto> Revoke(JWTRefreshDto jwtObj, string refreshToken)
        {


            var user = (await FindById(jwtObj.Id));

            if (user is not null)
            {
                return null;
            }

            if (BCrypt.Net.BCrypt.EnhancedVerify(user.RefreshToken, refreshToken) is false)
            {
                return null;
            }

            user.RefreshToken = null;
            await _context.SaveChangesAsync();
            return null;

        }

        private async Task<User> FindByEmail(string Email)
        {
            return await _context.Users.Where(u => u.Email == Email).FirstOrDefaultAsync();
        }

        private async Task<User> FindById(int Id)
        {
            return await _context.Users.Where(u => u.Id == Id).FirstOrDefaultAsync();

        }

    }
}
