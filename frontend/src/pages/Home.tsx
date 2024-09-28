import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { BlogCard } from "@/components/BlogCard"
import { useBlogs } from "../hooks";

export const Home = () => {
    const { blogs } = useBlogs();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleButtonClick = () => {
        if (isLoggedIn) {
            navigate('/publish');
        } else {
            navigate('/signup');
        }
    };

    return <div>
        <Appbar skipAuthCheck />
        <div className="grid grid-cols-2 gap-8 bg-gradient-to-b from-emerald-400 to-emerald-50 h-screen p-8">
            <div className="flex flex-col justify-center">
                <h1 className="text-5xl font-medium font-serif leading-tight">
                    "There is no greater agony than bearing an untold story inside you."
                </h1>
                <p className="mt-6 text-lg text-gray-700">
                    Blogging allows you to share your ideas, tell your story, and inspire others. Through words, you can create change and connect with like-minded people.
                </p>
                <button
                    className="mt-8 px-6 py-3 bg-black text-white text-lg rounded-full"
                    onClick={handleButtonClick}
                >
                    {isLoggedIn ? 'Start Publishing' : 'Start your journey'}
                </button>
            </div>
            <div className="flex justify-center items-center">
                <img
                    src="/blog.jpg"
                    alt="Hero Image"
                    className="w-2/3 h-auto rounded-lg bg-inherit"
                />
            </div>
        </div>
        <div className="flex justify-center">
            <div>
                {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.username || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.publishedDate}
                />)}
            </div>
        </div>
    </div>
}