using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;

namespace SoundTrack.SendingMail
{
    public class SendingEmail
    {
        //using streamreader for reading my htmltemplate  
        
        private static string path = "C:/Users/ss/source/repos/SoundTrack/SoundTrack/Templates/EmailTemplate.html";
        public static void SendingEmails(string recipient, string userName, string msg, string subject, string title)
        {
            //calling for creating the email body with html template   
            string body = createEmailBody(userName, title, msg);
            SendHtmlFormattedEmail(recipient, subject, body);

        }
        static string createEmailBody(string userName, string title, string message)

        {
            string body = string.Empty;
            
            //string path = Server.MapPath("~/EmailTemplate.htm") ;
            using (StreamReader reader = new StreamReader(path))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{UserName}", userName); //replacing the required things  
            body = body.Replace("{Title}", title);
            body = body.Replace("{message}", message);
            return body;
        }
        static void SendHtmlFormattedEmail(string recipient, string subject, string body)
        {

            string sender = "thakur.vinay0077@gmail.com";
            MailMessage mailMessage = new MailMessage(sender, recipient);
            mailMessage.Subject = subject;
            mailMessage.Body = body;
            mailMessage.IsBodyHtml = true;
            //mailMessage.To.Add(new MailAddress(txt_email.Text));
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "smtp.gmail.com";
            smtp.Port = 587;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential(
                "vinay.step2gen@gmail.com", "v1nay@s2g");
            smtp.EnableSsl = true;
            Console.WriteLine("Sending email...");
            smtp.Send(mailMessage);

        }
    }
}