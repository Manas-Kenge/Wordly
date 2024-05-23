import { createBlogInput, updateBlogInput } from "@manaskng/medium-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

bookRouter.use('/*', async (c, next) => {
    const authHeader = c.req.header('Authorization') || '';
    try {
        const user = await verify(authHeader, c.env.JWT_SECRET);
        if (user) {
            c.set("userId", user.id);
            await next();
        }
        else {
            c.status(403);
            return c.json({ message: "You are not logged in" });
        }
    }
    catch (e) {
        c.status(403);
        return c.json({ message: "You are not logged in" });
    }

    // const jwt = c.req.header('Authorization');
    // if (!jwt) {
    // 	c.status(401);
    // 	return c.json({ error: "unauthorized" });
    // }
    // const token = jwt.split(' ')[1];
    // const payload = await verify(token, c.env.JWT_SECRET);
    // if (!payload) {
    // 	c.status(401);
    // 	return c.json({ error: "unauthorized" });
    // }
    // c.set('userId', payload.id);
    // await next()
});

bookRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ message: "Input's incorrect" });
    }

    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: userId
        }
    });
    return c.json({
        id: post.id
    });
})

bookRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ message: "Input's incorrect" });
    }

    const userId = c.get('userId');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    prisma.post.update({
        where: {
            id: body.id,
            authorId: userId
        },
        data: {
            title: body.title,
            content: body.content
        }
    });

    return c.text('updated post');
});

bookRouter.get('/:id', async (c) => {
    const id = c.req.param('id');
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({
        where: {
            id
        }
    });

    return c.json(post);
}) 