using api.Dtos.User;
using api.Filters;
using api.Interfaces;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace api.Controllers;

[Route("api/project-teams")]
[ApiController]
public class ProjectTeamController : ControllerBase
{
  private readonly IProjectTeamRepository _projectTeamRepo;
  private readonly IProjectRepository _projectRepo;
  private readonly IUserRepository _userRepo;
  private readonly IAssignmentUserRepository _assignmentUserRepo;
  public ProjectTeamController(
      IProjectTeamRepository projectTeamRepo,
      IProjectRepository projectRepo,
      IUserRepository userRepo,
      IAssignmentUserRepository assignmentUserRepo
      )
  {
    _projectTeamRepo = projectTeamRepo;
    _projectRepo = projectRepo;
    _userRepo = userRepo;
    _assignmentUserRepo = assignmentUserRepo;
  }

  /// <summary>
  /// Add a user to a project
  /// </summary>
  /// <param name="projectId"></param>
  /// <param name="userId"></param>
  /// <returns></returns>
  [HttpPost("{projectId:guid}/{userId}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(StatusCodes.Status201Created)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> AddMember(
      [FromRoute] Guid projectId,
      [FromRoute] string userId
      )
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
    var user = HttpContext.Items["User"] as AppUser;
    if (project.CreatedById != user.Id)
    {
      return Forbid();
    }
    var upcomingMember = await _userRepo.GetByIdAsync(userId);
    if (upcomingMember is null)
    {
      return NotFound("User not found");
    }
    if (await _projectTeamRepo.IsMemberInProject(projectId, userId))
    {
      return BadRequest("User is already a member of project");
    }
    await _projectTeamRepo.CreateAsync(new ProjectTeam
    {
      ProjectId = projectId,
      MemberId = userId,
    });

    return Ok();
  }

  /// <summary>
  /// Get all members of a project
  /// </summary>
  /// <param name="projectId"></param>
  /// <returns></returns>
  [HttpGet("{projectId:guid}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> GetAllMembersInProject([FromRoute] Guid projectId)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    // warunek do usuniecia
    if (!await _projectRepo.ExistsAsync(projectId))
    {
      return NotFound("Project not found");
    }

    var user = HttpContext.Items["User"] as AppUser;
    if (!await _projectTeamRepo.IsMemberInProject(projectId, user.Id))
    {
      return Forbid();
    }

    var members = await _projectTeamRepo.GetAllByProjectIdAsync(projectId);
    var userDto = members.Select(u => u.ToUserDto());

    return Ok(userDto);
  }

  /// <summary>
  /// Removes user from project
  /// </summary>
  /// <param name="projectId"></param>
  /// <param name="userId"></param>
  /// <returns></returns>
  [HttpDelete("{projectId:guid}/{userId}")]
  [Authorize]
  [AuthorizeUser]
  [ProducesResponseType(StatusCodes.Status204NoContent)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status403Forbidden)]
  [ProducesResponseType(StatusCodes.Status404NotFound)]
  public async Task<IActionResult> RemoveMember(
      [FromRoute] Guid projectId,
      [FromRoute] string userId
      )
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
    var user = HttpContext.Items["User"] as AppUser;
    if (project.CreatedById != user.Id)
    {
      return Forbid();
    }
    if (user.Id == userId)
    {
      return BadRequest("You can't remove yourself from project");
    }
    if (!await _projectTeamRepo.IsMemberInProject(projectId, userId))
    {
      return NotFound("Member is not in project");
    }
    await _projectTeamRepo.DeleteAsync(new ProjectTeam
    {
      ProjectId = projectId,
      MemberId = userId
    });
    await _assignmentUserRepo.RemoveAllFromProject(projectId, userId);
    return NoContent();
  }
}
