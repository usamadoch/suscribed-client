
"use client";
import { useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";

import { useHydrated } from "@/hooks/useHydrated";
import { useMyMembers } from "@/hooks/queries";


import TablePagination from "@/components/TablePagination";
import Sorting from "@/components/Sorting";
import Loader from "@/components/Loader";
import Item from "./components/Item";
import Row from "./components/Row";

// --- Isolated child components to limit render scope ---

const MembersMobileList = ({ memberships }: { memberships: any[] }) => (
    <div className="card">
        {memberships.map((membership) => (
            <Item item={membership} key={membership._id} />
        ))}
    </div>
);

import Table from "@/components/Table";

const MembersTable = ({ memberships, isLoading }: { memberships: any[]; isLoading: boolean }) => (
    <Table
        isLoading={isLoading}
        items={memberships}
        emptyMessage="No members found."
        headers={[
            {
                render: () => null // Placeholder for Checkbox
            },
            {
                render: () => <Sorting title="Name" />
            },
            {
                render: () => <Sorting title="Tier" />
            },
            {
                render: () => <Sorting title="Joined" />
            },
            {
                className: "text-right",
                render: () => <Sorting title="Status" />
            },
            {
                className: "text-right"
            }
        ]}
        renderRow={(membership) => (
            <Row item={membership} key={membership._id} />
        )}
    />
);

// --- Main page component: orchestration only ---

const MembersPage = () => {
    const { mounted } = useHydrated();

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 10;

    // React Query Hook
    const { data, isLoading } = useMyMembers({ page, limit });


    const memberships = data?.members || [];
    const pagination = data?.pagination || {
        page: 1,
        limit,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
    };

    const isMobile = useMediaQuery({
        query: "(max-width: 767px)",
    });

    const handlePageChange = useCallback((newPage: number) => {
        setPage((prev) => {
            if (newPage >= 1 && newPage <= pagination.totalPages) {
                return newPage;
            }
            return prev;
        });
    }, [pagination.totalPages]);

    if (!mounted) return null;

    return (
        <>
            {isMobile ? (
                <MembersMobileList memberships={memberships} />
            ) : (
                <MembersTable memberships={memberships} isLoading={isLoading} />
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

export default MembersPage;
