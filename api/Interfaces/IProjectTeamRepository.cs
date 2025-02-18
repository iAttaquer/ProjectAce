using api.Models;

namespace api.Interfaces;

public interface IProjectTeamRepository
{
  Task<List<ProjectTeam>> GetAllAsync();
  Task<ProjectTeam> CreateAsync(ProjectTeam projectTeam);
  Task DeleteAsync(ProjectTeam projectTeam);
  Task<bool> IsMemberInProject(Guid projectId, string memberId);
  Task DeleteAllInProject(Guid projectId);
  Task<List<ProjectTeam>> GetAllByProjectIdAsync(Guid projectId);
  Task<List<ProjectTeam>> GetAllByMemberAsync(string userId);
}
