using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public ProjectTeamController(
        IProjectTeamRepository projectTeamRepo,
        IProjectRepository projectRepo,
        IUserRepository userRepo
        )
    {
        _projectTeamRepo = projectTeamRepo;
        _projectRepo = projectRepo;
        _userRepo = userRepo;
    }

    /// <summary>
    /// Add a user to a project
    /// </summary>
    /// <param name="projectId"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpPost("{projectId}/member/{userId}")]
    [Authorize]
    [AuthorizeUser]
    public async Task<IActionResult> AddMember(
        [FromRoute] Guid projectId,
        [FromRoute] string userId
        )
    {
        if (!ModelState.IsValid) {
            return BadRequest(ModelState);
        }
        var project = await _projectRepo.GetByIdAsync(projectId);
        if (project is null) {
            return NotFound("Project not found");
        }
        var user = (AppUser)HttpContext.Items["User"];
        if (project.CreatedById != user.Id) {
            return Forbid("You are not a creator of project");
        }
        var upcomingMember = await _userRepo.GetByIdAsync(userId);
        if (upcomingMember is null) {
            return NotFound("User not found");
        }
        if (await _projectTeamRepo.IsMemberInProject(projectId, userId)) {
           return BadRequest("User is already a member of project");
        }
        await _projectTeamRepo.CreateAsync(new ProjectTeam
        {
            ProjectId = projectId,
            MemberId = userId,
        });

        return StatusCode(StatusCodes.Status201Created);
    }

    /// <summary>
    /// Get all members of a project
    /// </summary>
    /// <param name="projectId"></param>
    /// <returns></returns>
    [HttpGet("{projectId:guid}")]
    [Authorize]
    [AuthorizeUser]
    public async Task<IActionResult> GetAllMembersInProject([FromRoute] Guid projectId)
    {
        if (!ModelState.IsValid) {
            return BadRequest(ModelState);
        }
        // warunek do usuniecia
        if (!await _projectRepo.ExistsAsync(projectId)) {
            return NotFound("Project not found");
        }
        var user = (AppUser)HttpContext.Items["User"];
        if (!await _projectTeamRepo.IsMemberInProject(projectId, user.Id)) {
            return Forbid("You are not a member of project");
        }
        var members = await _projectTeamRepo.GetAllAsync();
        var userDto = members.Select(u => u.ToUserDto());
        return Ok(userDto);
    }

    /// <summary>
    /// Removes user from project
    /// </summary>
    /// <param name="projectId"></param>
    /// <param name="userId"></param>
    /// <returns></returns>
    [HttpDelete("{projectId:guid}/member/{userId}")]
    [Authorize]
    [AuthorizeUser]
    public async Task<IActionResult> DeleteMember(
        [FromRoute] Guid projectId,
        [FromRoute] string userId
        )
    {
        if (!ModelState.IsValid) {
            return BadRequest(ModelState);
        }
        var project = await _projectRepo.GetByIdAsync(projectId);
        if (project is null) {
            return NotFound("Project not found");
        }
        var user = (AppUser)HttpContext.Items["User"];
        if (project.CreatedById != user.Id) {
            return Forbid("You are not a creator of project");
        }
        if (user.Id == userId) {
            return BadRequest("You can't remove yourself from project");
        }
        if (!await _projectTeamRepo.IsMemberInProject(projectId, userId)) {
            return NotFound("Member is not in project");
        }
        var toDelete = new ProjectTeam { ProjectId = projectId, MemberId = userId };
        await _projectTeamRepo.DeleteAsync(toDelete);
        return NoContent();
    }
}
