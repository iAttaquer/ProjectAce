using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces;
public interface IAssignmentUserRepository
{
    Task<List<AssignmentUser>> GetAllAsync(Guid assignmentId);
    Task<AssignmentUser> CreateAsync(AssignmentUser assignmentUser);
    Task<bool> IsMemeberAssignedTo(Guid assignmentId, string userId);
}