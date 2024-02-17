using Microsoft.AspNetCore.Identity;

namespace pizzeria_backend.Models
{
    public class User : IdentityUser
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public string RefreshToken { get; set; }

    }
}
