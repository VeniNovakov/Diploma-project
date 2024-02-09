using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace pizzeria_backend.Models
{
    public class OrderedAddOn
    {
        public int Id { get; set; }
        [ForeignKey("AddOn")]
        public int AddOnId { get; set; }
        public AddOn AddOn { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }
        [JsonIgnore]
        public OrderedProduct Product { get; set; }
        public int Amount { get; set; }
    }
}
