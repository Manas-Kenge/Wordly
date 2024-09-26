import { createContext, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    const [editDetails, setEditDetails] = useState<string>(currentUser?.details);
    const [editName, setEditName] = useState<string>(currentUser?.username);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("name", editName);
        formData.append("detail", editDetails);
    };

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
                        <Card className="overflow-hidden h-full">
                            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
                            <CardContent className="-mt-16 flex flex-col items-center space-y-4 p-6">
                                <div className="rounded-full h-24 w-24 bg-gray-200 flex justify-center items-center">
                                    <span className="text-3xl text-gray-500">{currentUser.username}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-center">
                                    {currentUser.username}
                                </h2>
                                <p className="text-center text-muted-foreground">
                                    {currentUser.details}
                                </p>
                                {/* <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>San Francisco, CA</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <span>Joined March 2020</span>
                                </div> */}
                            </CardContent>
                        </Card>

                        {/* Tabs for Home and About */}
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
                            <Card className="h-full flex flex-col">
                                <Tabs defaultValue="home" className="flex-grow flex flex-col">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="home">Home</TabsTrigger>
                                        <TabsTrigger value="about">About</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="home" className="flex-grow flex flex-col">
                                        <Card className="flex-grow flex flex-col border-0 shadow-none">
                                            <CardHeader>
                                                <CardTitle>Home</CardTitle>
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
                                    </TabsContent>
                                    <TabsContent value="about" className="flex-grow flex flex-col">
                                        <Card className="flex-grow flex flex-col border-0 shadow-none">
                                            <CardHeader>
                                                <CardTitle>About</CardTitle>
                                                <CardDescription>
                                                    Update your name and bio below.
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-2 flex-grow">
                                                <div className="space-y-1">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        placeholder={currentUser.username}
                                                        onChange={(event) => {
                                                            setEditName(event.target.value);
                                                        }}
                                                        value={editName}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="bio">Bio</Label>
                                                    <Input
                                                        id="new"
                                                        placeholder={currentUser.details}
                                                        value={editDetails}
                                                        onChange={(event) => {
                                                            setEditDetails(event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button onClick={handleSubmit} className="mr-2">
                                                    {editingDetails ? (
                                                        <Spinner />
                                                    ) : (
                                                        <div>Save</div>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setEditDetails(currentUser.details);
                                                        setEditName(currentUser.name);
                                                    }}
                                                >
                                                    {editingDetails ? <Spinner /> : <div>Cancel</div>}
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </Card>
                        </UserProfileContext.Provider>
                    </div>
                </div>
            )}
        </>
    );
}
