"use client";

import React, { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
  XCircle,
  Clock3,
  MessageSquareText,
  UserPlus2,
  MessageSquare,
  Link2,
} from "lucide-react";
import {
  useMarkAsRead,
  useNotifications,
} from "@/lib/services/notifications/use-notification";
import { upperCaseText } from "@/lib/utils";
import { INotification } from "@/lib/services/notifications/notification-service";

type NType = "info" | "success" | "warning" | "error";
type NTag = "Joined" | "Message" | "Comment" | "Connect";

export interface NotificationRecord {
  id: string;
  type: NType;
  tag?: NTag;
  title: string;
  body: string;
  actor?: string;
  actorAccent?: string; // e.g., highlighted actor text color
  createdAt: string; // ISO string for simplicity
  unread?: boolean;
}

const typeStyles: Record<NType, string> = {
  info: "border-blue-200",
  success: "border-green-200",
  warning: "border-amber-200",
  error: "border-red-200",
};
const typeIcons: Record<NType, ReactNode> = {
  info: <Info className="h-4 w-4 text-blue-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-green-600" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  error: <XCircle className="h-4 w-4 text-red-600" />,
};

const tagStyles: Record<NTag, string> = {
  Joined: "bg-emerald-600 text-white",
  Message: "bg-amber-500 text-white",
  Comment: "bg-violet-600 text-white",
  Connect: "bg-sky-600 text-white",
};
const tagIcons: Record<NTag, ReactNode> = {
  Joined: <UserPlus2 className="h-3.5 w-3.5" />,
  Message: <MessageSquare className="h-3.5 w-3.5" />,
  Comment: <MessageSquareText className="h-3.5 w-3.5" />,
  Connect: <Link2 className="h-3.5 w-3.5" />,
};

// @Daniel hope this works?
// TODO: Replace this demo data with real notifications from your backend API.
// Example: Fetch notifications using SWR, React Query, or useEffect+fetch.
// const { data: notifications, isLoading } = useGetNotifications();
// Or use useEffect(() => { fetch('/api/notifications')... }, [])
const demoNotifications: NotificationRecord[] = [
  {
    id: "n1",
    type: "success",
    tag: "Joined",
    title: "New Registration: Finibus Bonorum et Malorum",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    actor: "Allen Deu",
    actorAccent: "text-rose-600",
    createdAt: "2018-11-24T09:30:00.000Z",
    unread: true,
  },
  {
    id: "n2",
    type: "info",
    tag: "Message",
    title: "Darren Smith sent new message",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    actor: "Darren",
    actorAccent: "text-rose-600",
    createdAt: "2018-11-24T09:30:00.000Z",
  },
  {
    id: "n3",
    type: "warning",
    tag: "Comment",
    title: "Arin Gansihram commented on post",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    actor: "Arin Gansihram",
    actorAccent: "text-rose-600",
    createdAt: "2018-11-24T09:30:00.000Z",
  },
  {
    id: "n4",
    type: "info",
    tag: "Connect",
    title: "Jullet Den connect Allen Depk",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    actor: "Jullet Den",
    actorAccent: "text-rose-600",
    createdAt: "2018-11-24T09:30:00.000Z",
  },
];

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const NotificationRow: React.FC<{
  // item: NotificationRecord;
  item: INotification;
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onMarkReadToggle: () => void;
}> = ({ item, expanded, onToggle, onDelete, onMarkReadToggle }) => {
  const itemTag = upperCaseText(item.tag || "");
  return (
    <div
      className={`rounded-lg border ${
        typeStyles[item.type]
      } bg-white shadow-sm overflow-hidden`}
    >
      {/* TOP ROW */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="flex items-start gap-3 p-4 cursor-pointer"
        aria-expanded={expanded}
        aria-controls={`n-body-${item.id}`}
      >
        {/* Left dismiss icon like screenshot */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete notification"
          className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Tag */}
        {itemTag && (
          <span
            className={`inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold ${
              tagStyles[itemTag as NTag]
            }`}
          >
            {tagIcons[itemTag as NTag]}
            {itemTag}
          </span>
        )}

        {/* Title + body preview */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="text-left">
              <div className="flex items-center gap-2">
                {typeIcons[item.type]}
                <h3
                  className={`text-sm sm:text-[15px] font-semibold ${
                    !item.isRead ? "text-gray-900" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </h3>
                {!item.isRead && (
                  <span className="ml-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
                )}
              </div>
              <p className="mt-1 text-[13px] text-gray-600 line-clamp-2">
                {item.body}
              </p>
              {item.actor && (
                <div
                  className={`mt-1 text-[13px] font-semibold`}
                  // ${item.actorAccent ?? ""}
                  // `}
                >
                  {item.actor}
                </div>
              )}
            </div>

            {/* Timestamp */}
            <div className="shrink-0 flex items-center gap-1 text-xs text-gray-500">
              <Clock3 className="h-3.5 w-3.5" />
              <span>{formatDate(item.createdAt)}</span>
            </div>
          </div>

          {/* Divider like screenshot */}
          <div className="mt-3 h-px w-full bg-gray-100" />
        </div>
      </div>

      {/* COLLAPSIBLE BODY */}
      {expanded && (
        <div
          id={`n-body-${item.id}`}
          className="px-4 pb-4 -mt-2 text-left"
          role="region"
          aria-label="Notification details"
        >
          <p className="text-sm text-gray-700">{item.body}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={onMarkReadToggle}
              className="rounded-full border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 active:opacity-80"
            >
              {!item.isRead ? "Mark as read" : "Mark as unread"}
            </button>
            <button
              onClick={onToggle}
              className="rounded-full bg-gray-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-black active:opacity-90"
            >
              Collapse
            </button>
            <button
              onClick={onDelete}
              className="rounded-full bg-red-50 text-red-700 px-3 py-1.5 text-sm font-medium hover:bg-red-100 active:opacity-90"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- NotificationPage: Replace demoNotifications with real backend data when ready ---
const NotificationPage: React.FC = () => {
  // Replace demoNotifications with your backend data here
  // Example:
  // const { data: items = [], isLoading } = useGetNotifications();
  // const [expandedId, setExpandedId] = useState<string | null>(null);
  // ...
  const [items, setItems] = useState<NotificationRecord[]>(demoNotifications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: notifications, isLoading, error } = useNotifications(false);
  const markAsRead = useMarkAsRead(false);

  const unreadCount = useMemo(
    () => items.filter((n) => n.unread).length,
    [items]
  );

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    setExpandedId((prev) => (prev === id ? null : prev));
  };

  const handleMarkReadToggle = (id: string) => {
    // setItems((prev) =>
    //   prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    // );
    markAsRead.mutate(id);
  };

  return (
    <div className="mx-auto max-w-4xl px-2 py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Bell className="h-5 w-5 text-gray-700" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Notifications
          </h1>
        </div>
        <span className="rounded-full bg-gray-900 text-white text-xs px-2 py-0.5">
          {unreadCount} unread
        </span>
      </div>

      {/* Container: Replace items with your backend data when ready */}
      <div className="rounded-xl border bg-white/80 shadow-sm p-2 sm:p-3">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loadng notifications...
          </div>
        ) : notifications?.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-3">
            {/* Render each notification row. Replace items with your backend data. */}
            {notifications?.map((notification) => (
              <NotificationRow
                key={notification.id}
                item={notification}
                expanded={expandedId == notification.id}
                onToggle={() => handleToggle(notification.id)}
                onDelete={() => handleDelete(notification.id)}
                onMarkReadToggle={() => handleMarkReadToggle(notification.id)}
              />
            ))}
            {/* {items.map((n) => (
              <NotificationRow
                key={n.id}
                item={n}
                expanded={expandedId === n.id}
                onToggle={() => handleToggle(n.id)}
                onDelete={() => handleDelete(n.id)}
                onMarkReadToggle={() => handleMarkReadToggle(n.id)}
              />
            ))} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
