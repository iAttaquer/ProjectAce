using System.ComponentModel.DataAnnotations;

namespace api.Dtos.User;

public class UserDto
{
  [Required]
  public string Id { get; set; }
  public required string Username { get; set; }
  public required string FirstName { get; set; }
  public required string LastName { get; set; }
}
