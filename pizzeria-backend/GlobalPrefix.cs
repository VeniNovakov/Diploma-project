namespace WebApplication2
{
    public class GlobalPrefix
    {
        private readonly RequestDelegate _next;
        private readonly string _routePrefix;
        public GlobalPrefix(RequestDelegate next, string routePrefix)
        {
            _next = next;
            _routePrefix = routePrefix;
        }
        public async Task InvokeAsync(HttpContext context)
        {
            context.Request.PathBase = new PathString(_routePrefix);
            await _next(context);
        }
    }
}
