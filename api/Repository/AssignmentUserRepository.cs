using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class AssignmentUserRepository : IAssignmentUserRepository
{
    private readonly ApplicationDBContext _context;
    public AssignmentUserRepository(ApplicationDBContext context)
    {
        _context = context;
    }
    public async Task<AssignmentUser> CreateAsync(AssignmentUser assignmentUser)
    {
        await _context.AssignmentUsers.AddAsync(assignmentUser);
        await _context.SaveChangesAsync();
        return assignmentUser;
    }

    public async Task DeleteAsync(AssignmentUser assignmentUser)
    {
        _context.AssignmentUsers.Remove(assignmentUser);
        await _context.SaveChangesAsync();
    }

    public async Task<List<AssignmentUser>> GetAllAsync(Guid assignmentId)
    {
        var assignmentusers = _context.AssignmentUsers
            .Include(a => a.Assignment)
            .Include(u => u.User)
            .Where(a => a.AssignmentId == assignmentId)
            .AsQueryable();
        return await assignmentusers.ToListAsync();
    }

    public async Task<List<AssignmentUser>> GetAllByMemberIdAsync(string userId)
    {
        return await _context.AssignmentUsers
            .Include(a => a.Assignment)
            .Include(u => u.User)
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }
    public async Task<bool> IsMemeberAssignedTo(Guid assignmentId, string userId)
    {
        return await _context.AssignmentUsers.AnyAsync(
            u => u.AssignmentId == assignmentId && u.UserId == userId);
    }

    public async Task RemoveAllFromProject(Guid projectId, string userId)
    {
        var assignmentUsersToRemove = _context.AssignmentUsers
            .Include(a => a.Assignment)
            .Where(u => u.UserId == userId && u.Assignment.ProjectId == projectId)
            .AsQueryable();
        _context.AssignmentUsers.RemoveRange(assignmentUsersToRemove);
        await _context.SaveChangesAsync();
    }
}
