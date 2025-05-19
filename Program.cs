using ADHDStudyApp.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllersWithViews();

builder.Services.AddSession();

var app = builder.Build();


app.UseStaticFiles();

app.UseRouting();

app.UseSession();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Enteremail}/{id?}");

app.Run();