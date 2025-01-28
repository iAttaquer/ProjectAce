using api.Models;

namespace api.Interfaces;

public interface IAssignmentRepository
{
  Task<List<Assignment>> GetAllAsync();
  Task<Assignment?> GetByIdAsync(Guid id);
  Task<List<Assignment>> GetAllByUserIdAsync(string userId);
  Task<List<Assignment>> GetAllByProjectIdAsync(Guid projectId);
  Task<Assignment> CreateAsync(Assignment assignment);
  Task<Assignment?> UpdateAsync(Assignment assignment);
  Task<Assignment?> DeleteAsync(Assignment assignment);
  Task DeleteAllInProjectAsync(Guid projectId);
}
