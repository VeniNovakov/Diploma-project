using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace pizzeria_backend.Models
{
    public class OrderedProduct
    {
        public int Id { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        [JsonIgnore]
        public Product Product { get; set; }

        [ForeignKey("Order")]
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int Amount { get; set; }
        public IEnumerable<OrderedAddOn> AddOns { get; set; } = new List<OrderedAddOn>();
    }
}
