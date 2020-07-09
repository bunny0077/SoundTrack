using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SoundTrack.Models;
using SoundTrack.ModelView;
using SoundTrack.SendingMail;
using SoundTrack.ViewModel;

namespace SoundTrack.Controllers
{
    public class HomeController : Controller
    {
        SoundTrackEntities _context = new SoundTrackEntities();
        public static readonly int USERTYPE = 2;
        public static readonly int membershipTypeId = 1;
        public static readonly int CREATEDBY = 2;

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult LogInUser(UserLogin usr)
        {
            User user = new User();
            var Password = EncryptionDecription.EncryptData(usr.Password);
            try
            {
                user = _context.Users.Where(c => c.Email == usr.Email && c.Isdeleted == false).FirstOrDefault();
                
                if (user == null)
                {
                    return Json(new { responseText = "NotFound" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var pass = EncryptionDecription.DecryptData(user.Password);
                    if (usr.Password == pass)
                    {
                        Session["User"] = user;
                        Session["UserId"] = user.Id;
                    }
                    else
                    {
                        return Json(new { responseText = "PassWordIncorrect" }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success", Id = user.Id }, JsonRequestBehavior.AllowGet);
        }

        //User Registration
        [HttpPost]
        public ActionResult UserRegistration(User user)
        {
            var Password = EncryptionDecription.EncryptData(user.Password);
            try
            {
                var checkEmail = _context.Users.Where(c => c.Email == user.Email).FirstOrDefault();
                if(checkEmail != null)
                    return Json(new { responseText = "AlreadyExist" }, JsonRequestBehavior.AllowGet);

                user.UserType = USERTYPE;
                user.CreatedDate = DateTime.Now;
                user.Password = Password;
                user.Isdeleted = false;
                user.CreatedBy = CREATEDBY;

                _context.Users.Add(user);
                _context.SaveChanges();

                if(user.Id > 0)
                {
                    Session["User"] = user;
                    Session["UserId"] = user.Id;
                }
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success",Id = user.Id }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult FilterCDs(string FilterText)
        {
            CDViewModel cds = new CDViewModel();
            var cdData = _context.sp_GetCD(FilterText).Select(x => new CDViewModel
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
                CDLeft = x.CDLeft,
                TypeName = x.Type
            }).ToList();

            if (cdData == null)
                return Json(new { responseText = "Empty" }, JsonRequestBehavior.AllowGet);

            return Json(new { responseText = "Success", cd = cdData }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CheckMemberShip()
        {
            var user = Session["User"] as User;
            MemberShipToUserViewModel mem = new MemberShipToUserViewModel();
            if (user != null)
            {
                mem = _context.MembershipToUsers.Where(c => c.UserId == user.Id && c.IsExpired == false && c.IsRequested == false)
                    .Select(x=> new MemberShipToUserViewModel()
                    { 
                        Id=x.Id,
                        MembershipNumber = x.MembershipNumber,
                        UserId = x.UserId,
                        DateCreated = x.DateCreated.ToString(),
                        DateExpired = x.DateExpired.ToString(),
                        IsRequested = x.IsRequested,
                        IsExpired = x.IsExpired,
                        MembershipTypeId = x.MembershipTypeId
                    }).FirstOrDefault();
                if (mem == null)
                    return Json(new { responseText = "NotFound" }, JsonRequestBehavior.AllowGet);

                if (mem.IsRequested == true)
                    return Json(new { responseText = "InProgress" }, JsonRequestBehavior.AllowGet);

                if (mem.IsExpired == true)
                    return Json(new { responseText = "Expired" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success", mem = mem }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult ApplyForMemberShip()
        {
            var user = Session["User"] as User;
            try
            {
                if(user == null)
                {
                    return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
                }
                string MembershipNumber = GenerateOtp.GenerateMembershipNumber();
                var ExpiryDate = GenerateOtp.ExpiryDate();
                MembershipToUser mem = new MembershipToUser()
                {
                    MembershipNumber = MembershipNumber,
                    DateCreated = DateTime.Now,
                    DateExpired = ExpiryDate,
                    MembershipTypeId = membershipTypeId,
                    IsExpired = false,
                    IsRequested = true,
                    UserId = user.Id
                };
                _context.MembershipToUsers.Add(mem);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
        //Get CD By Id 
        public ActionResult GetCDById(int Id)
        {
            var cdData = _context.CDs.Where(c => c.Id == Id).Select(x => new CDViewModel
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
            }).FirstOrDefault();
            return Json(new { responseText = "Success", cd = cdData }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult LogOut()
        {
            var user = Session["User"] as User;
            var admin = Session["Admin"] as User;
            if (user != null || admin != null)
            {
                Session["UserId"] = null;
                Session["User"] = null;
                Session["Admin"] = null;
                Session.Abandon();
                Session.Clear();
                Session.RemoveAll();
                System.Web.Security.FormsAuthentication.SignOut();
            }

            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult PurchaseCd(Order order, int[] cdIds)
        {
            if (order != null && cdIds.Length > 0)
            {
                var user = Session["User"] as User;
                if(user == null)
                {
                    return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
                }
                var orderNumber = GenerateOtp.GenerateOrderNumber();
                order.OrderNumber = Convert.ToInt32(orderNumber);
                order.UserId = user.Id;
                try
                {
                    _context.Orders.Add(order);
                    _context.SaveChanges();

                    if (order.Id > 0)
                    {
                        UserRentedCD cd = new UserRentedCD();
                        foreach (var Id in cdIds)
                        {
                            cd.OrderId = order.Id;
                            cd.CDId = Convert.ToInt32(Id);
                            _context.UserRentedCDs.Add(cd);
                            _context.SaveChanges();

                            var cdLeft = _context.CDs.Where(c => c.Id == Id).FirstOrDefault();
                            var remainingCD = cdLeft.CDLeft - membershipTypeId;
                            cdLeft.CDLeft = remainingCD;
                            _context.SaveChanges();

                        }
                    }
                    else
                    {
                        return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
                    }
                }
                catch (Exception)
                {
                    return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CheckEmail(string Email)
        {
            var genOTP = "";
            try
            {
                var getUserDb = _context.Users.Where(c => c.Email == Email).FirstOrDefault();
                if (getUserDb == null)
                    return Json(new { responseText = "UserNotFound" }, JsonRequestBehavior.AllowGet);

                genOTP = GenerateOtp.GenerateOtpNumber();

                SendingEmail.SendingEmails(Email, Email, genOTP, "Sending OTP", "Here is Your OTP :");
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { genratedOtp = genOTP, responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ChangePassword(string Email, string Password)
        {
            try
            {
                var EncryptPass = EncryptionDecription.EncryptData(Password);
                var getUserDb = _context.Users.Where(c => c.Email == Email).FirstOrDefault();

                getUserDb.Password = EncryptPass;
                _context.SaveChanges();
            }
            catch (Exception)
            {
                return Json(new { responseText = "Failue" }, JsonRequestBehavior.AllowGet);
            }

            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
    }
}