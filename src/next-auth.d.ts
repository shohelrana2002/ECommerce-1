// package edit
// step----4 auth
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }
}

export { module };
