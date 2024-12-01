using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class ProjectRepository : IProjectRepository
{
    private readonly ApplicationDBContext _context;
    public ProjectRepository(ApplicationDBContext context)
    {
        _context = context;
    }
    public async Task<Project> CreateAsync(Project project)
    {
        await _context.Projects.AddAsync(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<Project?> DeleteAsync(Project project)
    {
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<bool> ExistsAsync(Guid id)
    {
        return await _context.Projects.AnyAsync(p => p.Id == id);
    }

    public async Task<List<Project>> GetAllAsync()
    {
        var projects = _context.Projects.Include(p => p.CreatedBy).AsQueryable();

        return await projects.ToListAsync();
    }

    public async Task<List<Project>> GetAllByMemberAsync(string userId)
    {
        return await _context.Projects
            .Include(x => x.CreatedBy)
            .Include(x => x.ProjectTeams)
            .Where(x => x.ProjectTeams.Any(m => m.MemberId == userId))
            .ToListAsync();
    }

    public async Task<List<Project>> GetAllByUserIdAsync(string userId)
    {
        var projects = _context.Projects.Include(p => p.CreatedBy)
            .Where(p => p.CreatedById == userId).AsQueryable();

        return await projects.ToListAsync();
    }

    public async Task<Project?> GetByIdAsync(Guid id)
    {
        return await _context.Projects.Include(p => p.CreatedBy)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Project?> UpdateAsync(Project project)
    {
        _context.Entry(project).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return project;
    }
}
