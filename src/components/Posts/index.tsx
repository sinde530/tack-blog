import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import axios from 'axios';
import { PostProps } from 'src/App';

export type ParamProps = {
    categories: string;
    fileName: string;
};

export default function Posts({ posts }: { posts: PostProps[] }) {
    const { categories, fileName } = useParams<ParamProps>();
    const [mdSource, setMdSource] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const url = `https://raw.githubusercontent.com/sinde530/tack-blog/master/public/posts/${categories}/${fileName}.md`;
    const localUrl = `http://localhost:5173/tack-blog/posts/${categories}/${fileName}.md`;

    const post = posts.find(
        (item) => item.categories === categories && item.fileName === fileName,
    );

    useEffect(() => {
        const fetchPostContent = async () => {
            try {
                setIsLoading(true);

                let response;
                try {
                    response = await axios.get(url);
                } catch {
                    response = await axios.get(localUrl);
                }

                setMdSource(response.data);
            } catch (error) {
                console.error('Failed to fetch post:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPostContent();
    }, [categories, fileName]);

    return (
        <div className="post">
            {isLoading ? (
                <div>
                    <span>Loading</span>
                </div>
            ) : (
                mdSource && (
                    <>
                        <ReactMarkdown
                            className="markdown"
                            rehypePlugins={[rehypeHighlight]}
                        >
                            {mdSource}
                        </ReactMarkdown>

                        <h1>{post?.title}</h1>
                        <p>{post?.date}</p>
                        <div>
                            <Link to="/tack-blog">Home</Link>
                        </div>
                    </>
                )
            )}
        </div>
    );
}
