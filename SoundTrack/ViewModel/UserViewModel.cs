using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SoundTrack.ViewModel
{
    public class UserViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Please Enter A Name.")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Please Enter Email.")]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}" + @"\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\" + @".)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$", ErrorMessage = "Email Not Valid(example@abc.com)")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Please Enter DOB.")]
        public string DOB { get; set; }
        [MaxLength(150, ErrorMessage = "Character Limit Exceed(150 Characters Only)")]
        [Required(ErrorMessage = "Please Enter Address.")]
        public string Address { get; set; }

        public int UserType { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedDate { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedDate { get; set; }
        public int DeletedBy { get; set; }
        public System.DateTime DeletedDate { get; set; }
        public bool Isdeleted { get; set; }

        [Required(ErrorMessage = "Please Enter A Password.")]
        [StringLength(18, ErrorMessage = "The {0} must be at least {2} characters long.", MinimumLength = 8)]
        [RegularExpression(@"^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)).+$", ErrorMessage = "Password Not Valid(8 characters ,one capital, one numeric and one special character)")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Please Re-enter Password.")]
        [Compare("Password", ErrorMessage = "Password Doesn't Match")]
        public string ConfirmPassword { get; set; }

        [Required]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Invalid Phone Number(10)")]
        public long? Phone { get; set; }
    }
}