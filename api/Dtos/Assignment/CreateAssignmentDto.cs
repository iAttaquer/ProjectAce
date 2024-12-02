using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Assignment;

public class CreateAssignmentDto
{
    [Required]
    [MinLength(2, ErrorMessage = "assignment name must be at least 2 characters")]
    [MaxLength(500, ErrorMessage = "assignment name must be at most 500 characters")]
    public string Name { get; set; }
    [MaxLength(5000, ErrorMessage = "assignment description must be at most 5000 characters")]
    public string Description { get; set; }
    [MaxLength(50, ErrorMessage = "assignment status must be at most 50 characters")]
    public string Status { get; set; }
}
