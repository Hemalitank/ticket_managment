import * as jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbmFnZXJAZXhhbXBsZS5jb20iLCJzdWIiOjEsInJvbGUiOiJNQU5BR0VSIiwiaWF0IjoxNzcxOTE3NzAwLCJleHAiOjE3NzIwMDQxMDB9._EJgZUgly50nzBHV0K8R9fvBg';

const secret = 'supersecretkey';

try {
  const decoded = jwt.verify(token, secret);
  console.log('Decoded:', decoded);
} catch (err) {
  console.error('Error:', err.message);
}