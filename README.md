# SensorLab — IR Evanescent Wave Sensor Dashboard
## Full-Stack App: React + Node.js + MongoDB

---

## 📁 Project Structure

```
sensor-app/
├── server/                   ← Node.js + Express + MongoDB backend
│   ├── index.js              ← Entry point
│   ├── .env                  ← Environment variables
│   ├── package.json
│   ├── models/
│   │   ├── User.js           ← User schema (auth)
│   │   ├── SensorReading.js  ← Sensor data schema
│   │   └── ProductTest.js    ← Product test schema
│   ├── routes/
│   │   ├── auth.js           ← /api/auth (login, register, me)
│   │   ├── sensors.js        ← /api/sensors (CRUD + seed)
│   │   └── products.js       ← /api/products (CRUD + seed)
│   └── middleware/
│       └── auth.js           ← JWT protect middleware
│
└── client/                   ← React frontend
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css         ← Global styles + CSS variables
        ├── App.js            ← Router + PrivateRoute
        ├── context/
        │   └── AuthContext.js ← Global auth state
        └── pages/
            ├── LoginPage.js  ← Login + Register UI
            └── Dashboard.js  ← Main dashboard (overview, tables, forms)
```

---

## 🛠️ Prerequisites — Install These First

### 1. Node.js (v18+)
Download from: https://nodejs.org
Verify: `node --version` and `npm --version`

### 2. MongoDB Community Server
Download from: https://www.mongodb.com/try/download/community
- Windows: Run the installer, check "Install MongoDB as a Service"
- Mac: `brew tap mongodb/brew && brew install mongodb-community`
- Linux: Follow https://www.mongodb.com/docs/manual/administration/install-on-linux/

Verify MongoDB is running:
- Windows: Services → MongoDB → Running
- Mac/Linux: `sudo systemctl start mongod` or `brew services start mongodb-community`

### 3. VS Code
Download from: https://code.visualstudio.com

### 4. VS Code Extensions (recommended)
Open VS Code → Extensions (Ctrl+Shift+X) → Install:
- **ES7+ React/Redux/React-Native snippets** (dsznajder)
- **Prettier - Code formatter** (esbenp)
- **MongoDB for VS Code** (MongoDB)
- **Thunder Client** (for testing APIs — alternative to Postman)
- **Auto Rename Tag**
- **GitLens**

---

## 🚀 Step-by-Step Setup in VS Code

### Step 1 — Open the Project

```bash
# Open VS Code, then open integrated terminal:
# View → Terminal   OR   Ctrl+` (backtick)

# Navigate to the project folder
cd path/to/sensor-app
```

Or: **File → Open Folder** → select the `sensor-app` folder

---

### Step 2 — Set Up the Backend (Server)

In the VS Code terminal:

```bash
# Go into the server folder
cd server

# Install all dependencies
npm install
```

This installs: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon

**Edit the `.env` file** if needed (already configured for local MongoDB):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/sensor_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

---

### Step 3 — Start the Backend Server

```bash
# Still inside /server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

**Keep this terminal open.** Open a new terminal for the next step.

---

### Step 4 — Set Up the Frontend (Client)

In a NEW VS Code terminal (click the + button in terminal panel):

```bash
# Go to the client folder
cd client

# Install all dependencies (takes 2-3 minutes)
npm install
```

This installs: react, react-dom, react-router-dom, axios, chart.js, react-chartjs-2

---

### Step 5 — Start the React App

```bash
# Still inside /client
npm start
```

Browser opens automatically at: **http://localhost:3000**

---

### Step 6 — Register & Login

1. Open http://localhost:3000
2. Click **Register** tab
3. Enter your name, email, and password (min 6 chars)
4. You'll be redirected to the dashboard

---

### Step 7 — Load Research Data

Once on the dashboard:
1. Click the **"⟳ Seed Research Data"** button (top right)
2. This loads all 4 sensor types + 5 product test results from the paper
3. Charts and tables will populate immediately

---

## 🔌 API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Sensors
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/sensors` | Get all readings | Yes |
| GET | `/api/sensors/stats` | Summary statistics | Yes |
| POST | `/api/sensors` | Add new reading | Yes |
| DELETE | `/api/sensors/:id` | Delete reading | Yes |
| POST | `/api/sensors/seed` | Load research data | Yes |

### Products
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all product tests | Yes |
| POST | `/api/products` | Add product test | Yes |
| DELETE | `/api/products/:id` | Delete product test | Yes |
| POST | `/api/products/seed` | Load research products | Yes |

**Authorization header format:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🧪 Testing the API with Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Click Thunder Client icon in sidebar
3. Test login:
   - Method: POST
   - URL: http://localhost:5000/api/auth/login
   - Body (JSON): `{ "email": "you@example.com", "password": "yourpassword" }`
4. Copy the token from response
5. For protected routes: Headers → `Authorization: Bearer <token>`

---

## 🗄️ View Data in MongoDB

### Option A: MongoDB Compass (GUI)
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse: sensor_db → users / sensorreadings / producttests

### Option B: VS Code MongoDB Extension
1. Install "MongoDB for VS Code" extension
2. Click MongoDB leaf icon in sidebar
3. Add connection: `mongodb://localhost:27017`
4. Browse collections directly in VS Code

### Option C: mongosh (Terminal)
```bash
mongosh
use sensor_db
db.users.find()
db.sensorreadings.find()
db.producttests.find()
```

---

## 🐛 Common Issues & Fixes

### "MongoDB connection error"
```bash
# Start MongoDB manually:
# Windows (run as Admin):
net start MongoDB

# Mac:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

### "Port 3000 already in use"
```bash
# Kill the process on port 3000:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### "Port 5000 already in use"
Change `PORT=5001` in `server/.env` and update the proxy in `client/package.json`:
```json
"proxy": "http://localhost:5001"
```

### npm install errors
```bash
# Clear npm cache and retry:
npm cache clean --force
npm install
```

### CORS errors in browser
Make sure the server is running on port 5000 and `client/package.json` has:
```json
"proxy": "http://localhost:5000"
```

---

## 🔧 Running Both Servers Simultaneously in VS Code

**Option A — Two terminals (recommended for beginners)**
- Terminal 1: `cd server && npm run dev`
- Terminal 2: `cd client && npm start`

**Option B — Concurrently package (run both with one command)**

In the root `sensor-app/` folder:
```bash
npm init -y
npm install concurrently
```

Add to root `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"cd client && npm start\""
  }
}
```

Then just run: `npm run dev` from the root.

---

## 📊 Dashboard Features

| Section | Features |
|---------|----------|
| **Overview** | 4 metric cards, sensitivity bar chart, LoD line chart, product doughnut chart, absorption peak reference |
| **Sensor Data** | Full data table with all readings, delete functionality |
| **Products** | Product test results table with delta error highlighting |
| **Add Reading** | Forms to add new sensor readings and product tests |
| **Seed Data** | One-click load of all research paper data |

---

## 🚢 Production Deployment

### Backend (Render / Railway / Heroku)
1. Push code to GitHub
2. Connect repo to Render.com
3. Set environment variables (PORT, MONGO_URI, JWT_SECRET)
4. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

### Frontend (Vercel / Netlify)
```bash
cd client
npm run build
# Deploy the /build folder to Vercel or Netlify
```

Update `REACT_APP_API_URL` to your deployed backend URL.

---

## 📄 Research Paper Reference

> You, T., Zhao, Y., Xu, Y., Guo, H., Zhu, J., Tao, H., Zhang, X., & Xu, Y. (2024).
> **An Infrared Evanescent Wave Sensor for Detection of Ascorbic Acid in Food and Drugs.**
> *Journal of Lightwave Technology*, 42(9), 3494–3500.
> DOI: 10.1109/JLT.2024.3357491

---

*Built with React 18 · Node.js · Express · MongoDB · Chart.js*
