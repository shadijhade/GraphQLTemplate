using GraphQLTemplate.Api.GraphQL;
using GraphQLTemplate.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin(); // Use specific origins in production
    });
});

builder.Services.AddSingleton<TaskService>();

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .AddSubscriptionType<Subscription>()
    .AddInMemorySubscriptions();

var app = builder.Build();

app.UseCors();
app.UseWebSockets();
app.MapGraphQL();

app.Run();
