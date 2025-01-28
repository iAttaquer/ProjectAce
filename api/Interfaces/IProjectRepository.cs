using api.Models;

namespace api.Interfaces;

public interface IProjectRepository
{
  Task<List<Project>> GetAllAsync();
  Task<Project?> GetByIdAsync(Guid id);
  Task<List<Project>> GetAllByUserIdAsync(string userId);
  Task<Project> CreateAsync(Project project);
  Task<Project?> UpdateAsync(Project project);
  Task<bool> DeleteAsync(Guid projectId, string userId);
  Task<bool> ExistsAsync(Guid id);
}
