using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository;

public class ProjectTeamRepository : IProjectTeamRepository
{
  private readonly ApplicationDBContext _context;
  public ProjectTeamRepository(ApplicationDBContext context)
  {
    _context = context;
  }
  public async Task<ProjectTeam> CreateAsync(ProjectTeam projectTeam)
  {
    await _context.ProjectTeams.AddAsync(projectTeam);
    await _context.SaveChangesAsync();
    return projectTeam;
  }

  public async Task DeleteAllInProject(Guid projectId)
  {
    var projectTeamsToRemove = await _context.ProjectTeams
      .Where(t => t.ProjectId == projectId)
      .ToListAsync();
    _context.ProjectTeams.RemoveRange(projectTeamsToRemove);
    await _context.SaveChangesAsync();
  }

  public async Task DeleteAsync(ProjectTeam projectTeam)
  {
    _context.ProjectTeams.Remove(projectTeam);
    await _context.SaveChangesAsync();
  }

  public async Task<List<ProjectTeam>> GetAllAsync()
  {
    var ProjectTeams = _context.ProjectTeams.Include(p => p.Project).Include(u => u.Member).AsQueryable();
    return await ProjectTeams.ToListAsync();
  }

  public async Task<List<ProjectTeam>> GetAllByMemberAsync(string userId)
  {
    return await _context.ProjectTeams
       .Include(x => x.Member)
       .Where(x => x.MemberId == userId)
       .ToListAsync();
  }

  public async Task<bool> IsMemberInProject(Guid projectId, string memberId)
  {
    return await _context.ProjectTeams.AnyAsync(t =>
      t.ProjectId == projectId && t.MemberId == memberId);
  }
}