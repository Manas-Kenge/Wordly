import { Link } from "react-router-dom"
import { Appbar } from "../components/Appbar"

export const Home = () => {
    return <div>
        <Appbar skipAuthCheck />
        <div className="grid grid-cols-2 gap-8 bg-[#f4f4f1] h-screen p-8">
            <div className="flex flex-col justify-center">
                <h1 className="text-5xl font-medium font-serif leading-tight">
                    "There is no greater agony than bearing an untold story inside you."
                </h1>
                <p className="mt-6 text-lg text-gray-700">
                    Blogging allows you to share your ideas, tell your story, and inspire others. Through words, you can create change and connect with like-minded people.
                </p>
                <Link to="/signup">
                    <button className="mt-8 px-6 py-3 bg-black text-white text-lg rounded-full">
                        Start your journey
                    </button>
                </Link>
            </div>
            <div className="flex justify-center items-center">
                <img
                    src="/blog.jpg"
                    alt="Hero Image"
                    className="w-3/4 h-auto rounded-lg"
                />
            </div>
        </div>
    </div>
}