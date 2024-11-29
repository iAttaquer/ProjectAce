using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace api.Models;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<Project> Projects { get; set; } = new List<Project>();
    public List<Assignment> Assignments { get; set; } = new List<Assignment>();
    public List<ProjectTeam> ProjectTeams { get; set; } = new List<ProjectTeam>();
    public List<AssignmentUser> AssignmentUsers { get; set; } = new List<AssignmentUser>();
}
