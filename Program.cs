using PropertyListing.Components;
using PropertyListing.Interfaces;
using PropertyListing.Services;




var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();


//builder.Services
//   .AddBlazorise(options =>
//    {
//        options.Immediate = true;
//        ////options.ProductToken = "290C-A92A-F52E-4DFF-ABEB-A88C-670F";
//    })
//  .AddBootstrap5Providers()
//  .AddFontAwesomeIcons();


builder.Services.AddSingleton<IPropertyService, PropertyService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
