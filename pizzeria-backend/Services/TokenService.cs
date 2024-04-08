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
                new Claim("Id", user.Id.ToString()),
                new Claim("Name", user.Name),
                new Claim("Email", user.Email),
                new Claim("IsAdmin", user.IsAdmin.ToString()),
            };

            var JwtAcc = new JwtSecurityToken(
                claims: claims,
                audience: _config["JWT:Audience"],
                issuer: _config["JWT:Issuer"],
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(5),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]!)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            );
            var accToken = new JwtSecurityTokenHandler().WriteToken(JwtAcc);
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
                new Claim("Id", user.Id.ToString()),
                new Claim("randGuid", this.Generate64String())
            };

            var JwtAcc = new JwtSecurityToken(
                claims: claims,
                audience: _config["JWT:Audience"],
                issuer: _config["JWT:Issuer"],
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddDays(30),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]!)),
                    SecurityAlgorithms.HmacSha256Signature
                )
            );
            var refreshToken = new JwtSecurityTokenHandler().WriteToken(JwtAcc);
            return refreshToken;
        }
    }
}
