using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data;

public class ApplicationDBContext : IdentityDbContext<AppUser>
{
    public ApplicationDBContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
    {

    }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Assignment> Assignments { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Project>(x => x.HasKey(p => new { p.Id }));

        builder.Entity<Project>()
            .HasOne(u => u.CreatedBy)
            .WithMany(p => p.Projects)
            .HasForeignKey(p => p.CreatedById);

        builder.Entity<Assignment>(x => x.HasKey(a => new { a.Id }));

        builder.Entity<Assignment>()
            .HasOne(u => u.CreatedBy)
            .WithMany(a => a.Assignments)
            .HasForeignKey(a => a.CreatedById);

        builder.Entity<Assignment>()
            .HasOne(a => a.Project)
            .WithMany(p => p.Assignments)
            .HasForeignKey(a => a.ProjectId);

        List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Name = "Admin",
                    NormalizedName = "ADMIN"
                },
                new IdentityRole
                {
                    Name = "User",
                    NormalizedName = "USER"
                },
            };
        builder.Entity<IdentityRole>().HasData(roles);
    }
}
