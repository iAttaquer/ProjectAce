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

namespace api.Controllers;

[ApiController]
[Route("api/assignments")]
public class AssignmentController : ControllerBase
{
  private readonly IAssignmentRepository _assignmentRepo;
  private readonly IProjectRepository _projectRepo;
  private readonly IProjectTeamRepository _projectTeamRepo;
  private readonly IAssignmentUserRepository _assignmentUserRepo;
  public AssignmentController(IAssignmentRepository assignmentRepo,
      IProjectRepository projectRepo,
      IProjectTeamRepository projectTeamRepo,
      IAssignmentUserRepository assignmentUserRepo
      )
  {
    _assignmentRepo = assignmentRepo;
    _projectRepo = projectRepo;
    _projectTeamRepo = projectTeamRepo;
    _assignmentUserRepo = assignmentUserRepo;
  }

  /// <summary>
  /// Create an assignment to specific project
  /// </summary>
  /// <param name="createAssignmentDto"></param>
  /// <returns></returns>
  [HttpPost("{projectId:guid}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(typeof(AssignmentDto), StatusCodes.Status201Created)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IActionResult> Create([FromRoute] Guid projectId, [FromBody] CreateAssignmentDto createAssignmentDto)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    var user = HttpContext.Items["User"] as AppUser;
    var assignment = createAssignmentDto.ToAssignmentFromDto();
    assignment.CreatedById = user.Id;
    assignment.ProjectId = projectId;
    await _assignmentRepo.CreateAsync(assignment);
    return CreatedAtAction(nameof(GetById), new { id = assignment.Id }, assignment.ToAssignmentDto());
  }

  /// <summary>
  /// Get all assignments
  /// </summary>
  /// <returns></returns>
  [HttpGet]
  [Authorize]
  [ProducesResponseType(typeof(List<AssignmentDto>), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  public async Task<IActionResult> GetAll()
  {
    if (!ModelState.IsValid)
    {
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
  [ProducesResponseType(typeof(AssignmentDto), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> GetById([FromRoute] Guid id)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    var assignment = await _assignmentRepo.GetByIdAsync(id);

    if (assignment is null)
    {
      return NotFound("Assignment not found");
    }

    return Ok(assignment.ToAssignmentDto());
  }

  /// <summary>
  /// Get all assignments assigned to user
  /// </summary>
  /// <returns></returns>
  [HttpGet("my-assignments")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(typeof(List<AssignmentDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetMyAssignments()
  {
    var user = HttpContext.Items["User"] as AppUser;

    var assignmentUsers = await _assignmentUserRepo.GetAllByMemberIdAsync(user.Id);

    var assignmentDto = assignmentUsers.Select(a => a.ToAssignmentDto());

    return Ok(assignmentDto);
  }

  /// <summary>
  /// Get all assignments for a project
  /// </summary>
  /// <param name="projectId"></param>
  /// <returns></returns>
  [HttpGet("projects/{projectId:guid}")]
  [Authorize]
  [ProducesResponseType(typeof(List<AssignmentDto>), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> GetByProjectId([FromRoute] Guid projectId)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var project = await _projectRepo.GetByIdAsync(projectId);
    if (project is null)
    {
      return NotFound("Project not found");
    }

    var assignments = await _assignmentRepo.GetAllByProjectIdAsync(projectId);
    var assignmentDto = assignments.Select(a => a.ToAssignmentDto());

    return Ok(assignmentDto);
  }

  /// <summary>
  /// Update an assignment. Only for member of project
  /// </summary>
  /// <param name="id"></param>
  /// <param name="updateDto"></param>
  /// <returns></returns>
  [HttpPut("{id:guid}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(typeof(AssignmentDto), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  public async Task<IActionResult> Update(Guid id, CreateAssignmentDto updateDto)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var existingAssignment = await _assignmentRepo.GetByIdAsync(id);
    if (existingAssignment is null)
    {
      return NotFound("Assignment not found");
    }

    var user = HttpContext.Items["User"] as AppUser;
    if (!await _projectTeamRepo.IsMemberInProject(existingAssignment.ProjectId, user.Id))
    {
      return Forbid();
    }
    existingAssignment.Name = updateDto.Name;
    existingAssignment.Description = updateDto.Description;
    existingAssignment.Status = updateDto.Status;

    await _assignmentRepo.UpdateAsync(existingAssignment);
    return Ok(existingAssignment.ToAssignmentDto());
  }

  /// <summary>
  /// Delete an assignment. Only for member of project
  /// </summary>
  /// <param name="id"></param>
  /// <returns></returns>
  [HttpDelete("{id:guid}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(StatusCodes.Status204NoContent)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Delete([FromRoute] Guid id)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var toDeleteAssignment = await _assignmentRepo.GetByIdAsync(id);
    if (toDeleteAssignment is null)
    {
      return NotFound("Assignment does not exist");
    }

    var user = HttpContext.Items["User"] as AppUser;
    if (toDeleteAssignment.CreatedById != user.Id)
    {
      return Forbid();
    }

    await _assignmentRepo.DeleteAsync(toDeleteAssignment);

    return NoContent();
  }
}
