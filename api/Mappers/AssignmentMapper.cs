using api.Dtos.Assignment;
using api.Models;

namespace api.Mappers;

public static class AssignmentMapper
{
  public static AssignmentDto ToAssignmentDto(this Assignment assignment)
  {
    return new AssignmentDto
    {
      Id = assignment.Id,
      Name = assignment.Name,
      Description = assignment.Description,
      Status = assignment.Status,
      CreatedAt = assignment.CreatedAt,
      CreatedBy = assignment.CreatedBy.UserName,
      ProjectId = assignment.ProjectId,
    };
  }
  public static Assignment ToAssignmentFromDto(this CreateAssignmentDto assignmentDto)
  {
    return new Assignment
    {
      Name = assignmentDto.Name,
      Description = assignmentDto.Description,
      Status = assignmentDto.Status,
    };
  }
  public static AssignmentDto ToAssignmentDto(this AssignmentUser assignmentUser)
  {
    return new AssignmentDto
    {
      Id = assignmentUser.AssignmentId,
      Name = assignmentUser.Assignment.Name,
      Description = assignmentUser.Assignment.Description,
      Status = assignmentUser.Assignment.Status,
      CreatedAt = assignmentUser.Assignment.CreatedAt,
      CreatedBy = assignmentUser.Assignment.CreatedBy.UserName,
      ProjectId = assignmentUser.Assignment.ProjectId,
    };
  }
}
