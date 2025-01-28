using System.ComponentModel.DataAnnotations;
namespace api.Dtos.Account;

public class TokensDto
{
  [Required]
  public string? AccessToken { get; set; }
  [Required]
  public string? RefreshToken { get; set; }
}
