using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace pizzeria_backend.Models
{
    public class BasketProduct
    {
        public int Id { get; set; }

        [ForeignKey("Product")]
        public int ProductId { get; set; }

        [JsonIgnore]
        public Product Product { get; set; }


        [ForeignKey("Basket")]
        public int BasketId { get; set; }

        public Basket Basket { get; set; }

        public int Amount { get; set; }

        public IEnumerable<BasketAddOn> AddOns { get; set; } = new List<BasketAddOn>();
    }
}
