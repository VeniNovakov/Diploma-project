﻿using Microsoft.AspNetCore.SignalR;

namespace pizzeria_backend.Hubs
{
    public class OrderHub : Hub
    {
        public override async Task OnConnectedAsync()
        {

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            await base.OnDisconnectedAsync(exception);
        }
    }

}