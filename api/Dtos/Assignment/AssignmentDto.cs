namespace api.Dtos.Assignment;

public class AssignmentDto
{
  public required Guid Id { get; set; }
  public required string Name { get; set; }
  public required string Description { get; set; }
  public required string Status { get; set; }
  public required DateTime CreatedAt { get; set; }
  public required string CreatedBy { get; set; }
  public required Guid ProjectId { get; set; }
}
