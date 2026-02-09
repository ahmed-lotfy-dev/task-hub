"use client";

const faqs = [
  {
    question: "Is Task Hub free to start?",
    answer: "Yes. The Starter plan is free and includes the core workflow features.",
  },
  {
    question: "Can I invite my whole team?",
    answer: "Invite as many members as you want on the Team plan or higher.",
  },
  {
    question: "Do you support single sign-on?",
    answer: "Yes, SAML SSO is available on Enterprise.",
  },
  {
    question: "Does Task Hub work on mobile?",
    answer: "The app is fully responsive and optimized for mobile and tablet.",
  },
  {
    question: "How secure is my data?",
    answer: "We use encryption in transit and at rest with strict access control policies.",
  },
];

export function FAQSection() {
  return (
    <section className="w-full flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know before getting started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {faqs.map((item) => (
          <div key={item.question} className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
