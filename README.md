# Daydreamers

### A Student-Centric Book Exchange Platform

Daydreamers is a web-based book exchange platform designed specifically for college students. It provides a simple and centralized way for students to **lend, borrow, buy, and exchange books within their campus community**.

The platform aims to make academic and recreational books more accessible while encouraging students to reuse existing resources rather than purchasing new copies unnecessarily.

---

## Project Proposal

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

### 2. Goals and Objectives

The primary goal of Daydreamers is to create an easy-to-use platform for student-to-student book exchange.

**Objectives**

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

### 3. Problem Statement

College students frequently face difficulty finding affordable textbooks, reference books, and novels.

At the same time, many students already possess books that are no longer being used.

The absence of a dedicated campus-level platform creates a gap between students who **have books** and students who **need books**.

Daydreamers aims to solve this problem by providing a digital platform where students can easily discover, list, and exchange books within their campus community.

---

### 4. Proposed Solution

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

### 5. Functional Specifications

**User Management**

- User registration
- User login/logout
- User session management
- Profile information

**Book Management**

- Search books
- View book details
- Add books
- Update listings
- Delete listings
- Mark books as unavailable

**Exchange Management**

- Send borrowing requests
- Accept/reject requests
- Track request status
- Mark books as handed over

**Search and Filtering**

Users will be able to:

- Search by title
- Search by author
- Filter by availability
- Filter by lending/selling
- Filter by condition
- Sort available books

**Communication**

The system will provide a mechanism for students to contact book owners regarding available books.

---

### 6. Non-Functional Specifications

**Performance**

The application should provide responsive interactions and avoid unnecessary API requests.

**Usability**

The interface should be simple enough for students to discover and exchange books with minimal steps.

**Reliability**

API failures, unavailable books, invalid inputs, and network errors should be handled gracefully.

**Security**

User input should be validated and dynamically generated content should be appropriately escaped.

**Scalability**

The application architecture should allow additional features and users to be added without requiring major changes to the frontend.

**Maintainability**

JavaScript functionality will be divided into independent modules based on responsibility.

---

### 7. Technology Stack

**Frontend**

- HTML5
- CSS3
- JavaScript (ES6+)

**APIs**

- Open Library API
- Fetch API

**Browser APIs**

- DOM API
- Local Storage API
- Session Storage API
- Web Workers
- URL API

**Backend**

- RESTful API
- Node.js

**Database**

A database will be used for persistent storage of:

- Users
- Books
- Listings
- Borrowing requests

---

### 8. System Architecture

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

### 9. Book Search Flow

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

### 10. Book Listing Flow

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

### 11. Borrowing Flow

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
