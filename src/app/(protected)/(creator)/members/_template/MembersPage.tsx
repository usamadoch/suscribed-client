





"use client";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";

import { useHydrated } from "@/hooks/useHydrated";
import { useMyMembers } from "@/hooks/useQueries";

import { RequireCreator } from "@/store/auth";
import { useHeader } from "@/context/HeaderContext";

import TablePagination from "@/components/TablePagination";
import Sorting from "@/components/Sorting";
import Loader from "@/components/Loader";
import Item from "./components/Item";
import Row from "./components/Row";


const MembersPage = () => {
    useHeader({ title: "Members" });
    const { mounted } = useHydrated();

    // Pagination State
    const [page, setPage] = useState(1);
    const limit = 10;

    // React Query Hook
    const { data, isLoading } = useMyMembers({ page, limit });

    const memberships = data?.memberships || [];
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

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPage(newPage);
        }
    };

    if (!mounted) return null;


    return (
        <>
            {isMobile ? (
                <div className="card">
                    {memberships.map((membership) => (
                        <Item item={membership} key={membership._id} />
                    ))}
                </div>
            ) : (
                <table className="table-custom">
                    <thead>
                        <tr>
                            <th className="th-custom">
                                {/* <Checkbox /> */}
                            </th>
                            <th className="th-custom">
                                <Sorting title="Name" />
                            </th>
                            <th className="th-custom">
                                <Sorting title="Tier" />
                            </th>
                            <th className="th-custom">
                                <Sorting title="Joined" />
                            </th>
                            <th className="th-custom text-right">
                                <Sorting title="Status" />
                            </th>
                            <th className="th-custom text-right"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="td-custom text-center text-gray-500">
                                    <div className="flex items-center justify-center">
                                        <Loader />
                                    </div>
                                </td>
                            </tr>
                        ) : (

                            <>
                                {memberships.length > 0 ? (
                                    memberships.map((membership) => (
                                        <Row item={membership} key={membership._id} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className=" py-12 text-center text-gray-500">
                                            No members found.
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}
                    </tbody>
                </table>
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
