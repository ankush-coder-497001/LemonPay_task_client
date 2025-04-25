# Task Management System - Client

A modern, responsive task management system built with React and Tailwind CSS. This application provides a seamless user experience for managing tasks with features like authentication, task creation, editing, and deletion.

## Features

- 🔐 User Authentication (Login/Signup)
- ✨ Modern and Responsive UI
- 📱 Mobile-First Design
- 🎨 Beautiful Gradient Background
- ⚡ Real-time Task Management
- 🔄 Automatic Task List Refresh
- 📅 Date and Time Management
- 🎯 Task Prioritization
- 🔍 Search and Filter Tasks
- 📊 Pagination Support

## Tech Stack

- React.js
- Tailwind CSS
- React Router
- Axios
- Context API for State Management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Todo_task_client
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=http://localhost:7000/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── assets/          # Static assets
├── components/      # Reusable components
├── context/         # Context providers
├── pages/          # Page components
├── Server_API.js    # API integration
└── main.jsx        # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Integration

The application integrates with a RESTful API for:
- User authentication
- Task management (CRUD operations)
- Data persistence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository.
