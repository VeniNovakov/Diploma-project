namespace pizzeria_backend.Models.Interfaces
{
    public class RefreshDto
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
