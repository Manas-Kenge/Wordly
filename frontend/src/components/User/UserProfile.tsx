import { createContext } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom";
import { useUser, useUserBlogs } from "@/hooks/user";
import { Spinner } from "../Spinner";
import { Blog } from "@/hooks/index"

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
    const { currentUser, loading: loadingUser, isAuthorizedUser, editingDetails, editUserDetails, error } = useUser(id);
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
                    <div className="flex justify-center items-center min-h-screen">
                        <Tabs defaultValue="home" className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="home">Home</TabsTrigger>
                                <TabsTrigger value="about">About</TabsTrigger>
                            </TabsList>
                            <TabsContent value="home">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Home</CardTitle>
                                        <CardDescription>
                                            See your written blogs below or write a new one.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {blogs && blogs.length > 0 ? (
                                            blogs.map((blog: any) => (
                                                <div key={blog.id} className="p-2 border-b">
                                                    <h2 className="text-xl font-bold">{blog.title}</h2>
                                                    <p>{blog.content}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>You haven't written any blogs yet.</p>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <Link to="/publish">
                                            <Button>Write your first blog</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                            <TabsContent value="about">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About</CardTitle>
                                        <CardDescription>
                                            Update your name and bio below.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="name">Name</Label>
                                            <Input id="name" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="bio">Bio</Label>
                                            <Input id="new" />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button>Save</Button>
                                        <Button variant="outline">Cancel</Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </UserProfileContext.Provider>
            )}
        </>
    )
}
