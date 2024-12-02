interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge: number;
  domain: string;
  path: string;
}

const accessTokenOption: CookieOptions = {
  httpOnly: false,
  secure: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60,
  domain: "localhost",
  path: "/",
};

const refreshTokenOption: CookieOptions = {
  httpOnly: false,
  secure: false,
  sameSite: "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  domain: "localhost",
  path: "/",
};

const clearCookieOption: CookieOptions = {
  httpOnly: false,
  secure: false,
  sameSite: "lax",
  maxAge: 0,
  domain: "localhost",
  path: "/",
};

export default { accessTokenOption, refreshTokenOption, clearCookieOption };
