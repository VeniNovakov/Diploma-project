using Microsoft.IdentityModel.Tokens;
using pizzeria_backend.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace pizzeria_backend.Services
{

    public interface ITokenService
    {

        public string GenerateJWTAccess(User user);
        public string GenerateRefreshToken();
        public ClaimsPrincipal GetPrincipalTokenExpiredToken(string token);
    }
    public class TokenService(IConfiguration config) : ITokenService
    {
        public readonly IConfiguration _config = config;


        public string GenerateJWTAccess(User user)
        {
            var claims = new List<Claim> {
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
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: new SigningCredentials(
                    new SymmetricSecurityKey(
                       Encoding.UTF8.GetBytes(config["JWT:Key"]!)
                        ),
                    SecurityAlgorithms.HmacSha256Signature)
                );
            var accToken = new JwtSecurityTokenHandler().WriteToken(JwtAcc);
            return accToken;
        }
        public string GenerateRefreshToken()
        {
            var refresh = new byte[64];
            using var generator = RandomNumberGenerator.Create();
            generator.GetBytes(refresh);
            return Convert.ToBase64String(refresh);

        }
        public ClaimsPrincipal GetPrincipalTokenExpiredToken(string token)
        {

            var validation = new TokenValidationParameters
            {
                ValidIssuer = config["JWT:Issuer"],
                ValidAudience = config["JWT:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]!)),
                ValidateAudience = true,
                ValidateLifetime = false,
                ValidateIssuer = true,
            };
            return new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
        }
    }

}
