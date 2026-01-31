import { PersonalSidebar } from "@/components/app/personal-sidebar";

export default function PersonalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <PersonalSidebar />
      <main className="flex-1 overflow-y-auto px-10 py-12">
        <div className="mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
