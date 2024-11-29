using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

[Table("assignment_users")]
public class AssignmentUser
{
    public Guid AssignmentId { get; set; }
    public Assignment Assignment { get; set; }
    public string UserId { get; set; }
    public AppUser User { get; set; }
}