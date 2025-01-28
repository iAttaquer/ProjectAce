using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Project;

public class ProjectDto
{
  [Required]
  public Guid Id { get; set; }
  [Required]
  public string? Name { get; set; }
  [Required]
  public string? Description { get; set; }
  [Required]
  public string? Status { get; set; }
  [Required]
  public DateTime CreatedAt { get; set; }
  [Required]
  public string? CreatedBy { get; set; }
}
