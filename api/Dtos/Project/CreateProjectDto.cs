using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Project;

public class CreateProjectDto
{
  [Required]
  [MinLength(2, ErrorMessage = "project name must be at least 2 characters")]
  [MaxLength(100, ErrorMessage = "project name must be at most 100 characters")]
  public required string Name { get; set; }
  [MaxLength(5000, ErrorMessage = "project description must be at most 5000 characters")]
  public string? Description { get; set; }
  [MaxLength(50, ErrorMessage = "project status must be at most 50 characters")]
  public required string Status { get; set; }
}
