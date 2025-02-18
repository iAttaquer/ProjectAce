using api.Dtos.User;
using api.Models;

namespace api.Mappers;

public static class UserMapper
{
  public static UserDto ToUserDto(this AppUser user)
  {
    return new UserDto
    {
      Id = user.Id,
      Username = user.UserName,
      FirstName = user.FirstName,
      LastName = user.LastName,
    };
  }
  public static UserDto ToUserDto(this ProjectTeam projectTeam)
  {
    return new UserDto
    {
      Id = projectTeam.Member.Id,
      Username = projectTeam.Member.UserName,
      FirstName = projectTeam.Member.FirstName,
      LastName = projectTeam.Member.LastName,
    };
  }
  public static UserDto ToUserDto(this AssignmentUser assignmentUser)
  {
    return new UserDto
    {
      Id = assignmentUser.UserId,
      Username = assignmentUser.User.UserName,
      FirstName = assignmentUser.User.FirstName,
      LastName = assignmentUser.User.LastName,
    };
  }
}
