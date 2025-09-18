"use client";

import React, { useMemo, useState } from "react";
import { Bell, Send, Eye, Trash2 } from "lucide-react";

type NType = "info" | "success" | "warning" | "error";
type NTag = "Joined" | "Message" | "Comment" | "Connect";
type Audience = "users" | "merchants" | "all";

export interface NotificationRecord {
  id: string;
  type: NType;
  tag?: NTag;
  title: string;
  body: string;
  actor?: string;
  actorAccent?: string;
  createdAt: string;
  unread?: boolean;
}

const typeOptions: { label: string; value: NType }[] = [
  { label: "Info", value: "info" },
  { label: "Success", value: "success" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
];

const tagOptions: { label: string; value: NTag }[] = [
  { label: "Message", value: "Message" },
  { label: "Comment", value: "Comment" },
  { label: "Connect", value: "Connect" },
];

const audienceOptions: { label: string; value: Audience }[] = [
  { label: "All", value: "all" },
  { label: "Users", value: "users" },
  { label: "Merchants", value: "merchants" },
];

const uid = () => Math.random().toString(36).slice(2, 10);

const BroadcastAdminPage: React.FC<{
  onSend?: (payload: {
    audience: Audience;
    notification: NotificationRecord;
  }) => Promise<void> | void;
}> = ({ onSend }) => {
  const [audience, setAudience] = useState<Audience>("all");
  const [type, setType] = useState<NType>("info");
  const [tag, setTag] = useState<NTag | "">("Message");
  const [title, setTitle] = useState("System maintenance scheduled");
  const [body, setBody] = useState(
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
  );
  const [actor, setActor] = useState("KredMart Team");
  const [unread, setUnread] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const preview: NotificationRecord = useMemo(
    () => ({
      id: `bcast_${uid()}`,
      type,
      tag: tag || undefined,
      title: title.trim() || "Untitled",
      body: body.trim(),
      actor: actor.trim() || undefined,
      actorAccent: "text-rose-600",
      createdAt: new Date().toISOString(),
      unread,
    }),
    [type, tag, title, body, actor, unread]
  );

  async function handleSend() {
    if (!title.trim() || !body.trim()) {
      alert("Please add a title and body.");
      return;
    }
    setSubmitting(true);
    try {
      if (onSend) await onSend({ audience, notification: preview });
      // Or POST to your API here
      // await fetch("/api/broadcast", { method: "POST", body: JSON.stringify({ audience, notification: preview }) });
      alert("Broadcast sent!");
    } catch (e) {
      console.error(e);
      alert("Failed to send broadcast.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClear() {
    setTitle("");
    setBody("");
    setActor("");
    setUnread(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-gray-700" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Broadcast (Admin)
          </h1>
        </div>
      </div>

      {/* Compose (FULL WIDTH) */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Compose message</h2>

        {/* Audience */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Audience
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {audienceOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setAudience(opt.value)}
              className={`rounded-full border px-3 py-1.5 text-sm ${
                audience === opt.value
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Type & Tag */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as NType)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              {typeOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag (optional)
            </label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as NTag)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {tagOptions.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="e.g., System maintenance scheduled"
        />

        {/* Body */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mb-3 w-full min-h-[120px] rounded-md border px-3 py-2 text-sm"
          placeholder="Write the message detail…"
        />

        {/* Actor */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Actor (optional)
        </label>
        <input
          value={actor}
          onChange={(e) => setActor(e.target.value)}
          className="mb-4 w-full rounded-md border px-3 py-2 text-sm"
          placeholder="e.g., KredMart Team"
        />

        {/* Unread toggle */}
        <label className="inline-flex items-center gap-2 text-sm mb-5">
          <input
            type="checkbox"
            checked={unread}
            onChange={(e) => setUnread(e.target.checked)}
          />
          Send as unread
        </label>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSend}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-black active:opacity-90"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Sending…" : "Send broadcast"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-4 py-2 text-sm font-semibold hover:bg-red-100 active:opacity-90"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </button>
        </div>
      </div>

      {/* --- Preview (UNDERNEATH) --- */}
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye className="h-5 w-5 text-gray-700" />
          Preview
        </h2>

        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="flex items-start gap-3 p-4">
            <div className="h-6 w-6 rounded-md bg-gray-100" />
            {preview.tag && (
              <span className="inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold bg-sky-600 text-white">
                {preview.tag}
              </span>
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {preview.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-gray-600">
                    {preview.body}
                  </p>
                  {preview.actor && (
                    <div
                      className={`mt-1 text-[13px] font-semibold ${preview.actorAccent}`}
                    >
                      {preview.actor}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(preview.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-3 h-px w-full bg-gray-100" />
            </div>
          </div>
          <div className="px-4 pb-4 -mt-2 text-left text-sm text-gray-700">
            {preview.body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastAdminPage;
