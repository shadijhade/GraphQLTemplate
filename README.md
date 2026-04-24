# GraphQL Showcase (.NET 10 + Angular 19)

Welcome to the **GraphQL Showcase** repository! This project serves as a premium, fully-functional template demonstrating the three core pillars of GraphQL: **Queries, Mutations, and Subscriptions**. 

It pairs a robust **.NET 10 backend** powered by HotChocolate with a stunning, glassmorphism-styled **Angular 19 frontend** powered by Apollo Angular.

## ✨ Features Highlighted

1. **Queries (Data Fetching)**
   - Initial application state is hydrated via a standard GraphQL Query over HTTP.
2. **Mutations (Data Modification)**
   - Creating, toggling, and deleting tasks are all executed via distinct GraphQL Mutations.
3. **Subscriptions (Real-Time Events)**
   - The frontend establishes a live WebSocket connection to the .NET API.
   - Any time a mutation occurs, the server instantly broadcasts the changes over WebSockets, updating the UI in real-time across all connected clients.

## 🛠️ Technology Stack

- **Backend:** .NET 10, ASP.NET Core Web API, HotChocolate (GraphQL Server).
- **Frontend:** Angular 19 (Standalone & Zoneless), Apollo Angular, Vanilla CSS with custom theming.

---

## 🚀 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js](https://nodejs.org/) (v18 or higher)
- NPM or Yarn

### 1. Running the Backend (API)

Navigate to the API directory and start the .NET application:

```bash
cd GraphQLTemplate.Api
dotnet run
```

The API will start listening on `http://localhost:5095`. 
*(Note: You can access the Banana Cake Pop GraphQL IDE by navigating to `http://localhost:5095/graphql` in your browser!)*

### 2. Running the Frontend (Angular App)

Open a **new terminal window**, navigate to the App directory, install dependencies, and start the development server:

```bash
cd GraphQLTemplate.App
npm install
npm start
```

The Angular application will be available at `http://localhost:4200`.

---

## 💡 Testing Real-Time Subscriptions

To truly experience the magic of GraphQL Subscriptions:
1. Open the Angular app (`http://localhost:4200`) in **two distinct browser windows** placed side-by-side.
2. In Window A, add a new task or delete an existing one.
3. Watch Window B! The "Live Event Feed" panel will instantly illuminate with the incoming WebSocket event, and the task list will automatically update without a page refresh.

---

## 📂 Project Structure

- `/GraphQLTemplate.Api`: The .NET 10 backend.
  - `Models/`: Contains the `TaskItem` data entity.
  - `Services/`: Contains an in-memory `TaskService` mimicking database operations.
  - `GraphQL/`: Contains the specific `Query`, `Mutation`, and `Subscription` resolvers used by HotChocolate.
- `/GraphQLTemplate.App`: The Angular frontend.
  - `src/app/app.ts`: Contains the Apollo Client logic, queries, and state management.
  - `src/app/app.config.ts`: Configures the Apollo HTTP and WebSocket split-links, and sets up Angular's modern zoneless change detection.
  - `src/app/app.html & .css`: The premium UI layout.

Happy coding! 🚀
