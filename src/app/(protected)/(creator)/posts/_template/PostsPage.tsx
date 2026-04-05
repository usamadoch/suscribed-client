
"use client";
import { useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import Row from "./Row";
import Item from "./Item";

import { usePosts } from "@/hooks/useQueries";

import Sorting from "@/components/Sorting";
import Icon from "@/components/Icon";
import Empty from "@/components/Empty";
import TablePagination from "@/components/TablePagination";

import { DashboardPost, Pagination } from "@/lib/types";
import Loader from "@/components/Loader";

// --- Isolated child components to limit render scope ---

const PostsMobileList = ({ posts }: { posts: DashboardPost[] }) => (
    <div className="card">
        {posts.length > 0 ? (
            posts.map((post) => (
                <Item item={post} key={post._id} />
            ))
        ) : (
            <Empty
                title="No notifications yet"
                content="You'll get updates when people join your community, interact with your posts and more."
                imageSvg={
                    <Icon
                        name="notification"
                        className="w-24 h-24 fill-n-1 dark:fill-white"
                    />
                }
            />
        )}
    </div>
);

const PostsTable = ({ posts, isLoading }: { posts: DashboardPost[]; isLoading: boolean }) => (
    <table className="table-custom">
        <thead>
            <tr>
                <th className="th-custom w-[60%] text-left">
                    <Sorting title="Caption" />
                </th>

                <th className="th-custom text-left">
                    <Sorting title="Published At" />
                </th>
                <th className="th-custom text-left">
                    <Sorting title="Visibility" />
                </th>
                <th className="th-custom text-left"></th>
            </tr>
        </thead>
        <tbody>
            {isLoading ? (
                <tr>
                    <td colSpan={5} className="td-custom py-10 h-full">
                        <div className="flex justify-center items-center">
                            <Loader />
                        </div>
                    </td>
                </tr>
            ) : (
                <>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <Row item={post} key={post._id} />
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="td-custom py-10 text-center">
                                No posts found.
                            </td>
                        </tr>
                    )}
                </>
            )}
        </tbody>
    </table>
);

// --- Main page component: orchestration only ---

const PostsPage = () => {

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 10;

    // React Query Hook
    const { data, isLoading } = usePosts({ page, limit });

    console.log(data);


    const posts: DashboardPost[] = data?.posts || [];

    const pagination: Pagination = data?.pagination || {
        page: 1,
        limit,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    };

    const isTablet = useMediaQuery({
        query: "(max-width: 1023px)",
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage((prev) => {
            if (newPage >= 1 && newPage <= pagination.totalPages) {
                return newPage;
            }
            return prev;
        });
    }, [pagination.totalPages]);

    return (
        <>
            {isTablet ? (
                <PostsMobileList posts={posts} />
            ) : (
                <PostsTable posts={posts} isLoading={isLoading} />
            )}
            <TablePagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                hasNextPage={pagination.hasNextPage}
                hasPrevPage={pagination.hasPrevPage}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default PostsPage;





