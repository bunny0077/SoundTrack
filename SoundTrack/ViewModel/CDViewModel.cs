using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace SoundTrack.ViewModel
{
    public class CDViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage ="Please Enter A Title.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Please Enter Publisher Name.")]
        public string Publisher { get; set; }
        [Required(ErrorMessage = "Please Enter Genre.")]
        public string Genre { get; set; }
        public string Artist { get; set; }
        public string Composer { get; set; }
        public string Language { get; set; }
        public string GameMode { get; set; }
        public string Developer { get; set; }
        public int CDTypeId { get; set; }
        [Required(ErrorMessage = "Please Enter Cost.")]
        public Nullable<int> Cost { get; set; }
        [Required(ErrorMessage = "Please Enter Total CD.")]
        public Nullable<int> TotalCD { get; set; }
        public Nullable<int> CDLeft { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedDate { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedDate { get; set; }
        public Nullable<int> DeletedBy { get; set; }
        public Nullable<System.DateTime> DeletedDate { get; set; }
        public bool IsDeleted { get; set; }
        public string TypeName { get; set; }
        public HttpPostedFileWrapper ImageFile { get; set; }
    }
}