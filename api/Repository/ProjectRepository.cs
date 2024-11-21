using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
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

        public async Task<Project?> DeleteAsync(Guid id)
        {
            var projectModel = await _context.Projects.FindAsync(id);
            if (projectModel is null) {
                return null;
            }
            _context.Projects.Remove(projectModel);
            await _context.SaveChangesAsync();
            return projectModel;
        }

        public async Task<List<Project>> GetAllAsync()
        {
            var projects = _context.Projects.Include(p => p.CreatedBy).AsQueryable();

            return await projects.ToListAsync();
        }

        public async Task<List<Project>> GetAllByUserIdAsync(string userId)
        {
            var projects = _context.Projects.Include(p => p.CreatedBy)
                .Where(p => p.CreatedById == userId).AsQueryable();

            return await projects.ToListAsync();
        }

        public async Task<Project?> GetByIdAsync(Guid id)
        {
            return await _context.Projects.Include(p => p.CreatedBy).FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Project?> UpdateAsync(Guid id, Project project)
        {
            var existingProject = await _context.Projects.FindAsync(id);

            if (existingProject is null) {
                return null;
            }
            existingProject.Name = project.Name;
            existingProject.Description = project.Description;
            existingProject.Status = project.Status;
            await _context.SaveChangesAsync();
            return existingProject;
        }
    }
}