using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Dtos.Project;

public class CreateProjectDto
{
    [Required]
    [MinLength(2, ErrorMessage = "project name must be at least 2 characters")]
    [MaxLength(100, ErrorMessage = "project name must be at most 100 characters")]
    public string Name { get; set; }
    [MaxLength(5000, ErrorMessage = "project description must be at most 5000 characters")]
    public string Description { get; set; }
    [MaxLength(50, ErrorMessage = "project status must be at most 50 characters")]
    public string Status { get; set; }
}
