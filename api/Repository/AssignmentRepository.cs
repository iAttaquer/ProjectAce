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

        public async Task<Assignment?> DeleteAsync(Guid id)
        {
            var assignmentModel = await _context.Assignments.FindAsync(id);
            if (assignmentModel is null) {
                return null;
            }
            _context.Assignments.Remove(assignmentModel);
            await _context.SaveChangesAsync();
            return assignmentModel;
        }

        public async Task<List<Assignment>> GetAllAsync()
        {
            var assignments = _context.Assignments.Include(a => a.CreatedBy).AsQueryable();

            return await assignments.ToListAsync();
        }

        public async Task<Assignment?> GetByIdAsync(Guid id)
        {
            return await _context.Assignments.Include(a => a.CreatedBy)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public Task<Assignment> UpdateAsync(Guid id, Assignment assignment)
        {
            throw new NotImplementedException();
        }
    }
}