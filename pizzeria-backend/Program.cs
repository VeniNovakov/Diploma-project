using Microsoft.EntityFrameworkCore;
using pizzeria_backend;
using pizzeria_backend.Hubs;
using pizzeria_backend.Services;
var builder = WebApplication.CreateBuilder(args);

var Configuration = builder.Configuration;

var configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();

builder.Services.AddSingleton<IConfiguration>(configuration);

builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

builder.Services.AddScoped<IExampleService, Example>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IAzureBlobStorageService, AzureBlobStorageService>();
builder.Services.AddScoped<IAddOnService, AddOnService>();
builder.Services.AddScoped<IOrderService, OrdersService>();
builder.Services.AddSingleton<IOrderHub, OrderHubService>();

builder.Services.AddSignalR();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "lmao",
                     policy =>
                     {
                         policy.AllowAnyHeader()
                               .AllowAnyMethod()
                               .AllowAnyOrigin();
                     });
});
var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");

    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("lmao");

app.UseHttpsRedirection();

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();
app.MapSwagger();
app.MapControllerRoute(
    name: "default",
    pattern: "/{controller=Home}/{action=Index}/{id?}");

app.MapHub<OrderHub>("/ws");

app.MapFallbackToFile("index.html");


app.Run();