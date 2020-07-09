using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SoundTrack.Models;

namespace SoundTrack.Controllers
{
    public class AdminController : Controller
    {
        private static readonly int USERTYPEADMIN = 1;
        //private static readonly int USERTYPECUSTOMER = 2;
        SoundTrackEntities _context = new SoundTrackEntities();
        // GET: Admin
        public ActionResult Index()
        {
            if (Session["Admin"] != null)
                return RedirectToAction("Home", "Admin");

            return View();
        }
        public ActionResult Home()
        {
            var user = Session["Admin"] as User;

            if (user == null)
                return RedirectToAction("Index", "Admin");
            return View();
        }
        [HttpPost]
        public ActionResult Login(User objUser)
        {
            var Password = SoundTrack.ModelView.EncryptionDecription.EncryptData(objUser.Password);
            var obj = _context.Users.Where(a => a.Email.Equals(objUser.Email) && a.UserType == USERTYPEADMIN).FirstOrDefault();
            if (obj != null)
            {
                if (obj.Password == Password)
                {
                    Session["UserId"] = obj.Id;
                    Session["Admin"] = obj;
                }
                else
                {
                    return Json(new { responseText = "PasswordIncorrect" }, JsonRequestBehavior.AllowGet);
                }
                //return RedirectToAction("UserData", "Home");
            }
            else
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetCdData()
        {

            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
    }
}