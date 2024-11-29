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

    public async Task<List<AssignmentUser>> GetAllAsync()
    {
        var assignmentusers = _context.AssignmentUsers.Include(a => a.Assignment).Include(u => u.User).AsQueryable();
        return await assignmentusers.ToListAsync();
    }

}
