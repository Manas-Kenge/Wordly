import { Prisma } from "@prisma/client";

interface BlogQueryBase {
	select: {
		content?: boolean;
		title?: boolean;
		id?: boolean;
		publishedDate?: boolean;
		author?: { select: { username: boolean, email?: boolean, details?: boolean } };
		published?: boolean;
	};
	orderBy?: Prisma.Enumerable<Prisma.BlogOrderByWithRelationInput>;
}

interface UserQueryBase {
    select: {
        username: boolean;
        id: boolean;
        email: boolean;
    };
    where?: Prisma.UserWhereInput;  
    skip?: number;
    take?: number;
    orderBy?: Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>;  
}


interface BlogQueryWithWhere extends BlogQueryBase {
    where?: { authorId?: string};
    skip?: number;
    take?: number;
}

interface SearchQueryWithWhere extends BlogQueryBase {
    where?: any;
    skip?: number;
    take?: number;
}

export const buildQuery = (
    userId: string | undefined
): BlogQueryWithWhere => {
    let baseQuery: BlogQueryWithWhere = {
        select: {
            content: true,
            title: true,
            id: true,
            publishedDate: true,
            author: { select: { username: true, details: true, email: true } },
            published: true,
        },
        orderBy: [
            {
                publishedDate: "desc",
            },
        ],
    };
    if (userId) {
        baseQuery = { ...baseQuery, where: { ...baseQuery.where, authorId: userId } };
    }
    return baseQuery;
};

export const buildBlogSearchQuery = (keyword: string): SearchQueryWithWhere => {
    let baseQuery: SearchQueryWithWhere = {
        select: {
            title: true,
            id: true,
            publishedDate: true,
            author: { select: { username: true, details: true, email: true } },
        },
        orderBy: [
            {
                publishedDate: "desc",
            },
        ],
        where: {
            OR: [
                {
                    title: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    content: {
                        contains: keyword,
                        mode: "insensitive",
                    },
                },
                {
                    author: {
                        name: {
                            contains: keyword,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        },
        skip: 0,
        take: 5,
    };

    return baseQuery;
};

export const buildUserSearchQuery = (keyword: string): UserQueryBase => {
    let baseQuery: UserQueryBase = {
        select: {
            id: true,
            username: true,
            email: true,
        },
        where: {
            username: {
                contains: keyword,
                mode: "insensitive",
            },
        },
        skip: 0,
        take: 5,
    };

    return baseQuery;
};
