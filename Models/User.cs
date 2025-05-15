using System;
using System.ComponentModel.DataAnnotations;

namespace ADHDStudyApp.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string FullName { get; set; }

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        public string Role { get; set; } 
        public bool? HasADHD { get; set; } 


    }
}