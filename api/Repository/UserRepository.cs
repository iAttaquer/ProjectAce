using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class UserRepository : IUserRepository
{
  private readonly ApplicationDBContext _context;
  public UserRepository(ApplicationDBContext context)
  {
    _context = context;
  }
  public async Task<List<AppUser>> GetAllAsync()
  {
    var users = _context.Users.AsQueryable();
    return await users.ToListAsync();
  }

  public async Task<AppUser?> GetByIdAsync(string Id)
  {
    return await _context.Users.FirstOrDefaultAsync(u => u.Id == Id);
  }
}