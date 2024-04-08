using pizzeria_backend.Models;

namespace pizzeria_backend.Services.Interfaces
{
    public interface ITokenService
    {
        public string GenerateJWTAccess(User user);
        public string Generate64String();
        public string GenerateJwtRefreshToken(User user);
    }
}
