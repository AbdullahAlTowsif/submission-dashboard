"use client";

import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SubmissionStatus } from "@/types/enum.interface";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const TABS: { value: "ALL" | SubmissionStatus; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
];

interface Props {
    status?: SubmissionStatus;
    search: string;
    onStatusChange: (status?: SubmissionStatus) => void;
    onSearchChange: (search: string) => void;
}

export default function SubmissionFilters({
    status,
    search,
    onStatusChange,
    onSearchChange,
}: Props) {
    const [input, setInput] = useState(search);

    // Push the search to the URL 400ms after the user stops typing
    useEffect(() => {
        const trimmed = input.trim();
        if (trimmed === search) return;

        const timer = setTimeout(() => onSearchChange(trimmed), 400);
        return () => clearTimeout(timer);
    }, [input, search, onSearchChange]);

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
                value={status ?? "ALL"}
                onValueChange={(value) =>
                    onStatusChange(value === "ALL" ? undefined : (value as SubmissionStatus))
                }
            >
                <TabsList>
                    {TABS.map((tab) => (
                        <TabsTrigger key={tab.value} value={tab.value}>
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Search project, student or email"
                    className="pl-8 pr-8"
                    aria-label="Search submissions"
                />
                {input && (
                    <button
                        type="button"
                        onClick={() => {
                            setInput("");
                            onSearchChange("");
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear search"
                    >
                        <X className="size-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
