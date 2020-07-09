using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SoundTrack.Models;

namespace SoundTrack.ViewModel
{
    public class UserMembershipType
    {
        public MembershipTypeViewModel Membership { get; set; }
        public UserViewModel User { get; set; }
        public CDViewModel CD { get; set; }
        public CDTypeViewModel CDsType { get; set; }
    }
}