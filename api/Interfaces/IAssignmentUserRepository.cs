using api.Models;

namespace api.Interfaces;
public interface IAssignmentUserRepository
{
  Task<List<AssignmentUser>> GetAllAsync(Guid assignmentId);
  Task<AssignmentUser> CreateAsync(AssignmentUser assignmentUser);
  Task<bool> IsMemeberAssignedTo(Guid assignmentId, string userId);
  Task DeleteAsync(AssignmentUser assignmentUser);
  Task<List<AssignmentUser>> GetAllByMemberIdAsync(string userId);
  Task RemoveAllFromProject(Guid projectId, string userId);
}
