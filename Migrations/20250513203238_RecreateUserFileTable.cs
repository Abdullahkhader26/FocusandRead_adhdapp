using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADHDAtudyapp.Migrations
{
    /// <inheritdoc />
    public partial class RecreateUserFileTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Content",
                table: "UserFiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Content",
                table: "UserFiles");
        }
    }
}
