namespace GraphQLTemplate.Api.GraphQL;

using GraphQLTemplate.Api.Models;
using GraphQLTemplate.Api.Services;
using HotChocolate.Subscriptions;

public class Mutation
{
    public async Task<TaskItem> AddTask(
        [Service] TaskService taskService,
        [Service] ITopicEventSender eventSender,
        string title)
    {
        var task = taskService.AddTask(title);
        await eventSender.SendAsync(nameof(Subscription.OnTaskAdded), task);
        return task;
    }

    public async Task<TaskItem?> ToggleTaskCompletion(
        [Service] TaskService taskService,
        [Service] ITopicEventSender eventSender,
        Guid id)
    {
        var task = taskService.ToggleTaskCompletion(id);
        if (task != null)
        {
            await eventSender.SendAsync(nameof(Subscription.OnTaskUpdated), task);
        }
        return task;
    }

    public bool DeleteTask(
        [Service] TaskService taskService,
        Guid id)
    {
        return taskService.DeleteTask(id);
    }
}
