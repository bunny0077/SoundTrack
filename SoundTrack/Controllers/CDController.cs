using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SoundTrack.Models;
using SoundTrack.ViewModel;

namespace SoundTrack.Controllers
{
    public class CDController : Controller
    {
        SoundTrackEntities _context = new SoundTrackEntities();
        // GET: CD
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult CreateUpdateCD(CD cdOb)
        {
            var user = Session["Admin"] as User;
            try
            {
                if (cdOb != null && cdOb.Id == 0)
                {
                    cdOb.CreatedBy = user.Id;
                    cdOb.CreatedDate = DateTime.Now;
                    cdOb.CDLeft = cdOb.TotalCD;
                    _context.CDs.Add(cdOb);
                    _context.SaveChanges();
                }
                else
                {
                    var cd = _context.CDs.Where(c => c.Id == cdOb.Id).FirstOrDefault();
                    cd.Title = cdOb.Title;
                    cd.Publisher = cdOb.Publisher;
                    cd.Genre = cdOb.Genre;
                    cd.CDTypeId = cdOb.CDTypeId;
                    cd.GameMode = cdOb.GameMode;
                    cd.Developer = cdOb.Developer;
                    cd.Artist = cdOb.Artist;
                    cd.Composer = cdOb.Composer;
                    cd.Language = cdOb.Language;
                    cd.Cost = cdOb.Cost;
                    cd.TotalCD = cdOb.TotalCD;
                    cd.CDLeft = cdOb.TotalCD;
                    cd.ModifiedBy = user.Id;
                    cd.ModifiedDate = DateTime.Now;
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" },JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success", cd = cdOb },JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult FindCDById(int Id)
        {
            CDViewModel cdOb = new CDViewModel();
            try
            {
                cdOb = _context.CDs.Where(c => c.Id == Id).Select(x => new CDViewModel
                {
                    Id = x.Id,
                    Title = x.Title,
                    Publisher = x.Publisher,
                    Genre = x.Genre,
                    CDTypeId = x.CDTypeId,
                    GameMode = x.GameMode,
                    Developer = x.Developer,
                    Artist = x.Artist,
                    Composer = x.Composer,
                    Language = x.Language,
                    Cost = x.Cost,
                    TotalCD = x.TotalCD,
                    CDLeft = x.CDLeft
                }).SingleOrDefault();
                if (cdOb == null)
                    return Json(new { responseText = "NotFound" });
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" });
            }
            return Json(new { responseText = "Success", cd = cdOb }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DeleteCD(int Id)
        {
            var user = Session["Admin"] as User;
            try { 
            var cd = _context.CDs.Where(c => c.Id == Id).FirstOrDefault();
            cd.DeletedBy = user.Id;
            cd.DeletedDate = DateTime.Now;
            cd.IsDeleted = true;
            _context.SaveChanges();
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success"}, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult UploadImage(CDViewModel data)
        {
            try
            {
                var file = data.ImageFile;
                var Id = data.Id;
                if (file != null)
                {
                    file.SaveAs(Server.MapPath("/UploadImage/" + file.FileName));
                    BinaryReader reader = new BinaryReader(file.InputStream);
                    var CDObj = _context.CDs.Where(c => c.Id == Id).FirstOrDefault();
                    CDObj.ImageUrl = "/UploadImage/" + file.FileName;
                    _context.SaveChanges();
                }
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" });
            }
            return Json(new { responseText = "Success" });
        }
    }
}