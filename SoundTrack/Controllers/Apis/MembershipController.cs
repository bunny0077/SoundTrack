using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using SoundTrack.Models;

namespace SoundTrack.Controllers.Apis
{
    public class MembershipController : ApiController
    {
        SoundTrackEntities _context = new SoundTrackEntities();

        [Route("api/getRequested")]
        public IHttpActionResult GetRequestedMembership()
        {
            List<MembershipRequest> data = new List<MembershipRequest>();

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
                        SortColumn = "DOB";
                        break;
                    case 3:
                        SortColumn = "MembershipNumber";
                        break;
                    default:
                        SortColumn = "Id";
                        break;
                }
                if (sortDirection == "asc")
                    SortOrder = "asc";
                else
                    SortOrder = "desc";
                data = _context.sp_GetMembershipRequest(start, searchvalue, totalLength, SortColumn, SortOrder).Select(x => new MembershipRequest()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Email = x.Email,
                    DOB = x.DOB,
                    MemberShipId = x.MemberShipId,
                    MembershipNumber = x.MembershipNumber
                }).ToList<MembershipRequest>();
                recordsTotal = _context.MembershipToUsers.Where(c => c.IsRequested == true).Count();//done
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure", data = data });
            }
            return Json(new { responseText = "Success", data = data, recordsTotal = recordsTotal, recordsFiltered = recordsTotal });
        }
    }
}
