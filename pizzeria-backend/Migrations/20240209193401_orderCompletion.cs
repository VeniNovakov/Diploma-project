using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace pizzeria_backend.Migrations
{
    /// <inheritdoc />
    public partial class orderCompletion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Order",
                type: "bit",
                nullable: false,
                defaultValue: false
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IsCompleted", table: "Order");
        }
    }
}
