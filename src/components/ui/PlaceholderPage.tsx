import { PageHeader } from "@/components/ui/Shared";
import { Card, CardBody } from "@/components/ui";
import { Button } from "@/components/ui/Button";
import { Construction } from "lucide-react";
import Link from "next/link";

interface PlaceholderConfig {
  title: string;
  subtitle?: string;
  role: string;
  description?: string;
}

export function PlaceholderPage({ title, subtitle, role, description }: PlaceholderConfig) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card>
        <CardBody style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 16, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Construction size={28} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h3 className="card-title mb-2">{title} — Coming Soon</h3>
            <p style={{ color: "var(--color-text-secondary)", maxWidth: 400, lineHeight: 1.6 }}>
              {description ?? `This section is under development. Your team can implement ${title.toLowerCase()} functionality here based on the Figma designs.`}
            </p>
          </div>
          <Link href={`/${role}`}>
            <Button variant="outline" size="sm">Back to Dashboard</Button>
          </Link>
        </CardBody>
      </Card>
    </div>
  );
}
