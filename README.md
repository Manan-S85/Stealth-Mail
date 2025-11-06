# Stealth Mail

A modern, privacy-focused temporary email service built with Next.js and Express.js.

## 🚀 Features

- **Instant Email Generation**: Create temporary email addresses in seconds
- **Real-time Inbox**: Receive and view emails instantly with auto-refresh
- **100% Anonymous**: No registration or personal information required
- **Auto-Expiry**: Emails automatically expire after 10 minutes
- **Privacy-First**: Built with privacy and security in mind
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Blog Integration**: Stay informed with privacy and security articles

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API calls

### Backend
- **Express.js**: Fast, unopinionated web framework
- **Mail.tm API**: Temporary email service integration
- **Notion API**: Blog content management
- **CORS & Helmet**: Security middleware

### Deployment
- **Vercel**: Next.js optimized hosting platform
- **GitHub Actions**: Automated CI/CD pipeline

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── EmailBox.jsx
│   │   │   ├── Inbox.jsx
│   │   │   └── Articles.jsx
│   │   ├── page.jsx
│   │   ├── layout.jsx
│   │   └── globals.css
│   └── lib/
│       ├── mailApi.js
│       └── notionApi.js
├── server/
│   ├── routes/
│   │   ├── mail.js
│   │   └── articles.js
│   ├── services/
│   │   ├── mailService.js
│   │   └── notionService.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── index.js
├── public/
│   └── assets/
├── .github/
│   └── workflows/
│       └── deploy.yml
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- (Optional) Notion account for blog integration

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Stealth-Mail
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   cp server/.env.example server/.env
   ```

5. **Configure environment variables:**
   
   Edit `server/.env` and add your configuration:
   ```env
   NODE_ENV=development
   PORT=3001
   
   # Optional: Notion API (for blog integration)
   NOTION_TOKEN=your_notion_integration_token
   NOTION_DATABASE_ID=your_notion_database_id
   
   JWT_SECRET=your_jwt_secret_key
   ```

   ⚠️ **Security Note:** Never commit your `.env` files to Git! They contain sensitive API keys and secrets.

### Development

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **In another terminal, start the frontend:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

## 📡 API Endpoints

### Mail Endpoints

- `POST /api/mail/create` - Create temporary email
- `GET /api/mail/inbox?email={email}` - Get inbox messages
- `GET /api/mail/message/:id` - Get specific message
- `DELETE /api/mail/delete` - Delete email account
- `GET /api/mail/domains` - Get available domains

### Article Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/popular` - Get popular articles
- `GET /api/articles/search?query={query}` - Search articles
- `GET /api/articles/categories` - Get article categories
- `GET /api/articles/category/:category` - Get articles by category
- `GET /api/articles/:id` - Get specific article

## 🔧 Configuration

### Mail.tm Integration

The application uses Mail.tm API for temporary email functionality. No API key is required as it's a free service.

### Notion Integration (Optional)

To integrate with Notion for blog content:

1. Create a Notion integration at https://developers.notion.com
2. Create a database with the following properties:
   - Title (Title)
   - Excerpt (Text)
   - Author (Text)
   - Category (Select)
   - Status (Select: Published/Draft)
   - Popular (Checkbox)
   - Views (Number)
   - Created (Date)
   - URL (URL)
   - Tags (Multi-select)

3. Add your integration token and database ID to the environment variables

If Notion is not configured, the application will use fallback demo data.

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI (optional):**
   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub Integration:**
   - Connect your GitHub repository to Vercel
   - Automatic deployments on push to main branch
   - Preview deployments on pull requests

3. **Manual deployment:**
   ```bash
   npm run build
   vercel --prod
   ```

### Backend Server Deployment

The Express server (in `/server` directory) needs to be deployed separately. Recommended options:

1. **Railway, Render, or Heroku** for the Express server
2. **Vercel Functions** (requires converting Express routes to serverless functions)  
3. **DigitalOcean App Platform** or similar PaaS solutions

For separate server deployment:
```bash
cd server
npm install
npm start
```

### Environment Variables

Set up the following environment variables in Vercel:
- `NODE_ENV=production`
- `NOTION_TOKEN` (optional)
- `NOTION_DATABASE_ID` (optional)
- `JWT_SECRET`

### GitHub Actions CI/CD

The repository can include a GitHub Actions workflow that automatically:

1. Runs tests and linting on pull requests
2. Builds and deploys to Vercel on pushes to main branch

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with configurable rate limits
- **CORS Protection**: Restricts cross-origin requests
- **Helmet.js**: Sets various HTTP headers for security
- **Input Validation**: Validates and sanitizes all inputs
- **Error Handling**: Comprehensive error handling without data leakage

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. Key configuration:

- **Colors**: Primary and secondary color schemes in `tailwind.config.js`
- **Components**: Reusable component classes in `globals.css`
- **Animations**: Custom animations for smooth interactions

### Features

- **Email Expiry**: Configurable email lifespan (default: 10 minutes)
- **Rate Limits**: Adjustable rate limiting for API endpoints
- **Blog Content**: Customizable article categories and content

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📧 Support

For support, email support@stealthmail.com or create an issue in the repository.

## 🙏 Acknowledgments

- [Mail.tm](https://mail.tm) for providing the temporary email API
- [Notion](https://notion.so) for content management capabilities
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Lucide](https://lucide.dev) for the beautiful icon set

---

**Built with ❤️ for privacy and security**