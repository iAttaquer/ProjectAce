using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces
{
    public interface IAssignmentRepository
    {
        Task<List<Assignment>> GetAllAsync();
        Task<Assignment?> GetByIdAsync(Guid id);
        Task<Assignment> CreateAsync(Assignment assignment);
        Task<Assignment?> UpdateAsync(Guid id, Assignment assignment);
        Task<Assignment?> DeleteAsync(Guid id);
    }
}