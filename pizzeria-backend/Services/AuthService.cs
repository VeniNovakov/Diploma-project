using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services
{

    public interface IAuthService
    {
        public Task<RefreshDto> Register(RegisterDto user);
        public Task<RefreshDto> Login(LoginDto loginInfo);
        public Task<RefreshDto> Revoke(JWTRefreshDto tokens);
        public Task<RefreshDto> Refresh(JWTRefreshDto jwtObj);

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
            /*var IsUser = (await FindByEmail(user.Email));
              if (user is not null)
              {
                  return null;
              }
            */

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
            var refreshToken = _tokenService.GenerateJwtRefreshToken(newUser);
            newUser.RefreshToken = refreshToken;

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
            var refreshToken = _tokenService.GenerateJwtRefreshToken(user);

            return new RefreshDto
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };

        }
        public async Task<RefreshDto> Refresh(JWTRefreshDto jwtObj)
        {
            //var pr = _tokenService.GetPrincipalTokenExpiredToken(tokens.AccessToken).Identity as ClaimsIdentity;

            /*
            var user = (await FindById(jwtObj.Id);
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
        public async Task<RefreshDto> Revoke(JWTRefreshDto jwtObj)
        {


            var user = (await FindById(jwtObj.Id));

            if (user is not null)
            {
                return null;
            }
            /*
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

        private async Task<User> FindById(int Id)
        {
            return await _context.Users.Where(u => u.Id == Id).FirstOrDefaultAsync();

        }

    }
}
