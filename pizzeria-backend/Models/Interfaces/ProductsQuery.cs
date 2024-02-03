namespace pizzeria_backend.Models.Interfaces
{
    public class ProductsQuery
    {
        public int Limit;
        public int Page;
        public string Category;
        public bool IsInMenu;
        public bool IsAvailable;


    }
}
