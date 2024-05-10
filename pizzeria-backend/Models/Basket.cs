using System.ComponentModel.DataAnnotations.Schema;

namespace pizzeria_backend.Models
{
    public class Basket
    {
        public int Id { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }

        public User User { get; set; }

        public ICollection<BasketProduct> BasketProducts { get; set; } =
            new List<BasketProduct>();
    }
}
