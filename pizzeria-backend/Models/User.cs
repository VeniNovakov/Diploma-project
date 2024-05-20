namespace pizzeria_backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public string RefreshToken { get; set; }

        public Basket Basket { get; set; }

        public IEnumerable<Order> Orders = new List<Order>();


    }
}
