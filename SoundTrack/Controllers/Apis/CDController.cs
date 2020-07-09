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
    public class CDController : ApiController
    {
        SoundTrackEntities _context = new SoundTrackEntities();

        [HttpGet]
        [Route("cd/getCDData")]
        public IHttpActionResult Get()
        {
            List<CDsTypeView> data = new List<CDsTypeView>();

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
                        SortColumn = "Title";
                        break;
                    case 1:
                        SortColumn = "Publisher";
                        break;
                    case 2:
                        SortColumn = "Genre";
                        break;
                    case 3:
                        SortColumn = "Type";
                        break;
                    case 4:
                        SortColumn = "Cost";
                        break;
                    default:
                        SortColumn = "Id";
                        break;
                }
                if (sortDirection == "asc")
                    SortOrder = "asc";
                else
                    SortOrder = "desc";
                data = _context.sp_GetCDData(start, searchvalue, totalLength, SortColumn, SortOrder).ToList<CDsTypeView>();
                recordsTotal = _context.CDs.Where(c =>  c.IsDeleted == false).Count();//done
                }
                catch(Exception)
                {
                return Json(new { responseText = "Failure", data = data });
                }
            return Json(new { responseText = "", data = data, recordsTotal = recordsTotal, recordsFiltered = recordsTotal });
        }
    }
}
