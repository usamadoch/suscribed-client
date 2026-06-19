
"use client";
import { useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";
import Row from "./Row";
import Item from "./Item";

import { usePosts } from "@/hooks/queries";

import Sorting from "@/components/Sorting";
import Icon from "@/components/Icon";
import Empty from "@/components/Empty";
import TablePagination from "@/components/TablePagination";
import Tabs from "@/components/Tabs";
import LiveTable, { mockLiveData } from "./LiveTable";

import { DashboardPost, Pagination } from "@/types";

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

import Table from "@/components/Table";

const PostsTable = ({ posts, isLoading }: { posts: DashboardPost[]; isLoading: boolean }) => (
    <Table
        isLoading={isLoading}
        items={posts}
        emptyMessage="No posts found."
        headers={[
            {
                className: "w-[60%] text-left",
                render: () => <Sorting title="Caption" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Published At" />
            },
            {
                className: "text-left",
                render: () => <Sorting title="Visibility" />
            },
            {
                className: "text-left"
            }
        ]}
        renderRow={(post) => (
            <Row item={post} key={post._id} />
        )}
    />
);

// --- Main page component: orchestration only ---

const PostsPage = () => {
    const [activeTab, setActiveTab] = useState<string>("posts");

    const tabs = [
        { title: "Posts", value: "posts" },
        { title: "Live", value: "live" }
    ];

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 10;

    // React Query Hook
    const { data, isLoading } = usePosts({ page, limit });

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
            <div className="mb-6 border-b border-n-6 pb-4 md:overflow-auto md:-mx-5 md:scrollbar-none md:before:w-5 md:before:shrink-0 md:after:w-5 md:after:shrink-0">
                <Tabs
                    items={tabs}
                    value={activeTab}
                    setValue={setActiveTab}
                    className="flex-wrap!"
                />
            </div>

            {activeTab === "posts" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* <PostsMobileList posts={posts} /> */}

                    <PostsTable posts={posts} isLoading={isLoading} />

                    <TablePagination
                        page={pagination.page}
                        totalPages={pagination.totalPages}
                        hasNextPage={pagination.hasNextPage}
                        hasPrevPage={pagination.hasPrevPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {activeTab === "live" && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <LiveTable items={mockLiveData} isLoading={false} />
                </div>
            )}
        </>
    );
};

export default PostsPage;





