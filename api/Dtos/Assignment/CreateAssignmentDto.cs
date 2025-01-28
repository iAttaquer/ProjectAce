using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Assignment;

public class CreateAssignmentDto
{
  [Required]
  [MinLength(2, ErrorMessage = "assignment name must be at least 2 characters")]
  [MaxLength(500, ErrorMessage = "assignment name must be at most 500 characters")]
  public required string Name { get; set; }
  [MaxLength(5000, ErrorMessage = "assignment description must be at most 5000 characters")]
  public string? Description { get; set; }
  [MaxLength(50, ErrorMessage = "assignment status must be at most 50 characters")]
  public required string Status { get; set; }
}
