using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Assignment;
using api.Models;

namespace api.Mappers
{
    public static class AssignmentMapper
    {
        public static AssignmentDto ToAssignmentDto(this Assignment assignment)
        {
            return new AssignmentDto
            {
                Id = assignment.Id,
                Name = assignment.Name,
                Description = assignment.Description,
                Status = assignment.Status,
                CreatedAt = assignment.CreatedAt,
                CreatedBy = assignment.CreatedBy.UserName,
            };
        }
        public static Assignment ToAssignmentFromDto(this CreateAssignmentDto assignmentDto)
        {
            return new Assignment
            {
                Name = assignmentDto.Name,
                Description = assignmentDto.Description,
                Status = assignmentDto.Status,
            };
        }
    }
}