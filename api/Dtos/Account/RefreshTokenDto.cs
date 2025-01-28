using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Account;

public class RefreshTokenDto
{
  [Required]
  public string RefreshToken { get; set; } = string.Empty;
}
