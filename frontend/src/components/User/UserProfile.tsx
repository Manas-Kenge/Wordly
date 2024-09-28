import { createContext, useState, FormEvent, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "@/components/ui/use-toast";
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
    const [editName, setEditName] = useState<string>(currentUser?.username);
    const [editDetails, setEditDetails] = useState<string>(currentUser?.details);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSaving(true);
        try {
            await editUserDetails({
                username: editName,
                details: editDetails,
            });
            // Update the currentUser object to reflect changes immediately
            if (currentUser) {
                currentUser.username = editName;
                currentUser.details = editDetails;
            }
        } catch (error) {
            console.error("Failed to update user details:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditName(currentUser?.username || "");
        setEditDetails(currentUser?.details || "");
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
                                            <form onSubmit={handleSubmit}>
                                            <CardContent className="space-y-2 flex-grow">
                                                <div className="space-y-1">
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        placeholder={currentUser.username || editName}
                                                        value={editName}
                                                        onChange={(event) => {
                                                            setEditName(event.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="bio">Bio</Label>
                                                    <Input
                                                        id="new"
                                                        placeholder={currentUser.details || editDetails}
                                                        value={editDetails}
                                                        onChange={(event) => {
                                                            setEditDetails(event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button  type="submit" className="mr-2" disabled={saving}>
                                                    {editingDetails ? (
                                                        <Spinner />
                                                    ) : (
                                                        <div>Save</div>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="outline" onClick={handleCancel} disabled={saving}
                                                >
                                                    {editingDetails ? <Spinner /> : <div>Cancel</div>}
                                                </Button>
                                            </CardFooter>
                                            </form>
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
