import { Appbar } from "../components/Appbar"

export const Home = () => {
    return <div>
        <Appbar />
        <div className="grid grid-cols-2 gap-4">
            <div className="grid items-center gap-6 px-4">
                <h1 className="text-4xl text-center font-bold">Welcome to Blog App</h1>
                <p className="mt-4 max-w-[600px]">Stay up-to-date with the latest news, insights, and expert opinions in the world of blogging.
                </p>
            </div>
            <div>
                <img
                    src="/blog.jpg"
                    width="300"
                    height="310"
                    alt="Hero Image"
                    className="mx-auto overflow-hidden rounded-xl object-center sm:w-full"
                />
            </div>
        </div>
    </div>
}