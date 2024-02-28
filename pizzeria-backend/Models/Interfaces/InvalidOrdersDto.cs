namespace pizzeria_backend.Models.Interfaces
{
    public class InvalidOrdersDto
    {
        public ICollection<int> ProductIds { get; set; }
        public ICollection<int> AddOnIds { get; set; }
    }
}
