namespace GraphQLTemplate.Api.Services;

using GraphQLTemplate.Api.Models;

public class TaskService
{
    private readonly List<TaskItem> _tasks = new();

    public TaskService()
    {
        _tasks.Add(new TaskItem { Id = Guid.NewGuid(), Title = "Learn GraphQL", IsCompleted = false, CreatedAt = DateTime.UtcNow });
        _tasks.Add(new TaskItem { Id = Guid.NewGuid(), Title = "Build .NET API", IsCompleted = true, CreatedAt = DateTime.UtcNow.AddDays(-1) });
    }

    public IEnumerable<TaskItem> GetTasks() => _tasks;

    public TaskItem? GetTaskById(Guid id) => _tasks.FirstOrDefault(t => t.Id == id);

    public TaskItem AddTask(string title)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = title,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };
        _tasks.Add(task);
        return task;
    }

    public TaskItem? ToggleTaskCompletion(Guid id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task != null)
        {
            task.IsCompleted = !task.IsCompleted;
        }
        return task;
    }

    public bool DeleteTask(Guid id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        if (task != null)
        {
            return _tasks.Remove(task);
        }
        return false;
    }
}
