namespace pizzeria_backend.Models
{
    public class AddOnsCategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<AddOn> AddOns { get; } = new List<AddOn>();
    }
}
