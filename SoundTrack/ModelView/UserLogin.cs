using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SoundTrack.ModelView
{
    public class UserLogin
    {
        [Required(ErrorMessage ="Please Enter Email.")]
        public string Email { get; set; }
        [Required(ErrorMessage ="Please Enter Password")]
        public string Password { get; set; }
    }
}