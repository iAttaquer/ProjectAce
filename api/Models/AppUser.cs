using Microsoft.AspNetCore.Identity;

namespace api.Models;

public class AppUser : IdentityUser
{
  public required string FirstName { get; set; }
  public required string LastName { get; set; }
  public string? RefreshToken { get; set; }
  public DateTime RefreshTokenExpiryTime { get; set; }
  public List<Project> Projects { get; set; } = new List<Project>();
  public List<Assignment> Assignments { get; set; } = new List<Assignment>();
  public List<ProjectTeam> ProjectTeams { get; set; } = new List<ProjectTeam>();
  public List<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
}
