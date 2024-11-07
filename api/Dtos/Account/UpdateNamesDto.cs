using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Account
{
    public class UpdateNamesDto
    {
        [Required]
        [MinLength(2, ErrorMessage = "first name must be at least 2 characters")]
        [MaxLength(30, ErrorMessage = "first name must be at most 30 characters")]
        public string FirstName { get; set; }
        [Required]
        [MinLength(2, ErrorMessage = "last name must be at least 2 characters")]
        [MaxLength(30, ErrorMessage = "last name must be at most 30 characters")]
        public string LastName { get; set; }
    }
}