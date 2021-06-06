using Microsoft.AspNetCore.SignalR;
using SignalR_Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR_Core.Hubs
{
    //all online user list
    public static class UserHandler
    {
        public static List<UserData> user = new List<UserData>();
    }

    public class ChatHub : Hub
    {
        /// <summary>
        ///  send message from client
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        /// <summary>
        /// client connects
        /// </summary>
        /// <param name="username"></param>
        public void UserConnected(string username)
        {
            var model = UserHandler.user.FirstOrDefault(x => x.id == Context.ConnectionId);

            if (model == null)
            {
                model = new UserData
                {
                    id = Context.ConnectionId,
                    name = username
                };

                UserHandler.user.Add(model);
            }

            Clients.All.SendAsync("AddUser", model);
        }

        /// <summary>
        /// clients offline
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            var item = UserHandler.user.FirstOrDefault(x => x.id == Context.ConnectionId);
            if (item != null)
            {
                UserHandler.user.Remove(item);

                Clients.All.SendAsync("UserOffline", item.name);
            }
            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// get lastest userlist
        /// </summary>
        public void GetLastestUsetList()
        {
            var list = UserHandler.user.Select(x => x.name);
            Clients.All.SendAsync("UsetList", list);
        }
    }
}