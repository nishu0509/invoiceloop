# Architecture

## Data Model

User
- _id
- name
- email        (unique)
- password     (hashed)
- role
- createdAt

Invoice
- _id
- user          (ref -> User._id, owner of this invoice)
- clientName
- clientEmail
- amount
- status         (Paid | Pending | Unpaid)
- dueDate
- createdAt

Each Invoice belongs to exactly one User (the freelancer who created it). Every invoice route on
the backend checks the JWT-authenticated user's ID against the invoice's user field before allowing
a read or write, so one user can never see or modify another user's invoices.

## Auth & Authorization

1. Register - password is hashed before being stored; a JWT is not issued until the user then logs in.
2. Login - email + password are verified against the stored hash. On success, the backend signs a
   JWT (generateToken) containing the user's ID and returns it to the client.
3. Client storage - the frontend stores the JWT in localStorage and attaches it as an
   Authorization: Bearer token header on every subsequent API request.
4. Protected routes - an Express middleware verifies the JWT on every invoice route and populates
   req.user; requests without a valid token receive a 401. The frontend also redirects to / if no
   token is present, and clears the stored token and redirects on a 401 response.

## Key Decisions & Trade-offs

- JWT in localStorage vs. httpOnly cookie: localStorage was used for simplicity during the trial
  timebox. A production version should move to an httpOnly, Secure cookie to reduce XSS token-theft risk.
- Environment-driven API URL: the frontend reads the backend URL from VITE_API_URL rather than
  hardcoding it, so the same build works against localhost, a Render staging backend, or production
  without code changes - only a Vercel environment variable change and redeploy.
- Separate deploys: frontend (Vercel) and backend (Render) are deployed independently, which requires
  explicit CORS configuration on the backend to allow the frontend's origin.