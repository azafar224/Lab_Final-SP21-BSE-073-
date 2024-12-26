Library Management System

Features:
- Manage books, authors, and borrowers with CRUD operations.
- Special constraints for:
  - Books: Max 100 copies if borrowed more than 10 times.
  - Authors: Limit of 5 books per author.
  - Borrowers: Borrowing limits based on membership type (Standard: 5, Premium: 10).
- Borrowing/returning mechanisms:
  - Updates available copies and borrower records.
  - Prevents borrowing if no copies are available or if the borrower exceeds their limit.
- Business rules:
  - Prevents borrowing if a borrower has overdue books.
  - Provides a list of authors linked to more than 5 books.
- Validation for unique ISBN, valid email/phone numbers, and borrowing constraints.
- Organized by models, controllers, and routes for modularity.

Testing:
- Test data included for authors, books, and borrowers.
- Postman collection can be created to verify API endpoints.
