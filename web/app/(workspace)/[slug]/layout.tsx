import { WorkspaceSidebar } from "@/components/app/workspace-sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <WorkspaceSidebar />
      <main className="flex-1 overflow-y-auto px-10 py-12">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
