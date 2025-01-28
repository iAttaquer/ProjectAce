using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Account;

public class GetMeDto
{
  public required string Username { get; set; }
  public required string Email { get; set; }
  public required string FirstName { get; set; }
  public required string LastName { get; set; }
}
