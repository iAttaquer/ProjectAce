
using api.Models;

namespace api.Interfaces;

public interface IUserRepository
{
  Task<AppUser?> GetByIdAsync(string Id);
  Task<List<AppUser>> GetAllAsync();
}