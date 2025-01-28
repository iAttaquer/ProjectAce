using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class AssignmentRepository : IAssignmentRepository
{
  private readonly ApplicationDBContext _context;
  public AssignmentRepository(ApplicationDBContext context)
  {
    _context = context;
  }
  public async Task<Assignment> CreateAsync(Assignment assignment)
  {
    await _context.Assignments.AddAsync(assignment);
    await _context.SaveChangesAsync();
    return assignment;
  }

  public async Task DeleteAllInProjectAsync(Guid projectId)
  {
    _context.Assignments.RemoveRange(
        _context.Assignments.Where(a => a.ProjectId == projectId)
    );
    await _context.SaveChangesAsync();
  }

  public async Task<Assignment?> DeleteAsync(Assignment assignment)
  {
    _context.Assignments.Remove(assignment);
    await _context.SaveChangesAsync();
    return assignment;
  }

  public async Task<List<Assignment>> GetAllAsync()
  {
    var assignments = _context.Assignments.Include(a => a.CreatedBy).AsQueryable();

    return await assignments.ToListAsync();
  }

  public async Task<List<Assignment>> GetAllByProjectIdAsync(Guid projectId)
  {
    var assignments = _context.Assignments.Include(a => a.CreatedBy)
        .Where(a => a.ProjectId == projectId).AsQueryable();
    return await assignments.ToListAsync();
  }

  public async Task<List<Assignment>> GetAllByUserIdAsync(string userId)
  {
    var assignments = _context.Assignments.Include(a => a.CreatedBy)
        .Where(a => a.CreatedById == userId).AsQueryable();
    return await assignments.ToListAsync();
  }

  public async Task<Assignment?> GetByIdAsync(Guid id)
  {
    return await _context.Assignments.Include(a => a.CreatedBy)
        .FirstOrDefaultAsync(a => a.Id == id);
  }

  public async Task<Assignment> UpdateAsync(Assignment assignment)
  {
    _context.Entry(assignment).State = EntityState.Modified;
    await _context.SaveChangesAsync();
    return assignment;
  }

}
