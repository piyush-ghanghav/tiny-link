import { useState } from "react";
import { Button } from "./ui/Button";
import { CopyButton } from "./ui/CopyButton";
import Link from "next/link";

interface Link{
    id: number;
    code: string;
    target_url: string;
    clicks: number;
    last_clicked_at: string | null;
    created_at: string;
}

interface LinksTableProps {
  links: Link[];
  onDelete: (code: string) => void;
}

export function LinksTable({ links, onDelete }: LinksTableProps) {
    const [deletingCode, setDeletingCode] = useState<string | null>(null);

    const handleDelete = async (code: string) =>{
        if(!confirm('Are you sure you want to delete this link?'))return;

        setDeletingCode(code);
        await onDelete(code);
        setDeletingCode(null);
    }


    const truncateUrl = (url: string, maxLength = 50) => {
        if (url.length <= maxLength) return url;
        return url.substring(0, maxLength) + '...';
    };

    if (links.length === 0) {
        return (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No links yet. Create your first one!</p>
        </div>
        );
    }

    return (
        <div className="bg-white rounded-lg ">
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Short Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Target URL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Clicks
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Clicked
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Stats
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {links.map((link) => (
                            <tr key={link.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                    <a
                                    href={`/${link.code}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-teal-600 hover:underline font-medium"
                                    >
                                        {link.code}
                                    </a>
                                    
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <a
                                        href={link.target_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 hover:text-teal-600"
                                        title={link.target_url}
                                    >
                                        {truncateUrl(link.target_url)}
                                    </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                    {link.clicks}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {link.last_clicked_at ? (
                                        <>
                                            <div className="text-gray-700">{new Date(link.last_clicked_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500 mt-1">{new Date(link.last_clicked_at).toLocaleTimeString()}</div>
                                        </>
                                    ) : (
                                        <span className="text-gray-500">Never</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        href={`/code/${link.code}`}
                                        className="text-teal-600 hover:underline text-sm"
                                    >
                                        View Stats
                                    </Link>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <CopyButton text={`${window.location.origin}/${link.code}`} />
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(link.code)}
                                            isLoading={deletingCode === link.code}
                                            className="text-sm px-3 py-1"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>

    
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
