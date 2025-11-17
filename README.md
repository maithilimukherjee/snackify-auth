# snackify-auth

## backstory — why this API exists

i’m a coder who also loves to cook. one evening, i stood in front of my fridge with zero ideas for what to make. i wished some app would just suggest recipes based on what i had.  
my tech-girly brain was like, “um, you can code that yourself.” and i did. customizing my own tool felt cooler than using whatever’s already out there, plus i got to flex both my backend skills and my love for food. 
so here's my very own api that i coded from scratch. presenting to you, **snackify-auth**.
---

## about the project

**snackify-auth** is a Node.js API for secure user authentication, complete with:

1. user **registration** & **login** (passwords are securely hashed)
2. **2-factor authentication (2FA)** via email to keep your logins super safe
3. **JWT** tokens for session management and route protection
4. a **profile route** accessible only with a valid token
5. a **recipe recommendation engine** that pops out recipes based on your ingredients and dietary preferences

---

## skills demonstrated

through building this API, you’ll see:

- **backend development:** Node.js, Express, PostgreSQL, Neon DB for user and recipe data
- **authentication & security:** bcrypt password hashing, 2FA, JWT-based route protection
- **email integration:** real-time 2FA via nodemailer
- **api design:** registration, login, verification, profile, and recommendations endpoints
- **algorithmic Thinking:** matching recipes based on user input, preference, and healthiness
- **config management:** all sensitive creds managed via `.env`
- **error handling:** neat responses for expired codes, invalid input, and unauthorized requests

---

## technologies & tools

- **backend:** Node.js, Express.js, PostgreSQL, Neon DB  
- **authentication:** bcrypt, JWT, nodemailer for 2FA  
- **utilities:** uuid, dotenv  
- **data:** JavaScript (in-memory recipes), PostgreSQL  
- **testing:** Postman, curl  
- **version control:** Git & GitHub  

---

## endpoints & usage

### 1. register

`POST /api/auth/register`

#### body:
```json
{
  "name": "tina",
  "email": "tina@example.com",
  "password": "strongpassword",
  "food_pref": "veg"
}
```

#### response:
```json
{
  "message": "user registered successfully"
}
```

---

### 2. login

`POST /api/auth/login`

#### body:
```json
{
  "email": "tina@example.com",
  "password": "strongpassword"
}
```

#### response:
```json
{
  "message": "2FA code sent to your email"
}
```

_2FA code is sent via email_

---

### 3. verify 2FA

`POST /api/auth/verify2fa`

#### body:
```json
{
  "email": "tina@example.com",
  "code": "123456"
}
```

#### response:
```json
{
  "message": "2FA verification successful",
  "token": "<jwt-token>"
}
```

_use this JWT token to access protected routes._

---

### 4. get profile

`GET /api/auth/profile`

#### headers:
```
Authorization: Bearer <jwt-token>
```

#### response:
```json
{
  "id": "user-uuid",
  "name": "tina",
  "email": "tina@example.com",
  "food_pref": "veg"
}
```

---

### 5. recommend recipes

`POST /api/recommend`

#### body:
```json
{
  "ingredients": ["rice", "garlic"],
  "preference": "non-veg"
}
```

#### response:
```json
[
  {
    "name": "chicken fried rice",
    "ingredients": ["rice", "chicken", "onion", "garlic", "soy sauce", "carrot"],
    "healthy": true,
    "type": "non-veg",
    "score": 2
  }
  // ...top 3 best matches returned
]
```

_filters for food preference and matches recipes using your provided ingredients._

---

## setup & running

1. **clone the repo**
   ```bash
   git clone <repo-url>
   ```

2. **install dependencies**
   ```bash
   npm install
   ```

3. **make a `.env` file:**
   ```
   DATABASE_URL=your-neon-db-url
   MAIL_HOST=smtp.ethereal.email
   MAIL_PORT=587
   MAIL_USER=your-ethereal-user
   MAIL_PASS=your-ethereal-pass
   MAIL_FROM="snackify <your-email>"
   JWT_SECRET=supersecretkey
   JWT_EXPIRES=1d
   ```

4. **run the server**
   ```bash
   npm run dev
   ```
   or

   ```bash
   node src/server.js
   ```

5. **test with Postman, curl, or your own frontend**

---

## closing thoughts

this project is my mashup of two things i love: coding & cooking.  
it’s secure, practical and proof that backend skills, security best-practices, and a little personal flavor can combine into something both useful *and* fun.