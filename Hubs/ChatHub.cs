using Microsoft.AspNetCore.SignalR;
using SignalR_Core.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalR_Core.Hubs
{
    //目前所有連線的list
    public static class UserHandler
    {
        public static List<UserData> user = new List<UserData>();
    }

    public class ChatHub : Hub
    {
        /// <summary>
        ///  客戶端發送消息
        /// </summary>
        /// <param name="user"></param>
        /// <param name="message"></param>
        /// <returns></returns>
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        /// <summary>
        /// 客戶端連接時觸發
        /// </summary>
        /// <param name="username"></param>
        public void UserConnected(string username)
        {
            //使用者連線 加入清單
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

            Clients.All.SendAsync("AddUser", model);//呼叫前端function
        }

        /// <summary>
        /// 客戶端離線時觸發
        /// </summary>
        /// <param name="exception"></param>
        /// <returns></returns>
        public override Task OnDisconnectedAsync(System.Exception exception)
        {
            var item = UserHandler.user.FirstOrDefault(x => x.id == Context.ConnectionId);
            if (item != null)
            {
                UserHandler.user.Remove(item);//刪除

                Clients.All.SendAsync("UserOffline", item.name);  //呼叫前端function
            }
            return base.OnDisconnectedAsync(exception);
        }

        public void GetLastestUsetList()
        {
            var list = UserHandler.user.Select(x => x.name);
            Clients.All.SendAsync("UsetList", list);
        }
    }
}