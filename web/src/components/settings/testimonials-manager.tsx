"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Testimonial, CreateTestimonialInput } from "@taskflow/shared";

const emptyForm: CreateTestimonialInput = {
  name: "",
  quote: "",
  role: "",
  company: "",
  avatarUrl: "",
};

export function TestimonialsManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateTestimonialInput>(emptyForm);

  const { data: testimonial, isLoading } = useQuery({
    queryKey: ["testimonials", "me"],
    queryFn: () => apiFetch<Testimonial | null>("/api/testimonials/me"),
  });

  useEffect(() => {
    if (!testimonial) return;
    setForm({
      name: testimonial.name,
      quote: testimonial.quote,
      role: testimonial.role ?? "",
      company: testimonial.company ?? "",
      avatarUrl: testimonial.avatarUrl ?? "",
    });
  }, [testimonial]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateTestimonialInput) =>
      apiFetch<Testimonial>("/api/testimonials/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
  });

  const handleSubmit = () => {
    if (!form.name || !form.quote) return;
    createMutation.mutate(form);
  };
  const isSaving = createMutation.isPending;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{testimonial ? "Edit Testimonial" : "Add Testimonial"}</CardTitle>
          <CardDescription>
            Submit one testimonial for your account. Only published testimonials appear on the landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role / Title</label>
              <Input
                value={form.role ?? ""}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
                placeholder="Head of Product"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                value={form.company ?? ""}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                value={form.avatarUrl ?? ""}
                onChange={(event) => setForm({ ...form, avatarUrl: event.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Quote</label>
            <Textarea
              value={form.quote}
              onChange={(event) => setForm({ ...form, quote: event.target.value })}
              placeholder="What did they say?"
              rows={4}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={isSaving || !form.name || !form.quote}>
              {testimonial ? "Save Testimonial" : "Add Testimonial"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading your testimonial...</p>
      )}
    </div>
  );
}
