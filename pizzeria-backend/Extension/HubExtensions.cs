using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using pizzeria_backend.Hubs;

namespace pizzeria_backend.Extension
{
    public static class SignalRHubExtension
    {
        public static Task SendJsonAsync<THub>(
            this IHubContext<THub> hubContext,
            string methodName,
            object payload
        )
            where THub : OrderHub
        {
            var settings = new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                ContractResolver = new CamelCasePropertyNamesContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                }
            };

            var jsonPayload = JsonConvert.SerializeObject(payload, settings);

            return hubContext.Clients.All.SendAsync(methodName, jsonPayload);
        }
    }
}
