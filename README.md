# Support Ticket Management System

A comprehensive backend API for managing support tickets built with NestJS, TypeScript, MySQL, and Prisma ORM. This system provides role-based access control, ticket lifecycle management, and collaborative commenting features.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **User Management**: Create and manage users with different roles (MANAGER, SUPPORT, USER)
- **Ticket Management**: Create, assign, update status, and delete tickets
- **Status Lifecycle**: Strict status transitions (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- **Comments**: Add, edit, and delete comments on tickets
- **Audit Logs**: Track all status changes with timestamps and user info
- **Swagger Documentation**: Interactive API docs at `/docs`

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
   - Create a MySQL database named `support_ticket_db`
   - Update the database credentials in `.env` file

4. Configure environment variables:
   - Copy `.env.example` to `.env` (if exists) or update `.env`
   - Set your MySQL credentials and JWT secret

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Generate Prisma client:
```bash
npx prisma generate
```

## Database Setup

The application uses MySQL. Make sure you have MySQL running and update the connection string in `prisma/schema.prisma` or via environment variables.

Default connection:
```
mysql://root:yourpassword@localhost:3306/support_ticket_db
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`
Swagger docs at `http://localhost:3000/docs`

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### Users (MANAGER only)
- `POST /users` - Create user
- `GET /users` - List all users

### Tickets
- `POST /tickets` - Create ticket (USER, MANAGER)
- `GET /tickets` - List tickets (filtered by role)
- `GET /tickets/:id` - Get ticket details
- `PATCH /tickets/:id/assign` - Assign ticket (MANAGER, SUPPORT)
- `PATCH /tickets/:id/status` - Update status (MANAGER, SUPPORT)
- `DELETE /tickets/:id` - Delete ticket (MANAGER only)

### Comments
- `POST /tickets/:id/comments` - Add comment
- `GET /tickets/:id/comments` - List comments
- `PATCH /comments/:id` - Edit comment (author or MANAGER)
- `DELETE /comments/:id` - Delete comment (author or MANAGER)

## User Roles & Permissions

- **USER**: Can create tickets, view/edit their own tickets and comments
- **SUPPORT**: Can view/assign/update status of assigned tickets, add comments
- **MANAGER**: Full access to all features, user management

## Project Structure

```
src/
├── auth/                 # Authentication module
├── users/                # User management
├── tickets/              # Ticket operations
├── ticket-comments/      # Comment management
├── ticket-status-logs/   # Status change logs
├── prisma/               # Database service
├── enums/                # Shared enums
└── common/               # Shared utilities
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## License

This project is licensed under the MIT License.
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
"# ticket_managment" 
