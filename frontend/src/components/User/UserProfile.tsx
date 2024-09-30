import { createContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useUserBlogs } from "@/hooks/user";
import { Blog } from "@/hooks/index";
import { Spinner } from "../Spinner";
import { BlogCard } from "../BlogCard";

type UserProfileProps = {
    id: string;
};

type UserProfileContextType = {
    currentUser?: any;
    blogs?: Blog[];
    loadingUserBlogs?: boolean;
    editingDetails?: boolean;
    isAuthorizedUser?: boolean;
    editUserDetails?: (formData: any) => void;
};

const UserProfileContext = createContext<UserProfileContextType>({});

export function UserProfile({ id }: UserProfileProps) {
    const {
        currentUser,
        loading: loadingUser,
        isAuthorizedUser,
        editingDetails,
        editUserDetails,
        error,
    } = useUser(id);
    const { blogs, loading: loadingUserBlogs } = useUserBlogs(id);

    return (
        <>
            {loadingUser ? (
                <div className="w-screen h-screen flex justify-center items-center">
                    <Spinner />
                </div>
            ) : error ? (
                <div className="mt-7 flex justify-center text-3xl">User not found</div>
            ) : (
                <div className="container mx-auto p-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <UserProfileContext.Provider
                            value={{
                                currentUser,
                                isAuthorizedUser,
                                blogs,
                                loadingUserBlogs,
                                editingDetails,
                                editUserDetails,
                            }}
                        >
                            <Card className="overflow-hidden h-full">
                            <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-700" />
                            <CardContent className="-mt-16 flex flex-col items-center space-y-4 p-6">
                                <div className="rounded-full h-24 w-24 bg-gray-200 flex justify-center items-center">
                                    <span className="text-3xl text-gray-500">{currentUser.username}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-center">
                                    {currentUser.username}
                                </h2>
                                <p className="text-center text-muted-foreground">
                                    {currentUser?.details}
                                </p>
                            </CardContent>
                        </Card>
                            <Card className="flex-grow flex flex-col border-0 shadow-none">
                                <CardHeader>
                                    <CardTitle className="text-3xl">Home</CardTitle>
                                    <CardDescription>
                                        See your written blogs below or write a new one.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2 flex-grow overflow-y-auto overflow-x-hidden">
                                    {blogs && blogs.length > 0 ? (
                                        blogs.map((blog: any) => (
                                            <BlogCard
                                                key={blog?.id}
                                                id={blog?.id}
                                                authorName={blog?.authorName}
                                                publishedDate={blog?.publishedDate}
                                                title={blog.title}
                                                content={blog.content}
                                            />
                                        ))
                                    ) : (
                                        <p>You haven't written any blogs yet.</p>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Link to="/publish">
                                        <Button>Write a new blog</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </UserProfileContext.Provider>
                    </div>
                </div>
            )}
        </>
    );
}