using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ADHDAtudyapp.Migrations
{
    /// <inheritdoc />
    public partial class AddFileTypeToUserFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFiles_Users_UserId1",
                table: "UserFiles");

            migrationBuilder.DropIndex(
                name: "IX_UserFiles_UserId1",
                table: "UserFiles");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "UserFiles");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "UserFiles",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FileType",
                table: "UserFiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_UserFiles_UserId",
                table: "UserFiles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFiles_Users_UserId",
                table: "UserFiles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFiles_Users_UserId",
                table: "UserFiles");

            migrationBuilder.DropIndex(
                name: "IX_UserFiles_UserId",
                table: "UserFiles");

            migrationBuilder.DropColumn(
                name: "FileType",
                table: "UserFiles");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "UserFiles",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "UserFiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_UserFiles_UserId1",
                table: "UserFiles",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFiles_Users_UserId1",
                table: "UserFiles",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
