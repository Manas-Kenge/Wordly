import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./Avatar";
import { formatDateString, getPlainTextFromHTML } from '../util/string';

export const FullBlog = ({ blog }: { blog: Blog }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Appbar />
      <div className="flex justify-center grow py-12 bg-gray-50">
        <div className="grid grid-cols-12 gap-8 px-6 md:px-10 w-full max-w-screen-xl">
          <div className="col-span-12 md:col-span-8 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900">
              {blog.title}
            </h1>
            <p className="text-slate-500 text-sm md:text-base">
              {formatDateString(blog.publishedDate)}
            </p>
            <div className="prose max-w-none text-gray-800">
              {getPlainTextFromHTML(blog.content)}
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 flex flex-col justify-start space-y-4">
            <h2 className="text-slate-600 text-lg font-semibold">Author</h2>
            <div className="flex items-center">
              <div className="pr-4">
                <Avatar size="medium" name={blog.author.username || "Anonymous"} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">
                  {blog.author.username || "Anonymous"}
                </div>
                <p className="pt-2 text-slate-500 text-sm md:text-base">
                  {blog.author.details || ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
