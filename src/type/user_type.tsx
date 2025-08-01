export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: string;
  isEmailVerified: boolean;
  emailVerifiedDate: string | null;
}
