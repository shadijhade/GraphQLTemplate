namespace GraphQLTemplate.Api.GraphQL;

using GraphQLTemplate.Api.Models;

public class Subscription
{
    [Subscribe]
    public TaskItem OnTaskAdded([EventMessage] TaskItem task) => task;

    [Subscribe]
    public TaskItem OnTaskUpdated([EventMessage] TaskItem task) => task;
}
