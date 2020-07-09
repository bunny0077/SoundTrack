using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SoundTrack.Dtos;
using SoundTrack.Models;
using SoundTrack.ModelView;
using SoundTrack.ViewModel;

namespace SoundTrack.Controllers
{
    public class UserController : Controller
    {
        private static readonly int USERTYPE = 2;
        SoundTrackEntities _context = new SoundTrackEntities();
        // GET: User
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Create(User user, int membershipTypeId)
        {
            var User = Session["Admin"] as User;
            MembershipToUser member = new MembershipToUser();
            
            //try
            //{
            if (user != null && user.Id == 0)
            {
                var password = EncryptionDecription.EncryptData(user.Password);
                user.Password = password;
                user.Isdeleted = false;
                user.CreatedDate = DateTime.Now;
                user.UserType = USERTYPE;
                user.CreatedBy = User.Id;
                _context.Users.Add(user);
                _context.SaveChanges();
            }
            else
            {
                var updateUser = _context.Users.Single(c => c.Id == user.Id);
                updateUser.Name = user.Name;
                updateUser.Address = user.Address;
                updateUser.Email = user.Email;
                updateUser.Phone = user.Phone;
                updateUser.DOB = user.DOB;
                updateUser.ModifiedBy = User.Id;
                updateUser.ModifiedDate = DateTime.Now;
                _context.SaveChanges();

                member = _context.MembershipToUsers.Where(c => c.UserId == user.Id).FirstOrDefault();
            }

            if (membershipTypeId > 0 && (member == null || member.IsExpired == true))
            {
                string MembershipNumber = GenerateOtp.GenerateMembershipNumber();
                var ExpiryDate = GenerateOtp.ExpiryDate();
                MembershipToUser mem = new MembershipToUser()
                {
                    MembershipNumber = MembershipNumber,
                    DateCreated = DateTime.Now,
                    DateExpired = ExpiryDate,
                    MembershipTypeId = membershipTypeId,
                    IsExpired = false,
                    IsRequested = false,
                    UserId = user.Id
                };
                _context.MembershipToUsers.Add(mem);
                _context.SaveChanges();
            }
            //}
            //catch (Exception)
            //{
            //    return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);
            //}
            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult findUserById(int Id)
        {
            MembershipToUsersDto membership = new MembershipToUsersDto();
            UserDto user = new UserDto();
            user = _context.Users.Where(c => c.Id == Id).Select(x => new UserDto
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email,
                //Password = x.Password,
                Phone = x.Phone,
                DOB = x.DOB,
                Address = x.Address
            }).FirstOrDefault();
            if (user.Password != null)
            {
                var Pass = EncryptionDecription.DecryptData(user.Password);
                user.Password = Pass;
            }
            if (user != null)
            {
                membership = _context.MembershipToUsers
                    .Where(c => c.UserId == Id && (c.IsRequested == false || c.IsExpired == false))
                    .Select(x => new MembershipToUsersDto
                    {
                        Id = x.Id,
                        MembershipNumber = x.MembershipNumber,
                        UserId = x.UserId,
                        MembershipTypeId = x.MembershipTypeId,
                        IsRequested = x.IsRequested,
                        IsExpired = x.IsExpired
                    }).SingleOrDefault();
            }
            user.membership = membership;

            return Json(new { responseText = "Success", user = user }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult DeleteUser(int Id)
        {
            var usr = Session["Admin"] as User;

            var user = _context.Users.Where(c => c.Id == Id).SingleOrDefault();
            if (user == null)
                return Json(new { responseText = "Failure" }, JsonRequestBehavior.AllowGet);

            user.Isdeleted = true;
            user.DeletedDate = DateTime.Now;
            user.DeletedBy = usr.Id;

            _context.SaveChanges();
            return Json(new { responseText = "Success" }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetMembershipType()
        {
            var membershipType = _context.MembershipTypes.Select(x => new MembershipTypeViewModel
            {
                Id = x.Id,
                Title = x.Title,
                Cost = x.Cost
            }).ToList();

            return Json(new { responseText = "Success", membershipType = membershipType }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetCDType()
        {
            var cdType = _context.CDTypes.Select(x => new CDTypeViewModel
            {
                Id = x.Id,
                Name = x.Name
            }).ToList();
            return Json(new { responseText = "Success", cdType = cdType }, JsonRequestBehavior.AllowGet);
        }
    }
}