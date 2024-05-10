using Microsoft.IdentityModel.Tokens;
using pizzeria_backend.Models;
using pizzeria_backend.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace pizzeria_backend.Services
{
    public class TokenService(IConfiguration config) : ITokenService
    {
        public readonly IConfiguration _config = config;

        public string GenerateJWTAccess(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim("name", user.Name),
                new Claim("email", user.Email),
                new Claim("admin", user.IsAdmin.ToString()),
            };

            var JwtAccess = CreateJWTSecurityToken(
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.AddMinutes(7)
            );
            var accToken = new JwtSecurityTokenHandler().WriteToken(JwtAccess);
            return accToken;
        }

        public string Generate64String()
        {
            var refresh = new byte[64];
            using var generator = RandomNumberGenerator.Create();
            generator.GetBytes(refresh);
            return Convert.ToBase64String(refresh);
        }

        public string GenerateJwtRefreshToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString()),
                new Claim("randGuid", this.Generate64String())
            };

            var JwtRefresh = CreateJWTSecurityToken(
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.AddDays(30)
            );

            var refreshToken = new JwtSecurityTokenHandler().WriteToken(JwtRefresh);
            return refreshToken;
        }

        private JwtSecurityToken CreateJWTSecurityToken(
            IEnumerable<Claim> claims,
            DateTime before,
            DateTime expires
        )
        {
            return new JwtSecurityToken(
                claims: claims,
                audience: _config["JWT:Audience"],
                issuer: _config["JWT:Issuer"],
                notBefore: before,
                expires: expires,
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]!)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            );
        }
    }
}
