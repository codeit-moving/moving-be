import { PORT } from "./env";
import cookieParser from "cookie-parser";
import express from "express";
import cors, { CorsOptions } from "cors";
import errorHandler from "./middlewares/errorHandler";
import authRouter from "./controllers/authController";
import serviceRouter from "./controllers/serviceController";
import moverRouter from "./controllers/moverController";
import movingRequestRouter from "./controllers/movingRequestController";
import regionRouter from "./controllers/regionController";
import quoteRouter from "./controllers/quoteController";
import oauthRouter from "./controllers/oauthController";
import passport from "./middlewares/passport";
import session from "express-session";

const app = express();

//CORS 설정
const allowedOrigins: string[] = ["http://localhost:3001"];
// CORS 설정
const corsOptions: CorsOptions = {
  credentials: true,
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, origin?: string) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // 허용
    } else {
      callback(new Error("Not allowed by CORS")); // 허용하지 않음
    }
  },
  exposedHeaders: ["set-cookie"],
};

// Express app에 CORS 적용
app.use(cors(corsOptions));

//미들웨어
app.use(express.json()); //json parse
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//라우터 모음 -> 컨트롤러
app.use("/services", serviceRouter);
app.use("/regions", regionRouter);
app.use("/movers", moverRouter);
app.use("/moving-requests", movingRequestRouter);
app.use("/quotes", quoteRouter);

app.use("/auth", authRouter);
app.use("/oauth", oauthRouter);

app.use(errorHandler); //전체 에러 핸들링 미들웨어

app.listen(PORT || 3000, () => console.log("Server Started"));
