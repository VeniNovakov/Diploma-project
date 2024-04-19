using pizzeria_backend.Models.Interfaces;

namespace pizzeria_backend.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<RefreshDto> Register(RegisterDto user);
        public Task<RefreshDto> Login(LoginDto loginInfo);
        public Task Revoke(JWTRefreshDto tokens, string refreshToken);
        public Task<RefreshDto> Refresh(JWTRefreshDto jwtObj, string refreshToken);
    }
}
