using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("assignments")]
public class Assignment
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public Guid ProjectId { get; set; }
  public Project Project { get; set; }
  public string Name { get; set; } = string.Empty;
  public string Description { get; set; } = string.Empty;
  public string Status { get; set; } = string.Empty;
  public string CreatedById { get; set; }
  public AppUser CreatedBy { get; set; }
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public List<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
}
