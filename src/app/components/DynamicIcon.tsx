"use client";

import { Icon } from "@iconify/react";

export default function DynamicIcon({
  name,
  className,
  inline = false,
}: {
  name?: string;              // ex: "lucide:user" ou juste "user"
  className?: string;
  inline?: boolean;
}) {
  // Par défaut, si pas de préfixe, on assume la collection "lucide"
  const iconName = name && name.includes(":") ? name : `lucide:${name || "circle"}`;

  return <Icon icon={iconName} className={className} inline={inline} />;
}
