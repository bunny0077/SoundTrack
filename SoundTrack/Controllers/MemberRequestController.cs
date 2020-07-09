using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SoundTrack.Models;

namespace SoundTrack.Controllers
{
    public class MemberRequestController : Controller
    {
        SoundTrackEntities _context = new SoundTrackEntities();
        // GET: MemberRequest
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult HandleMemberRequest(MembershipToUser mem)
        {
            if (mem.IsRequested == null)
                mem.IsRequested = false;
            if (mem.IsExpired == null)
                mem.IsExpired = false;
            var membership = _context.MembershipToUsers.Where(c => c.Id == mem.Id).FirstOrDefault();
            membership.IsExpired = mem.IsExpired;
            membership.IsRequested = mem.IsRequested;
            _context.SaveChanges();

            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
    }
}