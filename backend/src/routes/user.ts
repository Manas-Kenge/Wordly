import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import { signupInput, signinInput } from "@manaskng/medium-common";

export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    };
    Variables: {
        userId: string;
    };
}>();

userRouter.post('/signup', async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const user = await prisma.user.findFirst({
            where: {
                email: body.email,
            },
        });
        if (user) {
            c.status(409);
            return c.json({ error: "User with the email already exists" });
        }
        const newUser = await prisma.user.create({
            data: {
                email: body.email,
                username: body.username,
                password: body.password,
            }
        })
        const jwt = await sign({
            id: newUser.id
        }, c.env.JWT_SECRET);

        return c.text(jwt)
        // const token = await sign({ id: newUser.id }, c.env.JWT_SECRET);
        // c.status(200);
        // return c.json({
        //     message: "Sign up successful",
        //     jwt: token,
        //     user: newUser,
        // });
    } catch (e) {
        console.log(e);
        c.status(411);
        return c.text('Invalid')
    }
})

userRouter.post('/signin', async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        })
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
                password: body.password,
            }
        })
        if (!user) {
            c.status(403);
            return c.json({
                message: "Incorrect credentials"
            })
        }
        // const token = await sign({ id: user.id }, c.env.JWT_SECRET);
        // return c.json({
        //     jwt: token,
        //     user: user,
        //     message: "Sign in successful",
        // });
        const jwt = await sign({
            id: user.id,
            user: user.username
        }, c.env.JWT_SECRET);

        return c.text(jwt)
    } catch (e) {
        console.log(e);
        c.status(411);
        return c.text('Invalid')
    }
})

userRouter.get("/:id", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.req.param("id");
    const authorizedUserId = c.get("userId");
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: (userId),
            },
        });

        if (!user) {
            c.status(400);
            return c.json({ error: "User does not exist" });
        }
        return c.json({
            user,
            isAuthorizedUser: authorizedUserId === userId,
            message: "Found user",
        });
    } catch (ex) {
        return c.status(403);
    }
});

userRouter.get("/", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const users = await prisma.user.findMany();
        return c.json({
            payload: users,
            message: "All users",
        });
    } catch (ex) {
        return c.status(403);
    }
});

userRouter.post("/updateDetail", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get("userId");
    const body = await c.req.json();
    try {
        const user = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username: body.username,
                details: body.details,
            },
        });
        return c.json({
            user,
            message: "User details updated",
        });
    } catch (ex) {
        return c.status(403);
    }
});