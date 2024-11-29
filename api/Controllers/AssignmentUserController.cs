using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/assignment-users")]
[ApiController]
public class AssignmentUsersController : ControllerBase
{
  private readonly IAssignmentUserRepository _assignmentUserRepository;
  private readonly IAssignmentRepository _assignmentRepository;
  private readonly IUserRepository _userRepository;

  public AssignmentUsersController(IAssignmentUserRepository assignmentUserRepository, IAssignmentRepository assignmentRepository, IUserRepository userRepository)
  {
    _assignmentUserRepository = assignmentUserRepository;
    _assignmentRepository = assignmentRepository;
    _userRepository = userRepository;
  }

  [HttpPost("{assignmentId:guid}/{memberId}")]
  [Authorize]
  public async Task<IActionResult> Create([FromRoute] Guid assignmentId, [FromRoute] string memberId)
  {
  }
}