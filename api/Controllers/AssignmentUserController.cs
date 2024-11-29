using api.Filters;
using api.Interfaces;
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

  [HttpPost("{assignmentId:guid}/{memberId}")]
  [Authorize]
  [AuthorizeUser]
  public async Task<IActionResult> AddMemberToAssignment([FromRoute] Guid assignmentId, [FromRoute] string memberId)
  {
    if (!ModelState.IsValid) {
      return BadRequest();
    }
    var assignment = await _assignmentRepo.GetByIdAsync(assignmentId);
    if (assignment is null) {
      return NotFound("Assignment not found");
    }
    var member = await _userRepo.GetByIdAsync(memberId);
    if (member is null) {
      return NotFound("User not found");
    }
    var user = (AppUser)HttpContext.Items["User"];
    if (!await _projectTeamRepo.IsMemberInProject(assignment.ProjectId, user.Id)) {
      return Forbid("You are not a member of project");
    }
    if (await _assignmentUserRepo.IsMemeberAssignedTo(assignmentId, memberId)) {
      return BadRequest("User is already assigned to assignment");
    }
    await _assignmentUserRepo.CreateAsync(new AssignmentUser
    {
      AssignmentId = assignmentId,
      UserId = memberId,
    });

    return StatusCode(StatusCodes.Status201Created);
  }
}