using ADHDStudyApp.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ADHDStudyApp.Data;

namespace ADHDStudyApp.Controllers
{
    public class DashboardController : Controller
    {
        private readonly AppDbContext _context;
        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            try
            {
                var userEmail = HttpContext.Session.GetString("UserEmail");
                var fullName = HttpContext.Session.GetString("FullName");

                // Check if user is authenticated
                if (string.IsNullOrEmpty(userEmail) || string.IsNullOrEmpty(fullName))
                {
                    TempData["Error"] = "Please log in to access the dashboard.";
                    return RedirectToAction("Login", "Account");
                }

                // Transfer TempData to ViewBag if available
                if (TempData["UploadedText"] != null)
                {
                    ViewBag.ShowLeftPanel = true;
                    ViewBag.UploadedText = TempData["UploadedText"];
                    ViewBag.FileName = TempData["FileName"];
                }
          
                ViewBag.UserEmail = userEmail;
                ViewBag.FullName = fullName;

                return View();
            }
            catch (Exception ex)
            {
                TempData["Error"] = "An error occurred while accessing the dashboard. Please try logging in again.";
                return RedirectToAction("Login", "Account");
            }
        }

       [HttpPost]
        public async Task<IActionResult> UploadDocument(IFormFile file)
        {
            // Check if user is authenticated
            var userEmail = HttpContext.Session.GetString("UserEmail");
            if (string.IsNullOrEmpty(userEmail))
            {
                TempData["Error"] = "Please log in to upload documents.";
                return RedirectToAction("Login", "Account");
            }

            if (file == null || file.Length == 0)
            {
                TempData["Error"] = "No file uploaded.";
                return RedirectToAction("Index");
            }

            string textContent;
            var extension = Path.GetExtension(file.FileName).ToLower();

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    if (extension == ".pdf")
                    {
                        using (var pdf = UglyToad.PdfPig.PdfDocument.Open(stream))
                        {
                            textContent = string.Join("\n", pdf.GetPages().Select(p => p.Text));
                        }
                    }
                    else if (extension == ".txt")
                    {
                        using (var reader = new StreamReader(stream))
                        {
                            textContent = await reader.ReadToEndAsync();
                        }
                    }
                    else
                    {
                        TempData["Error"] = "Unsupported file type. Only PDF and TXT are allowed.";
                        return RedirectToAction("Index");
                    }
                }

                // Save display state in both TempData and ViewBag
                TempData["ShowLeftPanel"] = true;
                TempData["UploadedText"] = textContent;
                TempData["FileName"] = file.FileName;

                ViewBag.ShowLeftPanel = true;
                ViewBag.UploadedText = textContent;
                ViewBag.FileName = file.FileName;

                return RedirectToAction("Index");
            }
            catch (Exception ex)
            {
                TempData["Error"] = $"Error processing file: {ex.Message}";
                return RedirectToAction("Index");
            }
        } 
    }
}
    