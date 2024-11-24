using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class projectassignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "007e4992-f723-41d8-a1b6-59cb3d9bd273");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2a5793f0-728c-4530-afc0-c7996e1601c1");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProjectId",
                table: "assignments",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "24049c6f-9c74-4123-b903-4da18608f381", null, "User", "USER" },
                    { "c717b7ec-6733-42af-87fd-323c8898d8fa", null, "Admin", "ADMIN" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_assignments_ProjectId",
                table: "assignments",
                column: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_assignments_projects_ProjectId",
                table: "assignments",
                column: "ProjectId",
                principalTable: "projects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_assignments_projects_ProjectId",
                table: "assignments");

            migrationBuilder.DropIndex(
                name: "IX_assignments_ProjectId",
                table: "assignments");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "24049c6f-9c74-4123-b903-4da18608f381");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c717b7ec-6733-42af-87fd-323c8898d8fa");

            migrationBuilder.AlterColumn<Guid>(
                name: "ProjectId",
                table: "assignments",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "007e4992-f723-41d8-a1b6-59cb3d9bd273", null, "Admin", "ADMIN" },
                    { "2a5793f0-728c-4530-afc0-c7996e1601c1", null, "User", "USER" }
                });
        }
    }
}
