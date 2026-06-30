# EasyMeet

## Overview

EasyMeet is an interactive, frontend-based calendar styling and appointment booking web application. It simplifies schedule management by allowing users to browse available time slots, book appointments, receive smart scheduling recommendations, and manage bookings through an intuitive interface. The application also includes a dedicated administrative dashboard for monitoring appointments and viewing booking history.

---

## Features

-  **User Authentication**
  - Structured login interface with user credential validation.
    
-  **Dynamic Appointment Booking**
  - Interactive calendar for browsing and selecting available time slots.
  - Real-time slot validation to prevent duplicate bookings.

-  **Admin Dashboard**
  - Manage appointments.
  - View booking history.
  - Monitor overall scheduling activities.

-  **Smart Slot Recommendations**
  - Suggests suitable appointment times based on availability.

-  **Responsive UI**
  - Fully responsive design for desktop, tablet, and mobile devices.

-  **Dark Mode**
  - Built-in Light/Dark theme toggle.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Responsive Design |
| JavaScript (ES6+) | Application Logic |
| PNG / JPG | UI Assets |

---

## Project Structure

```text
EasyMeet/
│
├── admin.html          # Admin dashboard
├── admin.js            # Appointment management logic
├── auth.js             # Authentication handling
├── booking.html        # Appointment booking page
├── booking.js          # Booking validation and submission
├── calender.js         # Interactive calendar generation
├── confirmation.html   # Booking success page
├── darkmode.js         # Dark mode functionality
├── EasyMeet1.jpg       # UI asset
├── EasyMeet2.jpg       # UI asset
├── EasyMeet3.png       # Icons/UI graphics
├── history.html        # Booking history page
├── history.js          # History management
├── index.html          # Landing page
├── login.html          # Login page
├── main.js             # Main application entry
├── search.js           # Search available slots
├── slots.js            # Slot management
├── smart.js            # Smart recommendation system
├── style.css           # Stylesheet
├── style.js            # Dynamic styling
└── ui.js               # UI interaction handling
```

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/shlokasharma/EasyMeet.git
```

### 2. Navigate to the Project Folder

```bash
cd EasyMeet
```

### 3. Run the Application

Simply open **index.html** in your preferred web browser.

---

## How It Works

###  Landing Page

Opening `index.html` initializes the application through `main.js` and loads the UI components using `ui.js`.

###  Authentication

Users sign in through `login.html`, while `auth.js` validates user credentials.

###  Search & Booking

- Search available appointment slots.
- Browse the interactive calendar.
- Receive smart scheduling suggestions.
- Book an available time slot.

Core files involved:

- `search.js`
- `calender.js`
- `slots.js`
- `smart.js`

###  Booking Confirmation

After successful validation by `booking.js`, users are redirected to `confirmation.html`.

###  Admin Dashboard

Administrators can:

- View all bookings
- Monitor appointment history
- Manage scheduling

Files:

- `admin.html`
- `admin.js`
- `history.js`

---

## Future Improvements

- [ ] Add real-time database integration for appointment synchronization.
- [ ] Implement OAuth2 authentication.
- [ ] Integrate Google Calendar support.
- [ ] Integrate Microsoft Outlook Calendar support.
- [ ] Add automated Email notifications.
- [ ] Add SMS reminders using external APIs.
- [ ] Improve appointment recommendation algorithm.
- [ ] Enable multi-user scheduling.

---

## Author

Shloka Sharma

---
