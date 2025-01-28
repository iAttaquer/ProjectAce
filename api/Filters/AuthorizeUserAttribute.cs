using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Filters;

public class AuthorizeUserAttribute : ActionFilterAttribute
{
  public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
  {
    var username = context.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrEmpty(username))
    {
      context.Result = new UnauthorizedObjectResult("User not authenticated");
      return;
    }
    var userManager = context.HttpContext.RequestServices.GetService<UserManager<AppUser>>();
    var user = await userManager.FindByNameAsync(username);

    if (user == null)
    {
      context.Result = new UnauthorizedObjectResult("Invalid username!");
      return;
    }

    context.HttpContext.Items["User"] = user;
    await next();
  }
}
