"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { listContainerVariants, listItemVariants } from "@/components/motion/variants";
import { DeleteSessionButton } from "@/components/host/DeleteSessionButton";
import { CreateSessionForm } from "@/components/host/CreateSessionForm";

interface Session {
  id: string;
  name: string;
  _count: { members: number };
}

interface Props {
  sessions: Session[];
  joinedSessions: Session[];
}

function SessionCard({ session, showDelete }: { session: Session; showDelete: boolean }) {
  return (
    <m.div
      variants={listItemVariants}
      className="relative flex items-center justify-between bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]"
    >
      <Link href={`/host/${session.id}`} className="absolute inset-0 rounded-2xl" />
      <div className="pointer-events-none">
        <p className="font-semibold text-gray-900">{session.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {session._count.members} membre{session._count.members > 1 ? "s" : ""}
        </p>
      </div>
      <div className="relative z-10 flex items-center gap-1">
        {showDelete && (
          <DeleteSessionButton sessionId={session.id} sessionName={session.name} />
        )}
        <m.span
          whileHover={{ x: 3 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="pointer-events-none text-gray-300 ml-1"
        >
          <ChevronRight size={16} />
        </m.span>
      </div>
    </m.div>
  );
}

export function SessionList({ sessions, joinedSessions }: Props) {
  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Nouveau groupe</h2>
        <CreateSessionForm />
      </div>

      {sessions.length > 0 ? (
        <m.div
          variants={listContainerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3 mb-8"
        >
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} showDelete />
          ))}
        </m.div>
      ) : (
        <p className="text-center text-sm text-gray-400 mb-8 py-8">
          Aucun groupe pour l&apos;instant.
        </p>
      )}

      {joinedSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Groupes rejoints</h2>
          <m.div
            variants={listContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {joinedSessions.map((session) => (
              <SessionCard key={session.id} session={session} showDelete={false} />
            ))}
          </m.div>
        </div>
      )}
    </>
  );
}
