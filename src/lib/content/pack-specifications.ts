/** Active Workspace portal for packaging specification authoring */
export const ACTIVE_WORKSPACE_URL =
  process.env.NEXT_PUBLIC_ACTIVE_WORKSPACE_URL?.trim() ||
  process.env.ACTIVE_WORKSPACE_URL?.trim() ||
  "";

export const packSpecificationsContent = {
  title: "Specifications",
  description: "Write and manage packaging specifications in Active Workspace.",
  message: "Access Active Workspace to write your packaging specification.",
  ctaLabel: "Go to Active Workspace",
};
