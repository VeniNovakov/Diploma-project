namespace pizzeria_backend.Services
{
    public interface IExampleService
    {
        string Hello();
        string Goodbye();

    }
    public class Example : IExampleService
    {
        public Example()
        {

        }

        public string Hello()
        {
            return "Hello";

        }
        public string Goodbye()
        {
            return "Goodbye";

        }

    }
}