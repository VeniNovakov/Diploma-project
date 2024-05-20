using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace pizzeria_backend.Migrations
{
    /// <inheritdoc />
    public partial class addOns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AddOnsCategory",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddOnsCategory", x => x.Id);
                }
            );

            migrationBuilder.CreateTable(
                name: "AddOns",
                columns: table => new
                {
                    Id = table
                        .Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AmountInGrams = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AddOns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AddOns_AddOnsCategory_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "AddOnsCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade
                    );
                }
            );

            migrationBuilder.InsertData(
                table: "AddOnsCategory",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Meat" },
                    { 2, "Veggies" },
                    { 3, "Cheeses" },
                    { 4, "Sauces" }
                }
            );

            migrationBuilder.CreateIndex(
                name: "IX_AddOns_CategoryId",
                table: "AddOns",
                column: "CategoryId"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "AddOns");

            migrationBuilder.DropTable(name: "AddOnsCategory");
        }
    }
}
