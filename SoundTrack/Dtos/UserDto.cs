using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoundTrack.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string DOB { get; set; }
        public string Address { get; set; }
        public int UserType { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public System.DateTime DeletedDate { get; set; }
        public bool Isdeleted { get; set; }
        public string Password { get; set; }
        public Nullable<long> Phone { get; set; }
        public string ImageUrl { get; set; }
        public MembershipToUsersDto membership { get; set; }
    }
}