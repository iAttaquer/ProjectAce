using api.Dtos.Project;
using api.Models;

namespace api.Mappers;

public static class ProjectMapper
{
  public static ProjectDto ToProjectDto(this Project project)
  {
    return new ProjectDto
    {
      Id = project.Id,
      Name = project.Name,
      Description = project.Description,
      Status = project.Status,
      CreatedAt = project.CreatedAt,
      CreatedBy = project.CreatedBy.UserName,
    };
  }
  public static Project ToProjectFromDto(this CreateProjectDto projectDto)
  {
    return new Project
    {
      Name = projectDto.Name,
      Description = projectDto.Description,
      Status = projectDto.Status,
    };
  }
  public static ProjectDto ToProjectDto(this ProjectTeam projectTeam)
  {
    return new ProjectDto
    {
      Id = projectTeam.ProjectId,
      Name = projectTeam.Project.Name,
      Description = projectTeam.Project.Description,
      Status = projectTeam.Project.Status,
      CreatedAt = projectTeam.Project.CreatedAt,
      CreatedBy = projectTeam.Project.CreatedBy.UserName,
    };
  }
}
