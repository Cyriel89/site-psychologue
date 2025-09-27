import * as Icons from "lucide-react";

// renvoie un composant d’icône à partir d'une string stockée en BDD (iconKey)
export function getIconByKey(key?: string) {
  if (!key) return Icons.Circle;
  const K = key as keyof typeof Icons;
  return Icons[K] || Icons.Circle;
}
