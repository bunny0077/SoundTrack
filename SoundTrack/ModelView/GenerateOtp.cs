using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SoundTrack.ModelView
{
    public class GenerateOtp
    {
        private static readonly int MEMBERSHIPNUMBER = 10;
        private static readonly int ORDERNUMBER = 8;
        private static readonly int OTPNUMBER = 6;
        public static string GenerateMembershipNumber()
        {
            string[] saAllowedCharacters = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" };
            string sOTP = String.Empty;
            string sTempChars = String.Empty;
            Random rand = new Random();
            for (int i = 0; i < MEMBERSHIPNUMBER; i++)
            {
                int p = rand.Next(0, saAllowedCharacters.Length);
                sTempChars = saAllowedCharacters[rand.Next(0, saAllowedCharacters.Length)];
                sOTP += sTempChars;
            }
            return sOTP;
        }
        public static string GenerateOrderNumber()
        {
            string[] saAllowedCharacters = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" };
            string sOTP = String.Empty;
            string sTempChars = String.Empty;
            Random rand = new Random();
            for (int i = 0; i < ORDERNUMBER; i++)
            {
                int p = rand.Next(0, saAllowedCharacters.Length);
                sTempChars = saAllowedCharacters[rand.Next(0, saAllowedCharacters.Length)];
                sOTP += sTempChars;
            }
            return sOTP;
        }
        public static string GenerateOtpNumber()
        {
            string[] saAllowedCharacters = { "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" };
            string sOTP = String.Empty;
            string sTempChars = String.Empty;
            Random rand = new Random();
            for (int i = 0; i < OTPNUMBER; i++)
            {
                int p = rand.Next(0, saAllowedCharacters.Length);
                sTempChars = saAllowedCharacters[rand.Next(0, saAllowedCharacters.Length)];
                sOTP += sTempChars;
            }
            return sOTP;
        }
        public static DateTime ExpiryDate()
        {
            DateTime dob = DateTime.Now;

            // Subtract hours, minutes, and seconds  
            DateTime expiryDate = new DateTime(dob.Year+1, dob.Month, dob.Day, dob.Hour, dob.Minute, dob.Second);

            return expiryDate;
        }
    }
}