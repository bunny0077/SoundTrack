using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using SoundTrack.Models;
using SoundTrack.ViewModel;

namespace SoundTrack.Controllers.Apis
{
    public class CustomerController : ApiController
    {
        SoundTrackEntities _context = new SoundTrackEntities();

        [HttpGet]
        [Route("api/getCustomers")]
        public IHttpActionResult Get()
        {
            List<UserViewModel> data = new List<UserViewModel>();

            NameValueCollection nvc = HttpUtility.ParseQueryString(Request.RequestUri.Query);
            var start = (Convert.ToInt32(nvc["start"]));
            var totalLength = (Convert.ToInt32(nvc["length"])) == 0 ? 10 : (Convert.ToInt32(nvc["length"]));
            var searchvalue = nvc["search[value]"] ?? "";
            var sortcoloumnIndex = Convert.ToInt32(nvc["order[0][column]"]);
            var SortColumn = "";
            var SortOrder = "";
            var sortDirection = nvc["order[0][dir]"] ?? "asc";
            var recordsTotal = 0;
            try
            {
                switch (sortcoloumnIndex)
                {
                    case 0:
                        SortColumn = "Name";
                        break;
                    case 1:
                        SortColumn = "Email";
                        break;
                    case 2:
                        SortColumn = "Phone";
                        break;
                    case 3:
                        SortColumn = "DOB";
                        break;
                    case 4:
                        SortColumn = "Address";
                        break;
                    default:
                        SortColumn = "Id";
                        break;
                }
                if (sortDirection == "asc")
                    SortOrder = "asc";
                else
                    SortOrder = "desc";
                data = _context.sp_GetUsersData(start, searchvalue, totalLength, SortColumn, SortOrder).Select(x => new UserViewModel() { 
                    Id = x.Id,
                    Name = x.Name,
                    Email = x.Email,
                    Phone = x.Phone,
                    DOB = x.DOB,
                    Address =x.Address
                }).ToList<UserViewModel>();
                recordsTotal = _context.Users.Where(c => c.Isdeleted == false).Count();//done
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure", data = data });
            }
            return Json(new { responseText = "", data = data, recordsTotal = recordsTotal, recordsFiltered = recordsTotal });
        }
    }
}
