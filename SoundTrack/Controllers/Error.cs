using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SoundTrack.Controllers
{
    public class Error : Controller
    {
        // GET: PageNotFound
        public ActionResult PageNotFound()
        {
            return View();
        }
        public ActionResult ServerError()
        {
            return View();
        }
    }
}