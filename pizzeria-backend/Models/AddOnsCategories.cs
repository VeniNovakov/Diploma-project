namespace pizzeria_backend.Models
{
    public class AddOnsCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<AddOn> AddOns { get; } = new List<AddOn>();
    }
}
