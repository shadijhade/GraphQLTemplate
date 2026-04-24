namespace GraphQLTemplate.Api.GraphQL;

using GraphQLTemplate.Api.Models;
using GraphQLTemplate.Api.Services;

public class Query
{
    public IEnumerable<TaskItem> GetTasks([Service] TaskService taskService) => 
        taskService.GetTasks();

    public TaskItem? GetTaskById([Service] TaskService taskService, Guid id) => 
        taskService.GetTaskById(id);
}
