using api.Dtos.User;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[Route("api/users")]
[ApiController]
public class UserController : ControllerBase
{
  private readonly IUserRepository _userRepository;
  public UserController(IUserRepository userRepository)
  {
    _userRepository = userRepository;
  }

  /// <summary>
  /// Get all users
  /// </summary>
  /// <returns></returns>
  [HttpGet]
  [Authorize]
  [ProducesResponseType(typeof(List<UserDto>), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetUsers()
  {
    var users = await _userRepository.GetAllAsync();

    var userDto = users.Select(u => u.ToUserDto());

    return Ok(userDto);
  }

  /// <summary>
  /// Get user by id
  /// </summary>
  /// <param name="id"></param>
  /// <returns></returns>
  [HttpGet("{id:alpha}")]
  [Authorize]
  [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
  public async Task<IActionResult> GetUserById([FromRoute] string id)
  {
    var user = await _userRepository.GetByIdAsync(id);
    if (user is null)
    {
      return NotFound("User not found");
    }
    return Ok(user.ToUserDto());
  }
}
