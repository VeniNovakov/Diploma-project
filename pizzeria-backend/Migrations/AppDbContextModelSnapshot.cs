﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using pizzeria_backend;

#nullable disable

namespace pizzeria_backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    partial class AppDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("pizzeria_backend.Models.AddOn", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AmountInGrams")
                        .HasColumnType("int");

                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("AddOns", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.AddOnsCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("AddOnsCategory", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Meat"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Veggies"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Cheeses"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Sauces"
                        });
                });

            modelBuilder.Entity("pizzeria_backend.Models.Basket", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("Baskets", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.BasketAddOn", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AddOnId")
                        .HasColumnType("int");

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AddOnId");

                    b.HasIndex("ProductId");

                    b.ToTable("BasketAddOns", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.BasketProduct", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.Property<int>("BasketId")
                        .HasColumnType("int");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BasketId");

                    b.HasIndex("ProductId");

                    b.ToTable("BasketProducts", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<bool>("IsCompleted")
                        .HasColumnType("bit");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.Property<DateTime>("WantedFor")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Order", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.OrderedAddOn", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AddOnId")
                        .HasColumnType("int");

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AddOnId");

                    b.HasIndex("ProductId");

                    b.ToTable("OrderedAddOns", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.OrderedProduct", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Amount")
                        .HasColumnType("int");

                    b.Property<int>("OrderId")
                        .HasColumnType("int");

                    b.Property<int>("ProductId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OrderId");

                    b.HasIndex("ProductId");

                    b.ToTable("OrderedProducts", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Image")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAvailable")
                        .HasColumnType("bit");

                    b.Property<bool>("IsInMenu")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("Products", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.ProductsCategory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ProductsCategories", (string)null);

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Name = "Pizza"
                        },
                        new
                        {
                            Id = 2,
                            Name = "Burger"
                        },
                        new
                        {
                            Id = 3,
                            Name = "Salad"
                        },
                        new
                        {
                            Id = 4,
                            Name = "Pasta"
                        },
                        new
                        {
                            Id = 5,
                            Name = "Rice"
                        });
                });

            modelBuilder.Entity("pizzeria_backend.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("bit");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("pizzeria_backend.Models.AddOn", b =>
                {
                    b.HasOne("pizzeria_backend.Models.AddOnsCategory", "Category")
                        .WithMany("AddOns")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");
                });

            modelBuilder.Entity("pizzeria_backend.Models.Basket", b =>
                {
                    b.HasOne("pizzeria_backend.Models.User", "User")
                        .WithOne("Basket")
                        .HasForeignKey("pizzeria_backend.Models.Basket", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("pizzeria_backend.Models.BasketAddOn", b =>
                {
                    b.HasOne("pizzeria_backend.Models.AddOn", "AddOn")
                        .WithMany("BasketedAddOns")
                        .HasForeignKey("AddOnId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("pizzeria_backend.Models.BasketProduct", "Product")
                        .WithMany("AddOns")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AddOn");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("pizzeria_backend.Models.BasketProduct", b =>
                {
                    b.HasOne("pizzeria_backend.Models.Basket", "Basket")
                        .WithMany("BasketProducts")
                        .HasForeignKey("BasketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("pizzeria_backend.Models.Product", "Product")
                        .WithMany("BasketedProducts")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Basket");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("pizzeria_backend.Models.Order", b =>
                {
                    b.HasOne("pizzeria_backend.Models.User", "User")
                        .WithMany("Orders")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("pizzeria_backend.Models.OrderedAddOn", b =>
                {
                    b.HasOne("pizzeria_backend.Models.AddOn", "AddOn")
                        .WithMany("OrderedAddOns")
                        .HasForeignKey("AddOnId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("pizzeria_backend.Models.OrderedProduct", "Product")
                        .WithMany("AddOns")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AddOn");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("pizzeria_backend.Models.OrderedProduct", b =>
                {
                    b.HasOne("pizzeria_backend.Models.Order", "Order")
                        .WithMany("OrderedProducts")
                        .HasForeignKey("OrderId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("pizzeria_backend.Models.Product", "Product")
                        .WithMany("OrderedProducts")
                        .HasForeignKey("ProductId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Order");

                    b.Navigation("Product");
                });

            modelBuilder.Entity("pizzeria_backend.Models.Product", b =>
                {
                    b.HasOne("pizzeria_backend.Models.ProductsCategory", "Category")
                        .WithMany("Products")
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Category");
                });

            modelBuilder.Entity("pizzeria_backend.Models.AddOn", b =>
                {
                    b.Navigation("BasketedAddOns");

                    b.Navigation("OrderedAddOns");
                });

            modelBuilder.Entity("pizzeria_backend.Models.AddOnsCategory", b =>
                {
                    b.Navigation("AddOns");
                });

            modelBuilder.Entity("pizzeria_backend.Models.Basket", b =>
                {
                    b.Navigation("BasketProducts");
                });

            modelBuilder.Entity("pizzeria_backend.Models.BasketProduct", b =>
                {
                    b.Navigation("AddOns");
                });

            modelBuilder.Entity("pizzeria_backend.Models.Order", b =>
                {
                    b.Navigation("OrderedProducts");
                });

            modelBuilder.Entity("pizzeria_backend.Models.OrderedProduct", b =>
                {
                    b.Navigation("AddOns");
                });

            modelBuilder.Entity("pizzeria_backend.Models.Product", b =>
                {
                    b.Navigation("BasketedProducts");

                    b.Navigation("OrderedProducts");
                });

            modelBuilder.Entity("pizzeria_backend.Models.ProductsCategory", b =>
                {
                    b.Navigation("Products");
                });

            modelBuilder.Entity("pizzeria_backend.Models.User", b =>
                {
                    b.Navigation("Basket")
                        .IsRequired();

                    b.Navigation("Orders");
                });
#pragma warning restore 612, 618
        }
    }
}
