import Navbar from "@/components/shared/Navbar";

export default function CommonLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
