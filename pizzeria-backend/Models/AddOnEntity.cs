using pizzeria_backend.Models.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace pizzeria_backend.Models
{
    public class AddOn : IAddOn
    {

        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [ForeignKey("Category")]

        public int CategoryId { get; set; }
        [JsonIgnore]
        public AddOnsCategory Category { get; set; }
        public decimal Price { get; set; }
        public int AmountInGrams { get; set; }

        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<OrderedAddOn> OrderedAddOns { get; set; } = new List<OrderedAddOn>();
    }
}
