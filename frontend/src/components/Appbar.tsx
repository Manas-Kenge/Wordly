// import { Avatar } from "./Avatar";
import { Link, useNavigate } from "react-router-dom"
import { Search } from "./Search";
import { Profile } from "./Profile";
import { Button } from "./ui/button";

interface AppbarProps {
    skipAuthCheck?: Boolean;
}

export const Appbar = ({ skipAuthCheck = false }: AppbarProps) => {
    const navigate = useNavigate();
    const isUserLoggedIn = localStorage.getItem('token');

    if (!isUserLoggedIn && skipAuthCheck == false) {
        navigate('/signin');
    }

    return <div className="flex justify-between items-center px-10 py-2 bg-emerald-400">
        <div className="flex justify-center items-center gap-4">
            <Link to={'/blogs'} className="flex items-center justify-center cursor-pointer font-bold text-xl">
                {bookIcon()}
                <span className="ml-2">Medium</span>
            </Link>
            <div>
                <Search />
            </div>
        </div>
        {isUserLoggedIn ? (
            <>
                <div className="flex space-x-4">
                    <Link to={`/publish`}>
                        <Button size="lg" className="bg-emerald-700 hover:bg-green-800 p-4">
                            {writeIcon()}<span>Write</span>
                        </Button>
                    </Link>
                    <Profile />
                </div>
            </>)
            : (
                <div className="flex space-x-4">
                    <Link
                        to="/signup"
                        className="focus:outline-none whitespace-nowrap text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-3xl text-m px-5 py-2.5"
                    >
                        Get started
                    </Link>
                </div>
            )}
    </div>
}

function bookIcon() {
    return <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
    </div>
}

function writeIcon() {
    return <div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
    </div>
}