"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  AlignLeft,
  Building2,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Download,
  UserPlus,
  ExternalLink,
  Plus,
  Edit3,
  RotateCcw,
  ArrowRight,
  FileCheck,
  AlertCircle,
  Info,
  CheckCircle2,
  Circle,
  TrendingUp,
  Zap,
} from "lucide-react";

import {
  MOCK_REGULATIONS,
  INITIAL_ACTIONS,
  CONTEXTUAL_CHAT_RESPONSES,
  type RegulationMapping,
  type Obligation,
  type AuditEvent,
  type DownstreamAction,
  type DecisionState,
  type Applicability,
  type CoverageStatus,
} from "@/lib/mockData";

// ─── Badge helpers ────────────────────────────────────────────────────────────

function decisionBadge(state: DecisionState) {
  const map: Record<DecisionState, string> = {
    Draft: "bg-transparent text-gray-500 border border-gray-300",
    Reviewed: "bg-transparent text-blue-600 border border-blue-400",
    Approved: "bg-transparent text-green-600 border border-green-400",
    Superseded: "bg-transparent text-purple-600 border border-purple-400",
  };
  return map[state];
}

function applicabilityBadge(a: Applicability) {
  const map: Record<Applicability, string> = {
    Applicable: "bg-green-100 text-green-700 border border-green-300",
    "Partially applicable": "bg-amber-100 text-amber-700 border border-amber-300",
    "Not applicable": "bg-red-100 text-red-600 border border-red-300",
  };
  return map[a];
}

function riskBadge(r: string) {
  if (r === "High") return "bg-orange-100 text-orange-700 border border-orange-300";
  if (r === "Medium") return "bg-amber-100 text-amber-700 border border-amber-300";
  return "bg-green-100 text-green-700 border border-green-300";
}

function coverageBadge(s: CoverageStatus) {
  const map: Record<CoverageStatus, string> = {
    Covered: "bg-green-100 text-green-700 border border-green-300",
    Partial: "bg-amber-100 text-amber-700 border border-amber-300",
    "Not covered": "bg-red-100 text-red-600 border border-red-300",
    "Not assessed": "bg-transparent text-gray-400 border border-gray-300",
  };
  return map[s];
}

function pendingBadge() {
  return "bg-red-50 text-red-500 border border-red-300";
}

function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

function CoverageBar({ value }: { value: number }) {
  const color =
    value >= 80 ? "bg-green-500" : value >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-400 w-7 text-right">{value}%</span>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

type View =
  | "dashboard"
  | "mapping"
  | "records"
  | "actions"
  | "statements";

const NAV = [
  {
    items: [
      { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
      { id: "mapping" as View, label: "Regulations Mapping", icon: BookOpen },
      { id: "actions" as View, label: "Actions", icon: Zap },
      { id: "statements" as View, label: "Policy Statements", icon: AlignLeft },
    ],
  },
];

function Sidebar({ active, setActive }: { active: View; setActive: (v: View) => void }) {
  return (
    <aside className="w-52 bg-[#1b2031] flex flex-col flex-shrink-0 h-full">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-white flex items-center justify-center">
          <span className="text-[#1b2031] text-sm font-bold">C</span>
        </div>
        <span className="text-white text-sm font-semibold tracking-tight">Cardamon</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {NAV[0].items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left mb-0.5 ${
              active === id
                ? "bg-white/10 text-white font-medium"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${active === id ? "text-white" : "text-gray-500"}`} />
            {label}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold">MP</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-200 truncate">Maya Patel</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────

type ViewScope = "my" | "team" | "all";

function TopBar({
  viewScope,
  setViewScope,
}: {
  viewScope: ViewScope;
  setViewScope: (s: ViewScope) => void;
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center gap-3 flex-shrink-0">
      {/* Entity */}
      <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium cursor-pointer hover:text-gray-900">
        <Building2 className="w-4 h-4 text-gray-400" />
        Wise US Inc
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="flex-1" />
      {/* View scope toggle */}
      <div className="flex items-center bg-gray-100 rounded-md p-0.5">
        {(["my", "team", "all"] as ViewScope[]).map((s) => {
          const label = s === "my" ? "My View" : s === "team" ? "Team View" : "All";
          return (
            <button
              key={s}
              onClick={() => setViewScope(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                viewScope === s
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm max-w-sm">
      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  sub,
  onClick,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  onClick?: () => void;
  accent?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all group flex-1 min-w-0"
    >
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-900"} group-hover:text-indigo-700 transition-colors`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </button>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

// Scope-specific KPI datasets. "my" = Maya's personal view, "team" = US compliance team, "all" = full org.
const SCOPE_METRICS: Record<ViewScope, {
  mapped: number;
  applicablePct: number;
  applicableOf: number;
  applicableTotal: number;
  approvedPct: number;
  approvedCount: number;
  policyPct: number;
  policyOf: number;
  controlPct: number;
  controlOf: number;
  openGaps: number;
  unreviewed: number;
  decisionCounts: Record<string, number>;
  gapBreakdown: { label: string; count: number; color: string }[];
}> = {
  my: {
    mapped: 7,
    applicablePct: 71,
    applicableOf: 5,
    applicableTotal: 7,
    approvedPct: 29,
    approvedCount: 2,
    policyPct: 38,
    policyOf: 2,
    controlPct: 52,
    controlOf: 3,
    openGaps: 7,
    unreviewed: 3,
    decisionCounts: { Draft: 3, Reviewed: 2, Approved: 2, Superseded: 0 },
    gapBreakdown: [
      { label: "Policy gap", count: 3, color: "bg-red-400" },
      { label: "Control gap", count: 2, color: "bg-amber-400" },
      { label: "Evidence missing", count: 3, color: "bg-orange-400" },
      { label: "Not assessed", count: 3, color: "bg-gray-300" },
    ],
  },
  team: {
    mapped: 42,
    applicablePct: 64,
    applicableOf: 27,
    applicableTotal: 42,
    approvedPct: 45,
    approvedCount: 19,
    policyPct: 51,
    policyOf: 14,
    controlPct: 63,
    controlOf: 17,
    openGaps: 23,
    unreviewed: 11,
    decisionCounts: { Draft: 11, Reviewed: 12, Approved: 19, Superseded: 0 },
    gapBreakdown: [
      { label: "Policy gap", count: 9, color: "bg-red-400" },
      { label: "Control gap", count: 7, color: "bg-amber-400" },
      { label: "Evidence missing", count: 10, color: "bg-orange-400" },
      { label: "Not assessed", count: 8, color: "bg-gray-300" },
    ],
  },
  all: {
    mapped: 355,
    applicablePct: 62,
    applicableOf: 220,
    applicableTotal: 355,
    approvedPct: 41,
    approvedCount: 146,
    policyPct: 38,
    policyOf: 84,
    controlPct: 27,
    controlOf: 59,
    openGaps: 48,
    unreviewed: 23,
    decisionCounts: { Draft: 23, Reviewed: 186, Approved: 146, Superseded: 0 },
    gapBreakdown: [
      { label: "Policy gap", count: 18, color: "bg-red-400" },
      { label: "Control gap", count: 14, color: "bg-amber-400" },
      { label: "Evidence missing", count: 21, color: "bg-orange-400" },
      { label: "Not assessed", count: 12, color: "bg-gray-300" },
    ],
  },
};

function Dashboard({
  regulations,
  onOpenRecord,
  onFilteredMapping,
  viewScope,
}: {
  regulations: RegulationMapping[];
  onOpenRecord: (id: string) => void;
  onFilteredMapping: (filter: string) => void;
  viewScope: ViewScope;
}) {
  const m = SCOPE_METRICS[viewScope];

  // Work queue is always personal (Maya's) regardless of scope
  const workQueue = regulations.filter((r) => r.decisionState !== "Approved");

  return (
    <div className="overflow-y-auto h-full p-5 space-y-5">
      {/* KPI row — all values from scope-specific dataset */}
      <div className="flex gap-3">
        <KpiCard
          label="Applicable"
          value={`${m.applicablePct}%`}
          sub={`${m.applicableOf} out of ${m.mapped} items`}
          accent="text-gray-900"
          onClick={() => onFilteredMapping("applicable")}
        />
        <KpiCard
          label="Control Coverage"
          value={`${m.controlPct}%`}
          sub={`${m.controlOf} out of ${m.applicableOf} applicable items`}
          accent={m.controlPct < 50 ? "text-red-600" : "text-gray-900"}
          onClick={() => onFilteredMapping("control-gap")}
        />
        <KpiCard
          label="Policy Coverage"
          value={`${m.policyPct}%`}
          sub={`${m.policyOf} out of ${m.applicableOf} applicable items`}
          accent={m.policyPct < 50 ? "text-red-600" : "text-gray-900"}
          onClick={() => onFilteredMapping("policy-gap")}
        />
        <KpiCard
          label="Approved Decisions"
          value={`${m.approvedPct}%`}
          sub={`${m.approvedCount} of ${m.mapped} mapped`}
          accent="text-green-700"
          onClick={() => onFilteredMapping("approved")}
        />
        <KpiCard
          label="Open Coverage Gaps"
          value={m.openGaps}
          sub="obligations needing action"
          accent="text-red-600"
          onClick={() => onFilteredMapping("uncovered")}
        />
        <KpiCard
          label="Unreviewed"
          value={m.unreviewed}
          sub="in Draft state"
          accent={m.unreviewed > 0 ? "text-amber-600" : "text-green-600"}
          onClick={() => onFilteredMapping("draft")}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            Decision lifecycle
          </h3>
          <div className="space-y-3">
            {Object.entries(m.decisionCounts).map(([state, count]) => {
              const barColor =
                state === "Approved" ? "bg-green-500" :
                state === "Reviewed" ? "bg-blue-500" :
                state === "Draft" ? "bg-gray-300" : "bg-purple-400";
              const maxCount = Math.max(...Object.values(m.decisionCounts), 1);
              return (
                <div key={state} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20 flex-shrink-0">{state}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            Gap breakdown
          </h3>
          <div className="space-y-3">
            {m.gapBreakdown.map(({ label, count, color }) => {
              const max = Math.max(...m.gapBreakdown.map((g) => g.count), 1);
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Work queue */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Work queue</h3>
          <span className="text-xs text-gray-400">{workQueue.length} items requiring attention</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Regulation", "Decision state", "Applicability", "Coverage issue", "Owner", "Next step", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {workQueue.map((reg) => {
                const uncoveredCount = reg.obligations.filter(
                  (o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial"
                ).length;
                const notAssessed = reg.obligations.filter((o) => o.coverageStatus === "Not assessed").length;
                const issue =
                  notAssessed > 0
                    ? `${notAssessed} obligation${notAssessed > 1 ? "s" : ""} not assessed`
                    : uncoveredCount > 0
                    ? `${uncoveredCount} uncovered obligation${uncoveredCount > 1 ? "s" : ""}`
                    : reg.policyCoverage < 50
                    ? "Policy gap"
                    : "Incomplete rationale";
                const next =
                  reg.decisionState === "Draft" && notAssessed > 0
                    ? "Assess coverage"
                    : reg.decisionState === "Draft"
                    ? "Review rationale"
                    : "Add evidence";

                return (
                  <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-gray-900">{reg.title}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={decisionBadge(reg.decisionState)}>{reg.decisionState}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={applicabilityBadge(reg.applicability)}>{reg.applicability}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{issue}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{reg.assignee}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-amber-700 font-medium">{next}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onOpenRecord(reg.id)}
                        className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
                      >
                        Open record <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Mapping Table ─────────────────────────────────────────────────────────────

type MappingFilter =
  | "all"
  | "incomplete-rationale"
  | "uncovered"
  | "draft"
  | "approved"
  | "policy-gap"
  | "control-gap"
  | "applicable";

function MappingTable({
  regulations,
  onOpenRecord,
  activeFilter,
  setActiveFilter,
}: {
  regulations: RegulationMapping[];
  onOpenRecord: (id: string) => void;
  activeFilter: MappingFilter;
  setActiveFilter: (f: MappingFilter) => void;
}) {
  const [search, setSearch] = useState("");

  const filters: { id: MappingFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "incomplete-rationale", label: "Incomplete rationale" },
    { id: "uncovered", label: "Uncovered obligations" },
    { id: "draft", label: "Unreviewed" },
    { id: "approved", label: "Approved" },
    { id: "policy-gap", label: "Policy gap" },
    { id: "control-gap", label: "Control gap" },
  ];

  const filtered = regulations.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "incomplete-rationale" && !r.humanRationale) ||
      (activeFilter === "uncovered" &&
        r.obligations.some((o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial")) ||
      (activeFilter === "draft" && r.decisionState === "Draft") ||
      (activeFilter === "approved" && r.decisionState === "Approved") ||
      (activeFilter === "policy-gap" && r.policyCoverage < 50) ||
      (activeFilter === "control-gap" && r.controlCoverage < 50) ||
      (activeFilter === "applicable" && r.applicability === "Applicable");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search bar row — matching Cardamon style */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search regulations…"
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                activeFilter === f.id
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {activeFilter !== "all" && (
        <div className="px-5 py-1.5 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs text-indigo-700 font-medium">
            Filtered: {filters.find((f) => f.id === activeFilter)?.label}
          </span>
          <button onClick={() => setActiveFilter("all")} className="text-xs text-indigo-400 hover:text-indigo-700 underline ml-1">
            Clear
          </button>
        </div>
      )}

      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <tr>
              <th className="w-8 px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              {[
                "Regulation",
                "Applicability",
                "Inherent Risk",
                "Type",
                "Risk Tags",
                "Controls",
                "Policies",
                "Assignee",
                "Approved",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap"
                >
                  {h && (
                    <span className="flex items-center gap-1">
                      {h}
                      {["Applicability", "Inherent Risk", "Type", "Risk Tags", "Controls", "Policies", "Assignee", "Approved"].includes(h) && (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((reg) => {
              const hasGap = reg.obligations.some(
                (o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial"
              );
              const uncoveredOblCount = reg.obligations.filter(
                (o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial"
              ).length;
              return (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-3 py-3.5 max-w-[220px]">
                    <div className="flex items-start gap-1.5">
                      {hasGap && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="text-xs font-medium text-gray-900 leading-snug">{reg.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{reg.regulator}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-1">
                      <Badge className={applicabilityBadge(reg.applicability)}>
                        {reg.applicability === "Partially applicable" ? "Partial" : reg.applicability}
                      </Badge>
                      <Check className="w-3 h-3 text-gray-300" />
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge className={riskBadge(reg.risk)}>{reg.risk}</Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-300">{reg.type}</Badge>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-gray-400">—</td>
                  <td className="px-3 py-3.5">
                    <div className="space-y-0.5">
                      <CoverageBar value={reg.controlCoverage} />
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    {reg.policyCoverage < 30 ? (
                      <span className="text-xs text-gray-400">Policies not required</span>
                    ) : (
                      <CoverageBar value={reg.policyCoverage} />
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-xs text-gray-500">
                    {reg.assignee === "Unassigned" ? (
                      <span className="text-gray-300">Unassigned</span>
                    ) : (
                      reg.assignee
                    )}
                  </td>
                  <td className="px-3 py-3.5">
                    <Badge className={reg.decisionState === "Approved" ? applicabilityBadge("Applicable") : pendingBadge()}>
                      {reg.decisionState === "Approved" ? "Approved" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => onOpenRecord(reg.id)}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap"
                    >
                      Open <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-sm text-gray-400">
                  No regulations match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between">
          <span>0 of {filtered.length} row(s) selected.</span>
          <span>{filtered.length} rows displayed</span>
        </div>
      </div>
    </div>
  );
}

// ─── Create Action Drawer ─────────────────────────────────────────────────────

function ActionDrawer({
  obligation,
  regulation,
  onClose,
  onCreate,
}: {
  obligation: Obligation;
  regulation: RegulationMapping;
  onClose: () => void;
  onCreate: (action: DownstreamAction) => void;
}) {
  const [title, setTitle] = useState(
    `Create coverage for: ${obligation.text.slice(0, 55)}…`
  );
  const [owner, setOwner] = useState(regulation.assignee);
  const [destination, setDestination] = useState<"GRC issue" | "Policy workflow" | "Export">("GRC issue");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [dueDate, setDueDate] = useState("2026-06-30");

  const handleCreate = () => {
    const action: DownstreamAction = {
      id: `action-${Date.now()}`,
      title,
      sourceRegulation: regulation.title,
      sourceObligation: obligation.text,
      gapReason: obligation.reasonCode || "Real gap requiring downstream remediation",
      owner,
      destination,
      status: "Created",
      evidenceExpected: ["Updated policy", "Control mapping", "Approval record"],
      dueDate,
      priority,
    };
    onCreate(action);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Create downstream action</h2>
            <p className="text-xs text-gray-400 mt-0.5">Linked to a coverage gap</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-1.5">
            <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wide">Source gap</p>
            <p className="text-xs font-medium text-gray-900">{regulation.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{obligation.text}</p>
            <Badge className="bg-red-100 text-red-600 border border-red-200 mt-1">
              {obligation.reasonCode || "Gap requiring remediation"}
            </Badge>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Action title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Suggested owner</label>
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Destination</label>
            <div className="grid grid-cols-3 gap-2">
              {(["GRC issue", "Policy workflow", "Export"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDestination(d)}
                  className={`px-2 py-2 rounded-md text-xs font-medium border transition-colors ${
                    destination === d
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")}
                className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Evidence expected</label>
            <div className="space-y-1.5">
              {["Updated policy", "Control mapping", "Approval record"].map((e) => (
                <div key={e} className="flex items-center gap-2 text-xs text-gray-500">
                  <Circle className="w-3.5 h-3.5 text-gray-300" />
                  {e}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
            <p className="text-xs font-medium text-amber-800">Important</p>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Creating this action does not close the coverage gap. It initiates remediation and links the action to the Decision Record.
            </p>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-200 flex gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Create action
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Decision Record ───────────────────────────────────────────────────────────

const CHAT_PROMPTS = [
  "Why is this applicable?",
  "Explain the source",
  "What evidence supports this?",
  "What is not covered?",
  "Challenge this decision",
];

function DecisionRecord({
  regulation: initialReg,
  regulations,
  setRegulations,
  onCreateAction,
  onBack,
  showToast,
  actionObligationIds,
}: {
  regulation: RegulationMapping;
  regulations: RegulationMapping[];
  setRegulations: React.Dispatch<React.SetStateAction<RegulationMapping[]>>;
  onCreateAction: (obl: Obligation, reg: RegulationMapping) => void;
  onBack: () => void;
  showToast: (msg: string) => void;
  actionObligationIds: Set<string>;
}) {
  const reg = regulations.find((r) => r.id === initialReg.id) || initialReg;

  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryDraft, setSummaryDraft] = useState(reg.humanSummary);
  const [rationale, setRationale] = useState("");
  const [showRationale, setShowRationale] = useState(false);
  const [pendingField, setPendingField] = useState<"summary" | "applicability" | null>(null);
  const [applicabilityDraft, setApplicabilityDraft] = useState<Applicability>(reg.applicability);
  const [chatPrompt, setChatPrompt] = useState<string | null>(null);

  const updateReg = (updater: (r: RegulationMapping) => RegulationMapping) => {
    setRegulations((prev) => prev.map((r) => (r.id === reg.id ? updater(r) : r)));
  };

  const addAudit = (event: Omit<AuditEvent, "id">) => {
    updateReg((r) => ({
      ...r,
      auditHistory: [...r.auditHistory, { ...event, id: `aud-${Date.now()}` }],
    }));
  };

  const handleSaveSummary = () => {
    if (!rationale.trim()) return;
    updateReg((r) => ({ ...r, humanSummary: summaryDraft }));
    addAudit({
      actor: "Maya Patel",
      action: "Human summary edited",
      timestamp: new Date().toISOString(),
      before: reg.humanSummary,
      after: summaryDraft,
      rationale,
    });
    setEditingSummary(false);
    setShowRationale(false);
    setRationale("");
    setPendingField(null);
    showToast("Summary saved and audit record updated.");
  };

  const handleApplicabilityChange = (val: Applicability) => {
    setApplicabilityDraft(val);
    if (val !== reg.applicability) {
      setPendingField("applicability");
      setShowRationale(true);
    }
  };

  const handleSaveApplicability = () => {
    if (!rationale.trim()) return;
    updateReg((r) => ({ ...r, applicability: applicabilityDraft }));
    addAudit({
      actor: "Maya Patel",
      action: "Applicability changed",
      timestamp: new Date().toISOString(),
      before: reg.applicability,
      after: applicabilityDraft,
      rationale,
    });
    setShowRationale(false);
    setRationale("");
    setPendingField(null);
    showToast("Applicability updated and recorded in audit history.");
  };

  const handleMoveToReviewed = () => {
    updateReg((r) => ({ ...r, decisionState: "Reviewed" }));
    addAudit({ actor: "Maya Patel", action: "Moved to Reviewed", timestamp: new Date().toISOString() });
    showToast("Decision moved to Reviewed.");
  };

  const handleApprove = () => {
    updateReg((r) => ({ ...r, decisionState: "Approved" }));
    addAudit({
      actor: "Maya Patel",
      action: "Decision Approved",
      timestamp: new Date().toISOString(),
      rationale: "Approved by Head of Compliance following review.",
    });
    showToast("Decision approved. Audit record updated.");
  };

  const checklistItems = [
    { label: "AI output preserved", done: true },
    { label: "Human rationale captured", done: !!reg.humanRationale },
    { label: "Obligations mapped", done: reg.obligations.length > 0 },
    { label: "Coverage assessed", done: reg.obligations.every((o) => o.coverageStatus !== "Not assessed") },
    { label: "Evidence linked", done: reg.obligations.some((o) => o.evidence.length > 0) },
    { label: "Audit history complete", done: reg.auditHistory.length > 2 },
    { label: "Approved decision", done: reg.decisionState === "Approved" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Record header bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-shrink-0 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700">
          <RotateCcw className="w-3 h-3" /> Back
        </button>
        <span className="text-gray-200">|</span>
        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-sm font-semibold text-gray-900 truncate">{reg.title}</span>
          <Badge className={applicabilityBadge(reg.applicability)}>{reg.applicability}</Badge>
          <Badge className={riskBadge(reg.risk)}>{reg.risk} risk</Badge>
          <Badge className={decisionBadge(reg.decisionState)}>{reg.decisionState}</Badge>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {reg.decisionState === "Draft" && (
            <button onClick={handleMoveToReviewed} className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
              Move to Reviewed
            </button>
          )}
          {reg.decisionState !== "Approved" && (
            <button onClick={handleApprove} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
              Approve
            </button>
          )}
          <button onClick={() => showToast("Audit pack exported (simulated).")} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">
            <ExternalLink className="w-3 h-3" /> Export audit history
          </button>
        </div>
      </div>

      {/* Two-column content */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* Left */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-w-0">

          {/* Source & Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Source &amp; Summary</h3>
              <div className="flex items-center gap-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium border border-indigo-100">AI-generated</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium border border-gray-200">Human-edited</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-indigo-600 mb-1.5 flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-indigo-50 rounded border border-indigo-100">AI-generated</span>
              </p>
              <p className="text-xs text-gray-600 leading-relaxed bg-blue-50 px-3 py-3 rounded-md border border-blue-100">
                {reg.aiSummary}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold text-gray-500 mb-1.5 flex items-center gap-1">
                <span className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">Human-edited</span>
              </p>
              {editingSummary ? (
                <div className="space-y-2">
                  <textarea
                    value={summaryDraft}
                    onChange={(e) => setSummaryDraft(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-xs border border-indigo-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                  {!showRationale ? (
                    <div className="flex gap-2">
                      <button onClick={() => { setPendingField("summary"); setShowRationale(true); }} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Save changes
                      </button>
                      <button onClick={() => { setEditingSummary(false); setSummaryDraft(reg.humanSummary); }} className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600">
                        Cancel
                      </button>
                    </div>
                  ) : pendingField === "summary" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2">
                      <p className="text-xs font-medium text-amber-800">Rationale required</p>
                      <textarea
                        placeholder="Why are you making this change?"
                        value={rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 text-xs border border-amber-200 rounded focus:outline-none resize-none"
                      />
                      <button onClick={handleSaveSummary} disabled={!rationale.trim()} className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md disabled:opacity-50">
                        Confirm &amp; save
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="group relative">
                  <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 px-3 py-3 rounded-md border border-gray-200">
                    {reg.humanSummary}
                  </p>
                  <button onClick={() => setEditingSummary(true)} className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Applicability */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Applicability</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">AI suggested</p>
                <Badge className={applicabilityBadge(reg.aiApplicability)}>{reg.aiApplicability}</Badge>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1.5">Current decision</p>
                <div className="flex flex-wrap gap-1">
                  {(["Applicable", "Partially applicable", "Not applicable"] as Applicability[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleApplicabilityChange(opt)}
                      className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                        applicabilityDraft === opt
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {opt === "Partially applicable" ? "Partial" : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {showRationale && pendingField === "applicability" && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 space-y-2">
                <p className="text-xs font-medium text-amber-800">Rationale required to change applicability</p>
                <textarea
                  placeholder="Why are you changing the applicability?"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  rows={2}
                  className="w-full px-2 py-1.5 text-xs border border-amber-200 rounded focus:outline-none resize-none"
                />
                <button onClick={handleSaveApplicability} disabled={!rationale.trim()} className="px-3 py-1.5 text-xs bg-amber-600 text-white rounded-md disabled:opacity-50">
                  Confirm &amp; save
                </button>
              </div>
            )}

            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Human rationale</p>
              <p className="text-xs text-gray-600 leading-relaxed">{reg.humanRationale}</p>
            </div>
          </div>

          {/* Obligations */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Obligations &amp; coverage
              <span className="ml-2 text-xs font-normal text-gray-400">{reg.obligations.length} obligations</span>
            </h3>
            <div className="space-y-3">
              {reg.obligations.map((obl) => {
                const hasActionCreated = actionObligationIds.has(obl.id);
                return (
                  <div
                    key={obl.id}
                    className={`rounded-lg border p-3 space-y-2.5 ${
                      obl.coverageStatus === "Not covered" ? "border-red-200 bg-red-50" :
                      obl.coverageStatus === "Partial" ? "border-amber-200 bg-amber-50" :
                      obl.coverageStatus === "Not assessed" ? "border-gray-200 bg-gray-50" :
                      "border-green-200 bg-green-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs text-gray-900 font-medium leading-relaxed">{obl.text}</p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge className={coverageBadge(obl.coverageStatus)}>{obl.coverageStatus}</Badge>
                        {hasActionCreated && (
                          <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">Action created</Badge>
                        )}
                      </div>
                    </div>
                    {obl.reasonCode && (
                      <p className="text-[10px] text-gray-500 italic">{obl.reasonCode}</p>
                    )}
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wide mb-1">Policies</p>
                        {obl.linkedPolicies.length > 0
                          ? obl.linkedPolicies.map((p) => <p key={p} className="text-gray-600 truncate">{p}</p>)
                          : <p className="text-red-500">None linked</p>}
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wide mb-1">Controls</p>
                        {obl.linkedControls.length > 0
                          ? obl.linkedControls.map((c) => <p key={c} className="text-gray-600 truncate">{c}</p>)
                          : <p className="text-red-500">None linked</p>}
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase tracking-wide mb-1">Evidence</p>
                        {obl.evidence.length > 0
                          ? obl.evidence.map((e) => <p key={e} className="text-gray-600 truncate">{e}</p>)
                          : <p className="text-red-500">None linked</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-indigo-600 border border-gray-200 px-2 py-1 rounded bg-white">
                        <Plus className="w-3 h-3" /> Add evidence
                      </button>
                      {(obl.coverageStatus === "Not covered" || obl.coverageStatus === "Partial") && !hasActionCreated && (
                        <button
                          onClick={() => onCreateAction(obl, reg)}
                          className="flex items-center gap-1 text-[10px] text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded font-medium"
                        >
                          <ArrowRight className="w-3 h-3" /> Create downstream action
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit history */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Audit history</h3>
            <div className="relative pl-5">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-4">
                {[...reg.auditHistory].reverse().map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-200 border-2 border-white" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-900">{evt.action}</span>
                        {evt.actor === "Cardamon AI" && (
                          <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">AI-generated</span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {evt.actor} · {new Date(evt.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                      {(evt.before || evt.after) && (
                        <p className="text-[10px] text-gray-500 mt-0.5">{evt.before} → {evt.after}</p>
                      )}
                      {evt.rationale && (
                        <p className="text-[10px] text-gray-500 italic mt-0.5">"{evt.rationale}"</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-64 flex-shrink-0 border-l border-gray-200 overflow-y-auto p-4 space-y-4 bg-white">
          {/* Contextual assistant */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Contextual assistant</h3>
            <div className="flex flex-wrap gap-1.5">
              {CHAT_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setChatPrompt(chatPrompt === p ? null : p)}
                  className={`px-2 py-1 rounded-full text-[10px] font-medium border transition-colors ${
                    chatPrompt === p
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {chatPrompt && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                <p className="text-[10px] font-semibold text-blue-700 mb-1.5">{chatPrompt}</p>
                <p className="text-xs text-gray-700 leading-relaxed">{CONTEXTUAL_CHAT_RESPONSES[chatPrompt]}</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Governance checklist</h3>
            {checklistItems.map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                {done
                  ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                <span className={`text-xs ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Record details</h3>
            {[
              { label: "Regulator", value: reg.regulator },
              { label: "Jurisdiction", value: reg.jurisdiction },
              { label: "Type", value: reg.type },
              { label: "Assignee", value: reg.assignee },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide flex-shrink-0">{label}</span>
                <span className="text-xs text-gray-700 text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Actions View ─────────────────────────────────────────────────────────────

function ActionsView({ actions }: { actions: DownstreamAction[] }) {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Downstream Actions
          <span className="ml-2 text-xs font-normal text-gray-400">{actions.length} total</span>
        </h2>
      </div>

      {actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Zap className="w-10 h-10 text-gray-200 mb-3" />
          <p className="text-sm font-medium text-gray-500">No downstream actions created yet.</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Create one from an uncovered obligation in a Decision Record.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {["Action", "Source regulation", "Obligation", "Owner", "Destination", "Priority", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {actions.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-xs font-medium text-gray-900 leading-snug">{a.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Due {a.dueDate}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px]">
                    <span className="truncate block">{a.sourceRegulation}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px]">
                    <span className="truncate block">{a.sourceObligation}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">{a.owner}</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-purple-100 text-purple-700 border border-purple-200">{a.destination}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={riskBadge(a.priority)}>{a.priority}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={a.status === "Pushed downstream" ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"}>
                      {a.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Placeholder({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Icon className="w-10 h-10 text-gray-200 mb-3" />
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1">This section is not part of the prototype scope.</p>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [viewScope, setViewScope] = useState<ViewScope>("my");
  const [regulations, setRegulations] = useState<RegulationMapping[]>(MOCK_REGULATIONS);
  const [actions, setActions] = useState<DownstreamAction[]>(INITIAL_ACTIONS);
  const [selectedRegId, setSelectedRegId] = useState<string | null>(null);
  const [mappingFilter, setMappingFilter] = useState<MappingFilter>("all");
  const [toast, setToast] = useState<string | null>(null);
  const [actionObligationIds, setActionObligationIds] = useState<Set<string>>(new Set());
  const [drawerState, setDrawerState] = useState<{ obl: Obligation; reg: RegulationMapping } | null>(null);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const handleOpenRecord = (id: string) => {
    setSelectedRegId(id);
    setActiveView("records");
  };

  const handleFilteredMapping = (filter: string) => {
    setMappingFilter(filter as MappingFilter);
    setActiveView("mapping");
  };

  const handleCreateAction = (obl: Obligation, reg: RegulationMapping) => {
    setDrawerState({ obl, reg });
  };

  const handleActionCreated = (action: DownstreamAction) => {
    setActions((prev) => [...prev, action]);
    setActionObligationIds((prev) => {
      const next = new Set(prev);
      next.add(drawerState!.obl.id);
      return next;
    });
    setRegulations((prev) =>
      prev.map((r) => {
        if (r.id !== drawerState!.reg.id) return r;
        return {
          ...r,
          auditHistory: [
            ...r.auditHistory,
            {
              id: `aud-action-${Date.now()}`,
              actor: "Maya Patel",
              action: "Downstream action created for uncovered obligation",
              timestamp: new Date().toISOString(),
              after: action.title,
            },
          ],
        };
      })
    );
    setDrawerState(null);
    showToast("Action created and linked to Decision Record.");
  };

  const selectedReg = selectedRegId ? regulations.find((r) => r.id === selectedRegId) || null : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        active={activeView}
        setActive={(v) => {
          setActiveView(v);
          if (v !== "records") setSelectedRegId(null);
        }}
      />

      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        <TopBar viewScope={viewScope} setViewScope={setViewScope} />

        <main className="flex-1 overflow-hidden bg-gray-50">
          {activeView === "dashboard" && (
            <Dashboard
              regulations={regulations}
              onOpenRecord={handleOpenRecord}
              onFilteredMapping={handleFilteredMapping}
              viewScope={viewScope}
            />
          )}

          {activeView === "mapping" && (
            <MappingTable
              regulations={regulations}
              onOpenRecord={handleOpenRecord}
              activeFilter={mappingFilter}
              setActiveFilter={setMappingFilter}
            />
          )}

          {activeView === "records" && selectedReg ? (
            <DecisionRecord
              regulation={selectedReg}
              regulations={regulations}
              setRegulations={setRegulations}
              onCreateAction={handleCreateAction}
              onBack={() => setActiveView("mapping")}
              showToast={showToast}
              actionObligationIds={actionObligationIds}
            />
          ) : activeView === "records" && !selectedReg ? (
            <MappingTable
              regulations={regulations}
              onOpenRecord={handleOpenRecord}
              activeFilter="all"
              setActiveFilter={() => {}}
            />
          ) : null}

          {activeView === "actions" && <ActionsView actions={actions} />}
          {activeView === "statements" && <Placeholder title="Policy Statements" icon={AlignLeft} />}
        </main>
      </div>

      {drawerState && (
        <ActionDrawer
          obligation={drawerState.obl}
          regulation={drawerState.reg}
          onClose={() => setDrawerState(null)}
          onCreate={handleActionCreated}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
