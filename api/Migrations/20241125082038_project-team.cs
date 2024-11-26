using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class projectteam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "24049c6f-9c74-4123-b903-4da18608f381");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c717b7ec-6733-42af-87fd-323c8898d8fa");

            migrationBuilder.CreateTable(
                name: "project_teams",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    MemberId = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_project_teams", x => new { x.ProjectId, x.MemberId });
                    table.ForeignKey(
                        name: "FK_project_teams_AspNetUsers_MemberId",
                        column: x => x.MemberId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_project_teams_projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "projects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "14b95adf-646c-4f48-b434-752369b75be8", null, "Admin", "ADMIN" },
                    { "a0f4c31c-681f-479b-b825-66716f884361", null, "User", "USER" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_project_teams_MemberId",
                table: "project_teams",
                column: "MemberId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "project_teams");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "14b95adf-646c-4f48-b434-752369b75be8");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "a0f4c31c-681f-479b-b825-66716f884361");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "24049c6f-9c74-4123-b903-4da18608f381", null, "User", "USER" },
                    { "c717b7ec-6733-42af-87fd-323c8898d8fa", null, "Admin", "ADMIN" }
                });
        }
    }
}
