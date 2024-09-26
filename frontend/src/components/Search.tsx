import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash.debounce'
import { BACKEND_URL } from '../config';

interface SearchResult {
    blogs: { title: string; id: string }[];
    users: { id: string; name: string }[];
}

export const Search = () => {
    const { id } = useParams();
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<SearchResult>({ blogs: [], users: [] });
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setQuery('');
    }, [id]);

    const handleSearch = async (keyword: string) => {
        if (keyword.trim().length === 0) {
            setResults({ blogs: [], users: [] });
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/search?keyword=${keyword}`);
            setResults(response.data);
        } catch (error) {
            console.error('Error fetching search results', error);
            setResults({ blogs: [], users: [] });
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearch = useCallback(debounce(handleSearch, 200), []);

    useEffect(() => {
        debouncedSearch(query);
        return () => {
            debouncedSearch.cancel();
        };
    }, [query, debouncedSearch]);

    return (
        <div className="hidden md:block relative md:w-[190px] lg:w-[400px]">
            <div className="relative">
                <input
                    type="text"
                    className="p-2 pl-10 pr-6 border rounded-full focus:outline-none focus:ring-black focus:ring-1 w-full bg-main text-main"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-main">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {query && (
                <>
                    <div className="absolute top-9 left-0 right-0 bg-main border border-gray-100 dark:border-gray-700 shadow-lg rounded mt-1 z-10 md:w-[450px] lg:w-[600px]">
                        <div className="p-2">
                            <h3 className="text-lg font-semibold py-2 pb-1">Blogs</h3>
                            {results.blogs.length > 0 ? (
                                results.blogs.map((blog) => (
                                    <Link key={blog.id} to={`/blog/${blog.id}`} className="block p-1 cursor-pointer hover:bg-sub">
                                        <div>{blog.title}</div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-1">{loading ? 'Loading...' : 'No Blogs found'} </div>
                            )}
                        </div>
                        <div className="p-2">
                            <h3 className="text-lg font-semibold">Users</h3>
                            {results.users.length > 0 ? (
                                results.users.map((user) => (
                                    <Link key={user.id} to={`/profile/${user.id}`} className="block p-1 cursor-pointer hover:bg-sub">
                                        <div>{user.name}</div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-1">{loading ? 'Loading...' : 'No users found'} </div>
                            )}
                        </div>
                    </div>
                    <div
                        className="overlay h-screen w-screen fixed top-0 left-0 bg-black bg-opacity-10"
                        onClick={() => setQuery('')}
                    ></div>
                </>
            )}
        </div>
    );
};
