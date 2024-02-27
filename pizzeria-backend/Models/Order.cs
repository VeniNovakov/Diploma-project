using System.ComponentModel;

namespace pizzeria_backend.Models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime WantedFor { get; set; }

        public ICollection<OrderedProduct> OrderedProducts { get; set; } = new List<OrderedProduct>();

        [DefaultValue(false)]
        public bool IsCompleted { get; set; }
    }
}
