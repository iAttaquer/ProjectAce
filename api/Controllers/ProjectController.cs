using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using api.Mappers;
using api.Dtos.Project;
using Microsoft.AspNetCore.Identity;
using api.Models;
using System.Security.Claims;
using api.Extensions;
using Microsoft.EntityFrameworkCore;
using api.Filters;

namespace api.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectRepository _projectRepo;
        private readonly UserManager<AppUser> _userManager;
        public ProjectController(IProjectRepository projectRepo, UserManager<AppUser> userManager)
        {
            _projectRepo = projectRepo;
            _userManager = userManager;
        }

        /// <summary>
        /// Create a new project
        /// </summary>
        /// <param name="projectDto"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize]
        [AuthorizeUser]
        public async Task<IActionResult> Create([FromBody] CreateProjectDto projectDto)
        {
            var user = (AppUser)HttpContext.Items["User"];
            var projectModel = projectDto.ToProjectFromDto();
            projectModel.CreatedById = user.Id;
            await _projectRepo.CreateAsync(projectModel);
            return CreatedAtAction(nameof(GetById), new { id = projectModel.Id }, projectModel.ToProjectDto());
        }

        /// <summary>
        /// Get all projects
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }

            var projects = await _projectRepo.GetAllAsync();

            var projectDto = projects.Select(p => p.ToProjectDto());

            return Ok(projectDto);
        }

        /// <summary>
        /// Get project by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id:guid}")]
        [Authorize]
        public async Task<IActionResult> GetById([FromRoute] Guid id)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var project = await _projectRepo.GetByIdAsync(id);

            if (project is null) {
                return NotFound("Project not found");
            }

            return Ok(project.ToProjectDto());
        }

        /// <summary>
        /// Get all projects created by user
        /// </summary>
        /// <returns></returns>
        [HttpGet("myprojects")]
        [Authorize]
        [AuthorizeUser]
        public async Task<IActionResult> GetMyProjects()
        {
            var user = (AppUser)HttpContext.Items["User"];

            var projects = await _projectRepo.GetAllByUserIdAsync(user.Id);

            var projectsDto = projects.Select(p =>p.ToProjectDto());

            return Ok(projectsDto);
        }

        /// <summary>
        /// Update a project. Only for creator of project
        /// </summary>
        /// <param name="id"></param>
        /// <param name="updateDto"></param>
        /// <returns></returns>
        [HttpPut("{id:guid}")]
        [Authorize]
        [AuthorizeUser]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] CreateProjectDto updateDto)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var existingProject = await _projectRepo.GetByIdAsync(id);
            if (existingProject is null) {
                return NotFound("Project not found");
            }
            var user = (AppUser)HttpContext.Items["User"];
            if (existingProject.CreatedById != user.Id) {
                return Forbid();
            }
            var project = await _projectRepo.UpdateAsync(id, updateDto.ToProjectFromDto());

            return Ok(project.ToProjectDto());
        }

        /// <summary>
        /// Delete a project. Only for creator of project
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id:guid}")]
        [Authorize]
        [AuthorizeUser]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            var toDeleteProject = await _projectRepo.GetByIdAsync(id);
            if (toDeleteProject is null) {
                return NotFound("Project does not exist");
            }
            var user = (AppUser)HttpContext.Items["User"];
            if (toDeleteProject.CreatedById != user.Id) {
                return Forbid();
            }
            var projectModel = await _projectRepo.DeleteAsync(id);
            return Ok(projectModel.ToProjectDto());
        }
    }
}