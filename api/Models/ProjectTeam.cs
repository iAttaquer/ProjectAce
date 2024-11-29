using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("project_teams")]
public class ProjectTeam
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; }
    public string MemberId { get; set; }
    public AppUser Member { get; set; }
}