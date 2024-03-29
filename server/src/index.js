// Import necessary modules
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import jwt from "jsonwebtoken";
import { corsOptions } from "./config/cors.js";
import { envs } from "./config/env.js";
import { ApolloServer } from "@apollo/server";
import { typeDefs, resolvers } from "./graphql/schema.js";
import { expressMiddleware } from "@apollo/server/express4";
import { getReqToken } from "./utils/get-req-token.js";
import { db } from "./db/index.js";
import {
  COMPANY_AUTH_ROUTES,
  COMPANY_MEMBER_ROUTES,
} from "./graphql/config.js";
import { removeImage, uploadImage } from "./lib/cloudinary.js";

const app = express(); // Create an instance of the Express application.

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads/",
  })
);

// Routes
app.post("/files/upload", async function (req, res) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    // Accessing the file
    const file = req.files.file;

    const result = await uploadImage(file.tempFilePath);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

app.delete("/files/remove", async function (req, res) {
  const { public_id } = req.query;

  if (!public_id) return res.status(400).json({ msg: "Public Id required" });

  await removeImage(public_id);

  res.json({ msg: "success" });
});

// Start the server
app.listen(envs.PORT, () => {
  console.log(`🚀 Server on port ${envs.PORT}`);
});

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/gql",
    express.json(),
    cors(corsOptions),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = getReqToken(req);

        if (
          !token ||
          token.startsWith("null") ||
          token.startsWith("undefined")
        ) {
          return {
            req,
            user: null,
          };
        }

        const data = jwt.verify(token, envs.JWT_SECRET);
        const user = await db.user.findUnique({ where: { id: data.id } });

        let isAdmin = false;
        let isCompanyMember = false;
        let company = null;

        if (COMPANY_AUTH_ROUTES.includes(req.body.operationName) && user) {
          const { companyId, companyUrl } = req.body.variables;

          try {
            if (companyId || companyUrl) {
              const companyCtx = await db.company.findFirstOrThrow({
                where: {
                  id: companyId ?? undefined,
                  url: companyUrl ?? undefined,
                  users: {
                    some: {
                      userId: user.id,
                      role: "Admin",
                    },
                  },
                },
              });

              if (companyCtx) {
                isAdmin = true;
                company = companyCtx;
              }
            }
          } catch (error) {
            isAdmin = false;
            company = null;
          }
        }

        if (COMPANY_MEMBER_ROUTES.includes(req.body.operationName) && user) {
          const { companyUrl } = req.body.variables;

          try {
            if (companyUrl) {
              const companyCtx = await db.company.findFirstOrThrow({
                where: {
                  url: companyUrl,
                  users: {
                    some: {
                      userId: user.id,
                    },
                  },
                },
              });

              if (companyCtx) {
                isCompanyMember = true;
                company = companyCtx;
              }
            }
          } catch (error) {
            isCompanyMember = false;
            company = null;
          }
        }

        return { req, user, isAdmin, isCompanyMember, company };
      },
    })
  );
};

(async () => {
  main();
})();

/**
 * REFERENCES:
 * https://www.apollographql.com/docs/apollo-server/data/context
 */
