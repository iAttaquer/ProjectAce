using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Dtos.Assignment;
using api.Filters;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/assignments")]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentRepository _assignmentRepo;
        public AssignmentController(IAssignmentRepository assignmentRepo)
        {
            _assignmentRepo = assignmentRepo;
        }

        /// <summary>
        /// Create an assignment
        /// </summary>
        /// <param name="createAssignmentDto"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        [AuthorizeUser]
        public async Task<IActionResult> Create([FromBody] CreateAssignmentDto createAssignmentDto)
        {
            var user = (AppUser)HttpContext.Items["User"];
            var assignment = createAssignmentDto.ToAssignmentFromDto();
            assignment.CreatedById = user.Id;
            await _assignmentRepo.CreateAsync(assignment);
            return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, assignment.ToAssignmentDto());
        }

        /// <summary>
        /// Get all assignments
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var assignments = await _assignmentRepo.GetAllAsync();

            var assignmentDto = assignments.Select(a => a.ToAssignmentDto());

            return Ok(assignmentDto);
        }

        /// <summary>
        /// Get assignment by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var assignment = await _assignmentRepo.GetByIdAsync(id);

            if (assignment is null) {
                return NotFound("Assignment not found");
            }

            return Ok(assignment.ToAssignmentDto());
        }


    }
}