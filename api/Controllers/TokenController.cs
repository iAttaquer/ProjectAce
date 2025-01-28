using api.Dtos.Account;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers;

[Route("api/token")]
[ApiController]
public class TokenController : ControllerBase
{
  private readonly UserManager<AppUser> _userManager;
  private readonly ITokenService _tokenService;

  public TokenController(UserManager<AppUser> userManager, ITokenService tokenService)
  {
    _userManager = userManager;
    _tokenService = tokenService;
  }

  /// <summary>
  /// Refresh token
  /// </summary>
  /// <param name="refreshTokenDto"></param>
  /// <returns></returns>
  [HttpPost("refresh-token")]
  [ProducesResponseType(typeof(TokensDto), StatusCodes.Status200OK)]
  [ProducesResponseType(StatusCodes.Status400BadRequest)]
  [ProducesResponseType(StatusCodes.Status401Unauthorized)]
  public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
  {
    if (string.IsNullOrEmpty(refreshTokenDto.RefreshToken))
    {
      return BadRequest("Invalid refresh token");
    }
    var user = await _userManager.Users.FirstOrDefaultAsync(x =>
      x.RefreshToken == refreshTokenDto.RefreshToken);

    if (user is null || user.RefreshTokenExpiryTime <= DateTime.Now)
    {
      return Unauthorized("Invalid refresh token");
    }

    var newAccessToken = _tokenService.CreateToken(user);
    var newRefreshToken = _tokenService.CreateRefreshToken();

    user.RefreshToken = newRefreshToken;
    user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
    await _userManager.UpdateAsync(user);

    return Ok(new TokensDto
    {
      AccessToken = newAccessToken,
      RefreshToken = newRefreshToken,
    });
  }
}
