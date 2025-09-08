# Inventory Management System

A modern, full-featured inventory management web application built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### ✅ Implemented

- **Modern UI/UX**: Clean, responsive design with dark mode support
- **Role-Based Access Control**: Comprehensive permission system with 6 user roles
- **Authentication**: Secure login system with context-based state management
- **Navigation**: Collapsible sidebar with grouped navigation items
- **Notifications**: Real-time notification system with STOMP WebSocket support (framework ready)
- **Responsive Design**: Mobile-first approach with responsive layouts
- **TypeScript**: Full type safety throughout the application
- **Accessibility**: Screen reader support and keyboard navigation
- **Routing**: Protected routes with lazy loading for optimal performance

### 🔄 In Progress

- **STOMP WebSocket Integration**: Real-time notifications
- **Form Components**: CRUD operations for all entities
- **API Integration**: Backend service connections
- **Data Visualization**: Charts and reports

### 📋 Planned

- **Advanced Reporting**: Comprehensive analytics and reporting
- **Bulk Operations**: Mass data operations
- **Audit Trail**: Complete activity logging
- **Mobile App**: React Native companion app

## 🏗️ Architecture

### Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── nav/            # Navigation components
│   └── ui/             # Base UI components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
├── lib/                # Utility functions and configurations
├── pages/              # Page components
├── routes/             # Routing configuration
└── types/              # TypeScript type definitions
```

### Key Technologies

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Router** for navigation
- **React Query** for data fetching
- **Lucide React** for icons

## 🔐 User Roles & Permissions

### Admin

- Full system access
- All CRUD operations
- User management
- System configuration

### Manager

- Inventory management
- Staff management
- Request approval
- Report generation

### Employee

- View inventory
- Create requests
- Basic operations

### Staff

- View inventory
- Create requests
- Basic operations

### Storekeeper

- Inventory management
- Batch management
- Stock operations

### Viewer

- Read-only access
- View reports
- Limited functionality

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd inventory-management-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎨 Design System

### Color Palette

- **Primary**: Slate-based dark theme
- **Accent**: Blue to purple gradient
- **Status Colors**: Green (success), Red (error), Yellow (warning), Blue (info)

### Typography

- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible font sizes
- **Code**: Monospace for technical content

### Components

- **Cards**: Consistent spacing and shadows
- **Buttons**: Multiple variants and states
- **Forms**: Accessible input components
- **Navigation**: Collapsible sidebar with grouping

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

### Theme Configuration

The app supports system, light, and dark themes. Theme preference is stored in localStorage.

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features

- Collapsible sidebar
- Touch-friendly interactions
- Optimized navigation
- Responsive tables and cards

## ♿ Accessibility

### Features

- **Screen Reader Support**: Proper ARIA labels and roles
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper heading hierarchy

### Testing

- Use screen readers (NVDA, JAWS, VoiceOver)
- Test keyboard-only navigation
- Verify color contrast ratios
- Check ARIA implementation

## 🔌 API Integration

### Planned Endpoints

```text
Authentication:
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

Inventory:
GET    /api/inventory
POST   /api/inventory
PUT    /api/inventory/:id
DELETE /api/inventory/:id

Staff:
GET    /api/staff
POST   /api/staff
PUT    /api/staff/:id
DELETE /api/staff/:id

Notifications:
WS /ws/notifications
```

## 🧪 Testing

### Test Structure

```text
src/
├── __tests__/          # Test files
├── components/         # Component tests
├── hooks/             # Hook tests
└── utils/             # Utility tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Build Process

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options

- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3**: Cloud storage hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Lucide** for beautiful icons
- **React Query** for data fetching
- **Vite** for fast development experience

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

## Built with ❤️ for modern inventory management
