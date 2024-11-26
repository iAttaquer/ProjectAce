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
  public async Task<IActionResult> GetUsers()
  {
    var users = await _userRepository.GetAllAsync();

    var userDto = users.Select(u => u.ToUserDto());

    return Ok(userDto);
  }
}