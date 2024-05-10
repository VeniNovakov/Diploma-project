using pizzeria_backend.Models.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;

namespace pizzeria_backend.Models
{
    public class AddOn : IAddOn
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        [ForeignKey("Category")]
        public int CategoryId { get; set; }

        public AddOnsCategory Category { get; set; }
        public decimal Price { get; set; }
        public int AmountInGrams { get; set; }
        public virtual IEnumerable<OrderedAddOn> OrderedAddOns { get; set; } =
            new List<OrderedAddOn>();
        public virtual IEnumerable<BasketAddOn> BasketedAddOns { get; set; } =
            new List<BasketAddOn>();
    }
}
