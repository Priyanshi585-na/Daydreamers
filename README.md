# 📚 Daydreamers

### A Student-Centric Book Exchange Platform

Daydreamers is a web-based book exchange platform designed specifically for college students. It provides a simple and centralized way for students to **lend, borrow, buy, and exchange books within their campus community**.

The platform aims to make academic and recreational books more accessible while encouraging students to reuse existing resources rather than purchasing new copies unnecessarily.

---

## 📌 Project Proposal

### 1. Project Description

Students often own books that they no longer use while other students on the same campus may be looking for those exact books. Existing online marketplaces are generally designed for large-scale buying and selling and do not specifically address the needs of a college community.

**Daydreamers** proposes a campus-oriented platform where students can list books they own and allow other students to discover and request them.

The platform will provide features for:

- Searching for books using the Open Library API
- Listing books for lending or selling
- Browsing books listed by other students
- Contacting book owners
- Managing personal listings
- Managing borrowing/lending requests
- Tracking the status of books and requests

The application will use JavaScript extensively for dynamic interactions, API communication, asynchronous operations, browser storage, DOM manipulation, and background processing.

---

# 🎯 2. Goals and Objectives

The primary goal of Daydreamers is to create an easy-to-use platform for student-to-student book exchange.

### Objectives

1. Provide a centralized platform for students to discover available books.
2. Allow students to list books they want to lend or sell.
3. Allow users to search for books using an external book API.
4. Provide book information such as title, author, and cover image.
5. Facilitate communication between borrowers and book owners.
6. Allow users to manage their own book listings.
7. Track lending and exchange requests.
8. Reduce unnecessary expenditure on new books.
9. Encourage reuse and sharing of books within the campus.
10. Demonstrate practical implementation of modern JavaScript concepts and Web APIs.

---

# 💡 3. Problem Statement

College students frequently face difficulty finding affordable textbooks, reference books, and novels.

At the same time, many students already possess books that are no longer being used.

The absence of a dedicated campus-level platform creates a gap between students who **have books** and students who **need books**.

Daydreamers aims to solve this problem by providing a digital platform where students can easily discover, list, and exchange books within their campus community.

---

# 🚀 4. Proposed Solution

Daydreamers will provide a web-based interface through which students can:

```text
Search for a Book
        ↓
View Book Information
        ↓
List / Borrow / Buy
        ↓
Connect with Student
        ↓
Exchange Book
        ↓
Update Book Status
```

The platform will combine locally stored user and listing information with external book metadata obtained through the **Open Library API**.

---

# ✨ 5. Key Features

## 5.1 Book Search

Users can search for books using title, author, or keywords.

The application will retrieve book information from the Open Library API and display:

- Book title
- Author
- Cover image
- ISBN
- Open Library identifier

## 5.2 Book Listing

Students can list books they own.

A listing can contain:

- Book title
- Author
- Book condition
- Exchange type
- Price
- Description
- Owner information
- Contact information
- Book cover

Books can be listed for:

- Lending
- Selling

## 5.3 Campus Book Shelf

The home page will display books currently available within the campus.

Users can browse available books without having to search for a specific title.

## 5.4 My Listings

Users will have a dedicated section containing the books they have listed.

Users can:

- View their listings
- Edit listing information
- Mark a book as handed over
- Delete a listing
- View listing status

## 5.5 Borrowing and Exchange

Users can interact with available listings and contact the book owner.

The system will support a request-based exchange workflow:

```text
Available
    ↓
Request Sent
    ↓
Request Accepted
    ↓
Book Handed Over
```

## 5.6 User Authentication

The system will provide user authentication so that students can:

- Create an account
- Log in
- Access their listings
- Manage their requests
- Maintain their profile

## 5.7 Book Cover Integration

Book cover images will be obtained from Open Library using the book's cover identifier.

If a cover is unavailable, the system will display a fallback image.

## 5.8 Notifications and Status Updates

Users will be able to receive updates regarding:

- New borrowing requests
- Accepted requests
- Rejected requests
- Book status changes

---

# ⚙️ 6. Functional Specifications

### User Management

- User registration
- User login/logout
- User session management
- Profile information

### Book Management

- Search books
- View book details
- Add books
- Update listings
- Delete listings
- Mark books as unavailable

### Exchange Management

- Send borrowing requests
- Accept/reject requests
- Track request status
- Mark books as handed over

### Search and Filtering

Users will be able to:

- Search by title
- Search by author
- Filter by availability
- Filter by lending/selling
- Filter by condition
- Sort available books

### Communication

The system will provide a mechanism for students to contact book owners regarding available books.

---

# 🧩 7. Non-Functional Specifications

### Performance

The application should provide responsive interactions and avoid unnecessary API requests.

### Usability

The interface should be simple enough for students to discover and exchange books with minimal steps.

### Reliability

API failures, unavailable books, invalid inputs, and network errors should be handled gracefully.

### Security

User input should be validated and dynamically generated content should be appropriately escaped.

### Scalability

The application architecture should allow additional features and users to be added without requiring major changes to the frontend.

### Maintainability

JavaScript functionality will be divided into independent modules based on responsibility.

---

# 🛠️ 8. Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

## APIs

- Open Library API
- Fetch API

## Browser APIs

- DOM API
- Local Storage API
- Session Storage API
- Web Workers
- URL API

## Backend

- RESTful API
- Node.js
- Express.js

## Database

A database will be used for persistent storage of:

- Users
- Books
- Listings
- Borrowing requests

---

# 🧠 9. JavaScript Concepts Demonstrated

Daydreamers will make practical use of modern JavaScript concepts.

### Core JavaScript

- Variables and constants
- Functions
- Arrow functions
- Objects
- Arrays
- Template literals
- Destructuring
- Spread and rest operators
- Optional chaining
- Nullish coalescing

### Array Operations

- `map()`
- `filter()`
- `find()`
- `some()`
- `every()`
- `reduce()`

### Asynchronous JavaScript

- Callbacks
- Promises
- Promise chaining
- `async/await`
- `Promise.all()`
- Error handling

### Web APIs

- Fetch API
- DOM API
- Local Storage
- Session Storage
- URL and URLSearchParams
- Web Workers

### Performance

- Debouncing
- Request cancellation using `AbortController`
- Background processing using Web Workers

### Modules

The JavaScript code will be organized using ES Modules:

```text
js/
├── app.js
├── api.js
├── auth.js
├── books.js
├── listings.js
├── requests.js
├── storage.js
├── utils.js
└── workers/
    └── bookWorker.js
```

---

# 🏗️ 10. System Architecture

```text
                    ┌──────────────────┐
                    │      Student     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    Daydreamers   │
                    │    Frontend      │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
         Book API       REST API       Browser APIs
              │              │              │
              ▼              ▼              ▼
       Open Library       Backend       Local Storage
                             │
                             ▼
                         Database
```

---

# 🔄 11. Book Search Flow

```text
User enters search query
          ↓
Search input
          ↓
Debounce search request
          ↓
Fetch API
          ↓
Open Library API
          ↓
JSON response
          ↓
Process book data
          ↓
Render book cards
          ↓
User selects a book
          ↓
Book details displayed
```

---

# 📖 12. Book Listing Flow

```text
Student selects "List a Book"
          ↓
Search for book
          ↓
Select book
          ↓
Enter listing details
          ↓
Validate form
          ↓
Create listing
          ↓
Store listing
          ↓
Display on campus shelf
```

---

# 🤝 13. Borrowing Flow

```text
Student discovers book
          ↓
View listing
          ↓
Contact / Request book
          ↓
Owner receives request
          ↓
Owner accepts request
          ↓
Book status updated
          ↓
Book handed over
          ↓
Listing marked unavailable
```

---

# 📁 14. Proposed Project Structure

```text
Daydreamers/
│
├── index.html
├── pages/
│   ├── login.html
│   ├── signup.html
│   ├── listings.html
│   └── profile.html
│
├── css/
│   ├── style.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── api.js
│   ├── auth.js
│   ├── books.js
│   ├── listings.js
│   ├── requests.js
│   ├── storage.js
│   ├── utils.js
│   └── workers/
│       └── bookWorker.js
│
└── README.md
```

---

# 📊 15. Expected Outcome

The expected outcome of the project is a functional campus-oriented book exchange platform through which students can efficiently discover, list, and exchange books.

The project will also demonstrate the practical application of:

- Client-side web development
- REST APIs
- Asynchronous JavaScript
- Browser APIs
- Modular JavaScript
- Dynamic DOM manipulation
- Data validation
- Client-server communication
- Background processing

---

# 🔮 16. Future Enhancements

Possible future improvements include:

- Recommendation system based on reading interests
- Book availability notifications
- Rating and review system
- Campus-specific communities
- Location-based book discovery
- Advanced recommendation algorithms
- Mobile application
- QR-based book exchange
- Analytics dashboard
- AI-powered book recommendations

---

# 🎯 17. Project Scope

The initial scope of Daydreamers focuses on enabling students to discover, list, lend, sell, and exchange books within a campus community.

The system is designed to provide a lightweight alternative to conventional online marketplaces by focusing specifically on **student-to-student book exchange**.

---

## 👥 Target Users

The primary users of Daydreamers are:

- College students
- University students
- Student clubs and communities
- Campus libraries and book-sharing groups

---

## 📜 Conclusion

Daydreamers aims to transform unused books within a student community into accessible resources for other students.

By combining a simple user interface, external book metadata, dynamic JavaScript functionality, and a structured exchange system, the project provides a practical solution for campus-level book sharing while demonstrating modern web development concepts.
