using api.Dtos.User;
using api.Filters;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/assignment-users")]
[ApiController]
public class AssignmentUsersController : ControllerBase
{
  private readonly IAssignmentUserRepository _assignmentUserRepo;
  private readonly IAssignmentRepository _assignmentRepo;
  private readonly IUserRepository _userRepo;
  private readonly IProjectTeamRepository _projectTeamRepo;

  public AssignmentUsersController(
      IAssignmentUserRepository assignmentUserRepo,
      IAssignmentRepository assignmentRepo,
      IUserRepository userRepo,
      IProjectTeamRepository projectTeamRepo
    )
  {
    _assignmentUserRepo = assignmentUserRepo;
    _assignmentRepo = assignmentRepo;
    _userRepo = userRepo;
    _projectTeamRepo = projectTeamRepo;
  }

  /// <summary>
  /// Adds a member to an assignment
  /// </summary>
  /// <param name="assignmentId"></param>
  /// <param name="memberId"></param>
  /// <returns></returns>
  [HttpPost("{assignmentId:guid}/{memberId}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(StatusCodes.Status201Created)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  public async Task<IActionResult> AddMemberToAssignment([FromRoute] Guid assignmentId, [FromRoute] string memberId)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest();
    }
    var assignment = await _assignmentRepo.GetByIdAsync(assignmentId);
    if (assignment is null)
    {
      return NotFound("Assignment not found");
    }
    var member = await _userRepo.GetByIdAsync(memberId);
    if (member is null)
    {
      return NotFound("User not found");
    }
    var user = HttpContext.Items["User"] as AppUser;
    if (!await _projectTeamRepo.IsMemberInProject(assignment.ProjectId, user.Id))
    {
      return Forbid();
    }
    if (await _assignmentUserRepo.IsMemeberAssignedTo(assignmentId, memberId))
    {
      return BadRequest("User is already assigned to assignment");
    }
    await _assignmentUserRepo.CreateAsync(new AssignmentUser
    {
      AssignmentId = assignmentId,
      UserId = memberId,
    });

    return StatusCode(StatusCodes.Status201Created);
  }

  /// <summary>
  /// Get all members of an assignment
  /// </summary>
  /// <param name="assignmentId"></param>
  /// <returns></returns>
  [HttpGet("{assignmentId:guid}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> GetAssignmentUsers([FromRoute] Guid assignmentId)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    var assignment = await _assignmentRepo.GetByIdAsync(assignmentId);
    if (assignment is null)
    {
      return NotFound("Assignment not found");
    }
    var user = HttpContext.Items["User"] as AppUser;
    if (!await _projectTeamRepo.IsMemberInProject(assignment.ProjectId, user.Id))
    {
      return Forbid();
    }
    var users = await _assignmentUserRepo.GetAllAsync(assignmentId);
    var userDto = users.Select(u => u.ToUserDto());
    return Ok(userDto);
  }

  /// <summary>
  /// Removes a member from an assignment
  /// </summary>
  /// <param name="assignmentId"></param>
  /// <param name="memberId"></param>
  /// <returns></returns>
  [HttpDelete("{assignmentId:guid}/{memberId}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(StatusCodes.Status204NoContent)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> RemoveMemberFromAssignment([FromRoute] Guid assignmentId, [FromRoute] string memberId)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }
    var assignment = await _assignmentRepo.GetByIdAsync(assignmentId);
    if (assignment is null)
    {
      return NotFound("Assignment not found");
    }
    var member = await _userRepo.GetByIdAsync(memberId);
    if (member is null)
    {
      return NotFound("User not found");
    }
    var user = HttpContext.Items["User"] as AppUser;
    if (!await _projectTeamRepo.IsMemberInProject(assignment.ProjectId, user.Id))
    {
      return Forbid();
    }
    if (!await _assignmentUserRepo.IsMemeberAssignedTo(assignmentId, memberId))
    {
      return NotFound("User is not assigned to assignment");
    }
    await _assignmentUserRepo.DeleteAsync(new AssignmentUser
    {
      AssignmentId = assignmentId,
      UserId = memberId,
    });
    return NoContent();
  }
}
