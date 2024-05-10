using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace pizzeria_backend.Models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime WantedFor { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public User User { get; set; }

        public ICollection<OrderedProduct> OrderedProducts { get; set; } =
            new List<OrderedProduct>();

        [DefaultValue(false)]
        public bool IsCompleted { get; set; }
    }
}
