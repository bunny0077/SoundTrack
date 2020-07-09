using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoundTrack.ViewModel
{
    public class MemberShipToUserViewModel
    {
        public int Id { get; set; }
        public string MembershipNumber { get; set; }
        public Nullable<int> Cost { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> MembershipTypeId { get; set; }
        public string DateCreated { get; set; }
        public string DateExpired { get; set; }
        public Nullable<bool> IsRequested { get; set; }
        public Nullable<bool> IsExpired { get; set; }
    }
}