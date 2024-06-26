﻿using Isopoh.Cryptography.Argon2;
using Microsoft.EntityFrameworkCore;
using pizzeria_backend.Models;
using pizzeria_backend.Models.Interfaces;
using pizzeria_backend.Services.Interfaces;

namespace pizzeria_backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
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
                throw new BadHttpRequestException("Email is already in use", statusCode: 401);
            }

            if (user.Password != user.ConfirmPassword)
            {
                throw new BadHttpRequestException("Wrong confirm password", statusCode: 401);
            }

            var newUser = new User
            {
                Name = user.Name,
                Email = user.Email,
                Password = Argon2.Hash(user.Password),
                IsAdmin = false
            };

            await _context.Users.AddAsync(newUser);
            var refreshToken = _tokenService.GenerateJwtRefreshToken(newUser);
            newUser.RefreshToken = Argon2.Hash(refreshToken);

            var accessToken = _tokenService.GenerateJWTAccess(newUser);

            await _context.SaveChangesAsync();

            return new RefreshDto { AccessToken = accessToken, RefreshToken = refreshToken };
        }

        public async Task<RefreshDto> Login(LoginDto loginInfo)
        {
            var user = (await FindByEmail(loginInfo.Email));

            if (user is null)
            {

                throw new BadHttpRequestException("User with requested credentials does not exist");
            }

            if (Argon2.Verify(user.Password, loginInfo.Password) is false)
            {
                throw new BadHttpRequestException("Incorrect password", statusCode: 401);
            }

            var accessToken = _tokenService.GenerateJWTAccess(user);
            var refreshToken = _tokenService.GenerateJwtRefreshToken(user);

            user.RefreshToken = Argon2.Hash(refreshToken);

            _context.Entry(user).Property(u => u.RefreshToken).IsModified = true;

            await _context.SaveChangesAsync();

            return new RefreshDto { AccessToken = accessToken, RefreshToken = refreshToken };
        }

        public async Task<RefreshDto> Refresh(JWTRefreshDto jwtObj, string refreshToken)
        {
            var user = (await FindById(jwtObj.Id));
            if (user is null)
            {
                throw new BadHttpRequestException("Unauthorized", statusCode: 401);
            }

            var accessToken = _tokenService.GenerateJWTAccess(user);
            if (Argon2.Verify(user.RefreshToken, refreshToken) is false)
            {
                throw new BadHttpRequestException("Unauthorized", statusCode: 401);
            }

            return new RefreshDto { AccessToken = accessToken, RefreshToken = refreshToken };
        }

        public async Task Revoke(JWTRefreshDto jwtObj, string refreshToken)
        {
            var user = (await FindById(jwtObj.Id));

            if (user is null)
            {
                throw new BadHttpRequestException("Unauthorized", statusCode: 401);
            }

            if (Argon2.Verify(refreshToken, user.RefreshToken) is false)
            {
                throw new BadHttpRequestException("Unauthorized", statusCode: 401);
            }

            user.RefreshToken = null;
            _context.Entry(user).Property(u => u.RefreshToken).IsModified = true;

            await _context.SaveChangesAsync();
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
