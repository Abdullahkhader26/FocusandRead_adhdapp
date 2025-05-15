using System;
using System.ComponentModel.DataAnnotations;

namespace ADHDStudyApp.Models
{
    public class UserFile
    {
        public int Id { get; set; }

        [Required]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        public string FilePath { get; set; } = string.Empty;
        
        public long Filesize { get; set; }
        
        [Required]
        public string FileType { get; set; } = string.Empty;
        
        public DateTime UploadDate { get; set; } = DateTime.Now;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        
        public User? User { get; set; }
    }
}