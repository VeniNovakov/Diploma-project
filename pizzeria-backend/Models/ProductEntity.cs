using pizzeria_backend.Models.Interfaces;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace pizzeria_backend.Models
{
    public class Product : IProductDto
    {
        public int Id { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        [ForeignKey("Category")]
        public int CategoryId { get; set; }
        [JsonIgnore]
        public ProductsCategory Category { get; set; }

        public bool IsInMenu { get; set; }
        public bool IsAvailable { get; set; }
        [JsonIgnore]
        [IgnoreDataMember]
        public virtual ICollection<OrderedProduct> OrderedProducts { get; set; } = new List<OrderedProduct>();
    }


}
