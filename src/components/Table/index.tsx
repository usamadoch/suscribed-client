import React from 'react';
import Loader from "@/components/Loader";

interface Header {
    title?: string;
    className?: string;
    render?: () => React.ReactNode;
}

interface TableProps<T> {
    headers: Header[];
    items: T[];
    isLoading: boolean;
    renderRow: (item: T, index: number) => React.ReactNode;
    emptyMessage?: string;
}

const Table = <T,>({
    headers,
    items,
    isLoading,
    renderRow,
    emptyMessage = "No items found."
}: TableProps<T>) => {
    const colSpan = headers.length;

    return (
        <table className="table-custom">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} className={`th-custom ${header.className || ""}`}>
                            {header.render ? header.render() : header.title}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {isLoading ? (
                    <tr>
                        <td colSpan={colSpan} className="td-custom py-10 h-full">
                            <div className="flex justify-center items-center">
                                <Loader />
                            </div>
                        </td>
                    </tr>
                ) : (
                    <>
                        {items.length > 0 ? (
                            items.map((item, index) => renderRow(item, index))
                        ) : (
                            <tr>
                                <td colSpan={colSpan} className="td-custom py-10 text-center">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </>
                )}
            </tbody>
        </table>
    );
};

export default Table;
