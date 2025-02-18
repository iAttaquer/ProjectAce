using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("projects")]
public class Project
{
  public Guid Id { get; set; } = Guid.NewGuid();
  public string Name { get; set; }
  public string Description { get; set; } = string.Empty;
  public string Status { get; set; } = string.Empty;
  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
  public string CreatedById { get; set; }
  public AppUser CreatedBy { get; set; }
  public List<Assignment> Assignments { get; set; } = new List<Assignment>();
  public List<ProjectTeam> ProjectTeams { get; set; } = new List<ProjectTeam>();
}
