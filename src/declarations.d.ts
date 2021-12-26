export interface About extends Object {
  portrait?: string;
  statement?: string;
  resume?: string;
}
export interface APIError extends Object {
  code: number;
  message: string;
}

export interface Photo extends Object {
  filename: string;
}

export interface Project extends Object {
  name: string;
  title: string;
  caption: string;
  projectInfo: string;
  thumbnail?: string | undefined;
  videoKey?: string | undefined;
  images?: string[] | undefined;
}

export interface Login extends Object {
  username: string;
  password: string;
  remember: boolean;
}

export interface Session extends Object {
  valid: boolean;
}

export interface User extends Object {
  id: number;
  username: string;
  protected: boolean;
  createdAt: Date;
  lastLogin?: Date;
  sessions: number;
}
