"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, BookOpen, AlignLeft, Building2, Search,
  ChevronDown, ChevronRight, X, Check, AlertTriangle,
  ExternalLink, Plus, Edit3, RotateCcw, ArrowRight,
  AlertCircle, Info, CheckCircle2, Circle, TrendingUp,
  Zap, MessageSquare, Users,
} from "lucide-react";

import {
  MOCK_REGULATIONS, INITIAL_ACTIONS, CONTEXTUAL_CHAT_RESPONSES,
  TEAM_MEMBERS, STAGE_SEQUENCE,
  type RegulationMapping, type Obligation, type AuditEvent,
  type DownstreamAction, type DecisionState, type Applicability,
  type CoverageStatus, type AssignmentStage,
} from "@/lib/mockData";

// ─── Badges ──────────────────────────────────────────────────────────────────

function decisionBadge(s: DecisionState) {
  return { Draft: "bg-transparent text-gray-500 border border-gray-300", Reviewed: "bg-transparent text-blue-600 border border-blue-400", Approved: "bg-transparent text-green-600 border border-green-400", Superseded: "bg-transparent text-purple-600 border border-purple-400" }[s];
}
function applicabilityBadge(a: Applicability) {
  return { Applicable: "bg-green-100 text-green-700 border border-green-300", "Partially applicable": "bg-amber-100 text-amber-700 border border-amber-300", "Not applicable": "bg-red-100 text-red-600 border border-red-300" }[a];
}
function riskBadge(r: string) {
  return r === "High" ? "bg-orange-100 text-orange-700 border border-orange-300" : r === "Medium" ? "bg-amber-100 text-amber-700 border border-amber-300" : "bg-green-100 text-green-700 border border-green-300";
}
function coverageBadge(s: CoverageStatus) {
  return { Covered: "bg-green-100 text-green-700 border border-green-300", Partial: "bg-amber-100 text-amber-700 border border-amber-300", "Not covered": "bg-red-100 text-red-600 border border-red-300", "Not assessed": "bg-transparent text-gray-400 border border-gray-300" }[s];
}
function Badge({ children, className }: { children: React.ReactNode; className: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>;
}
function CoverageBar({ value }: { value: number }) {
  const c = value >= 80 ? "bg-green-500" : value >= 50 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${c} rounded-full`} style={{ width: `${value}%` }} /></div>
      <span className="text-xs text-gray-400 w-7 text-right">{value}%</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

type View = "dashboard" | "mapping" | "records" | "actions" | "statements";
const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "mapping" as View, label: "Regulations Mapping", icon: BookOpen },
  { id: "actions" as View, label: "Actions", icon: Zap },
  { id: "statements" as View, label: "Policy Statements", icon: AlignLeft },
];

function Sidebar({ active, setActive }: { active: View; setActive: (v: View) => void }) {
  return (
    <aside className="w-52 bg-[#1b2031] flex flex-col flex-shrink-0 h-full">
      <div className="px-4 py-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-white flex items-center justify-center"><span className="text-[#1b2031] text-sm font-bold">C</span></div>
        <span className="text-white text-sm font-semibold tracking-tight">Cardamon</span>
      </div>
      <nav className="flex-1 px-2 py-2 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left mb-0.5 ${active === id ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}>
            <Icon className={`w-4 h-4 flex-shrink-0 ${active === id ? "text-white" : "text-gray-500"}`} />{label}
          </button>
        ))}
      </nav>
      <div className="px-3 py-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-indigo-400 flex items-center justify-center"><span className="text-white text-[10px] font-semibold">MP</span></div>
          <p className="text-xs font-medium text-gray-200 truncate">Maya Patel</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Top bar ─────────────────────────────────────────────────────────────────

type ViewScope = "my" | "team" | "all";
function TopBar({ viewScope, setViewScope }: { viewScope: ViewScope; setViewScope: (s: ViewScope) => void }) {
  return (
    <div className="bg-white border-b border-gray-200 px-5 py-2.5 flex items-center gap-3 flex-shrink-0">
      <div className="flex items-center gap-1.5 text-sm text-gray-700 font-medium cursor-pointer">
        <Building2 className="w-4 h-4 text-gray-400" />Wise US Inc<ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="flex-1" />
      <div className="flex items-center bg-gray-100 rounded-md p-0.5">
        {(["my", "team", "all"] as ViewScope[]).map((s) => (
          <button key={s} onClick={() => setViewScope(s)} className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${viewScope === s ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {s === "my" ? "My View" : s === "team" ? "Team View" : "All"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-xl text-sm max-w-sm">
      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /><span>{message}</span>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── KPI Cards ───────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, onClick, accent }: { label: string; value: string | number; sub?: string; onClick?: () => void; accent?: string }) {
  return (
    <button onClick={onClick} className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all group flex-1 min-w-0">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent || "text-gray-900"} group-hover:text-indigo-700 transition-colors`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </button>
  );
}

function RegKpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 text-left">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide leading-tight">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent || "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const SCOPE_METRICS: Record<ViewScope, { mapped: number; applicablePct: number; applicableOf: number; approvedPct: number; approvedCount: number; policyPct: number; policyOf: number; controlPct: number; controlOf: number; openGaps: number; unreviewed: number; decisionCounts: Record<string, number>; gapBreakdown: { label: string; count: number; color: string }[] }> = {
  my: { mapped: 7, applicablePct: 71, applicableOf: 5, approvedPct: 29, approvedCount: 2, policyPct: 38, policyOf: 2, controlPct: 52, controlOf: 3, openGaps: 7, unreviewed: 3, decisionCounts: { Draft: 3, Reviewed: 2, Approved: 2, Superseded: 0 }, gapBreakdown: [{ label: "Policy gap", count: 3, color: "bg-red-400" }, { label: "Control gap", count: 2, color: "bg-amber-400" }, { label: "Evidence missing", count: 3, color: "bg-orange-400" }, { label: "Not assessed", count: 3, color: "bg-gray-300" }] },
  team: { mapped: 42, applicablePct: 64, applicableOf: 27, approvedPct: 45, approvedCount: 19, policyPct: 51, policyOf: 14, controlPct: 63, controlOf: 17, openGaps: 23, unreviewed: 11, decisionCounts: { Draft: 11, Reviewed: 12, Approved: 19, Superseded: 0 }, gapBreakdown: [{ label: "Policy gap", count: 9, color: "bg-red-400" }, { label: "Control gap", count: 7, color: "bg-amber-400" }, { label: "Evidence missing", count: 10, color: "bg-orange-400" }, { label: "Not assessed", count: 8, color: "bg-gray-300" }] },
  all: { mapped: 355, applicablePct: 62, applicableOf: 220, approvedPct: 41, approvedCount: 146, policyPct: 38, policyOf: 84, controlPct: 27, controlOf: 59, openGaps: 48, unreviewed: 23, decisionCounts: { Draft: 23, Reviewed: 186, Approved: 146, Superseded: 0 }, gapBreakdown: [{ label: "Policy gap", count: 18, color: "bg-red-400" }, { label: "Control gap", count: 14, color: "bg-amber-400" }, { label: "Evidence missing", count: 21, color: "bg-orange-400" }, { label: "Not assessed", count: 12, color: "bg-gray-300" }] },
};

function Dashboard({ regulations, onOpenRecord, onFilteredMapping, viewScope }: { regulations: RegulationMapping[]; onOpenRecord: (id: string) => void; onFilteredMapping: (f: string) => void; viewScope: ViewScope }) {
  const m = SCOPE_METRICS[viewScope];
  const workQueue = regulations.filter((r) => r.workflow.currentAssignee === "Maya Patel");
  return (
    <div className="overflow-y-auto h-full p-5 space-y-5">
      <div className="flex gap-3">
        <KpiCard label="Applicable" value={`${m.applicablePct}%`} sub={`${m.applicableOf} of ${m.mapped} items`} onClick={() => onFilteredMapping("all")} />
        <KpiCard label="Control Coverage" value={`${m.controlPct}%`} sub={`${m.controlOf} of ${m.applicableOf} applicable`} accent={m.controlPct < 50 ? "text-red-600" : "text-gray-900"} onClick={() => onFilteredMapping("control-gap")} />
        <KpiCard label="Policy Coverage" value={`${m.policyPct}%`} sub={`${m.policyOf} of ${m.applicableOf} applicable`} accent={m.policyPct < 50 ? "text-red-600" : "text-gray-900"} onClick={() => onFilteredMapping("policy-gap")} />
        <KpiCard label="Approved Decisions" value={`${m.approvedPct}%`} sub={`${m.approvedCount} of ${m.mapped} mapped`} accent="text-green-700" onClick={() => onFilteredMapping("approved")} />
        <KpiCard label="Open Coverage Gaps" value={m.openGaps} sub="obligations needing action" accent="text-red-600" onClick={() => onFilteredMapping("uncovered")} />
        <KpiCard label="Unreviewed" value={m.unreviewed} sub="in Draft state" accent={m.unreviewed > 0 ? "text-amber-600" : "text-green-600"} onClick={() => onFilteredMapping("draft")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-indigo-500" />Decision lifecycle</h3>
          <div className="space-y-3">
            {Object.entries(m.decisionCounts).map(([state, count]) => {
              const bar = state === "Approved" ? "bg-green-500" : state === "Reviewed" ? "bg-blue-500" : state === "Draft" ? "bg-gray-300" : "bg-purple-400";
              const max = Math.max(...Object.values(m.decisionCounts), 1);
              return (
                <div key={state} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20 flex-shrink-0">{state}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${bar} rounded-full transition-all duration-500`} style={{ width: `${(count / max) * 100}%` }} /></div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-500" />Gap breakdown</h3>
          <div className="space-y-3">
            {m.gapBreakdown.map(({ label, count, color }) => {
              const max = Math.max(...m.gapBreakdown.map((g) => g.count), 1);
              return (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${(count / max) * 100}%` }} /></div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Work queue</h3>
          <span className="text-xs text-gray-400">{workQueue.length} items assigned to you</span>
        </div>
        {workQueue.length === 0 ? (
          <div className="py-12 text-center"><CheckCircle2 className="w-8 h-8 text-green-200 mx-auto mb-2" /><p className="text-sm text-gray-400">No items currently assigned to you.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  {["Regulation", "Stage", "Decision state", "Coverage issue", "Next step", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {workQueue.map((reg) => {
                  const notAssessed = reg.obligations.filter((o) => o.coverageStatus === "Not assessed").length;
                  const uncovered = reg.obligations.filter((o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial").length;
                  const issue = notAssessed > 0 ? `${notAssessed} not assessed` : uncovered > 0 ? `${uncovered} uncovered` : reg.policyCoverage < 50 ? "Policy gap" : "Incomplete rationale";
                  const next = reg.workflow.currentStage === "Applicability" ? "Assess applicability" : reg.workflow.currentStage === "Obligations" ? "Review obligations" : reg.workflow.currentStage === "Controls & Evidence" ? "Map controls & evidence" : "Approve decision";
                  return (
                    <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium text-gray-900 max-w-[180px]">{reg.title}</td>
                      <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">{reg.workflow.currentStage}</span></td>
                      <td className="px-4 py-3"><Badge className={decisionBadge(reg.decisionState)}>{reg.decisionState}</Badge></td>
                      <td className="px-4 py-3 text-xs text-gray-600">{issue}</td>
                      <td className="px-4 py-3 text-xs text-amber-700 font-medium">{next}</td>
                      <td className="px-4 py-3"><button onClick={() => onOpenRecord(reg.id)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">Open record <ChevronRight className="w-3 h-3" /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mapping Table ────────────────────────────────────────────────────────────

type MappingFilter = "all" | "not-assessed" | "uncovered" | "draft" | "approved" | "policy-gap" | "control-gap";

// Small inline stat cell used in mapping table rows
function StatCell({ value, total, good }: { value: number; total: number; good?: boolean }) {
  const isComplete = value === total && total > 0;
  const isNone = value === 0;
  const color = good !== false && isComplete ? "text-green-700" : isNone && total > 0 ? "text-red-500" : "text-amber-600";
  return (
    <div>
      <span className={`text-sm font-semibold ${color}`}>{value}</span>
      <span className="text-[10px] text-gray-400 ml-0.5">/{total}</span>
    </div>
  );
}

function CountCell({ value }: { value: number }) {
  return <span className={`text-sm font-semibold ${value > 0 ? "text-green-700" : "text-gray-300"}`}>{value}</span>;
}

function MappingTable({ regulations, onOpenRecord, activeFilter, setActiveFilter }: { regulations: RegulationMapping[]; onOpenRecord: (id: string) => void; activeFilter: MappingFilter; setActiveFilter: (f: MappingFilter) => void }) {
  const [search, setSearch] = useState("");
  const filters: { id: MappingFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "not-assessed", label: "Not fully assessed" },
    { id: "uncovered", label: "Uncovered obligations" },
    { id: "draft", label: "Unreviewed" },
    { id: "approved", label: "Approved" },
    { id: "policy-gap", label: "Policy gap" },
    { id: "control-gap", label: "Control gap" },
  ];
  const filtered = regulations.filter((r) => {
    const s = r.title.toLowerCase().includes(search.toLowerCase());
    const assessed = r.obligations.filter((o) => o.coverageStatus !== "Not assessed").length;
    const uniquePolicies = [...new Set(r.obligations.flatMap((o) => o.linkedPolicies))];
    const uniqueControls = [...new Set(r.obligations.flatMap((o) => o.linkedControls))];
    const f =
      activeFilter === "all" ||
      (activeFilter === "not-assessed" && assessed < r.obligations.length) ||
      (activeFilter === "uncovered" && r.obligations.some((o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial")) ||
      (activeFilter === "draft" && r.decisionState === "Draft") ||
      (activeFilter === "approved" && r.decisionState === "Approved") ||
      (activeFilter === "policy-gap" && uniquePolicies.length === 0) ||
      (activeFilter === "control-gap" && uniqueControls.length === 0);
    return s && f;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-3 bg-white border-b border-gray-200 flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search regulations…" className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full bg-white" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${activeFilter === f.id ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{f.label}</button>
          ))}
        </div>
      </div>
      {activeFilter !== "all" && (
        <div className="px-5 py-1.5 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs text-indigo-700 font-medium">Filtered: {filters.find((f) => f.id === activeFilter)?.label}</span>
          <button onClick={() => setActiveFilter("all")} className="text-xs text-indigo-400 hover:text-indigo-700 underline ml-1">Clear</button>
        </div>
      )}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <tr>
              <th className="w-8 px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></th>
              {[
                { label: "Regulation", sort: false },
                { label: "Requirements", sort: false },
                { label: "Assessed", sort: true },
                { label: "Covered", sort: true },
                { label: "Policies", sort: true },
                { label: "Controls", sort: true },
                { label: "Stage", sort: true },
                { label: "Assignee", sort: true },
                { label: "Status", sort: true },
                { label: "", sort: false },
              ].map(({ label, sort }) => (
                <th key={label} className="px-3 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
                  {label && <span className="flex items-center gap-1">{label}{sort && <ChevronDown className="w-3 h-3 text-gray-400" />}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((reg) => {
              const total = reg.obligations.length;
              const assessed = reg.obligations.filter((o) => o.coverageStatus !== "Not assessed").length;
              const covered = reg.obligations.filter((o) => o.coverageStatus === "Covered").length;
              const uniquePolicies = [...new Set(reg.obligations.flatMap((o) => o.linkedPolicies))].length;
              const uniqueControls = [...new Set(reg.obligations.flatMap((o) => o.linkedControls))].length;
              const hasGap = reg.obligations.some((o) => o.coverageStatus === "Not covered" || o.coverageStatus === "Partial");
              const notFullyAssessed = assessed < total;
              return (
                <tr key={reg.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onOpenRecord(reg.id)}>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-3 py-3.5 max-w-[240px]">
                    <div className="flex items-start gap-1.5">
                      {(hasGap || notFullyAssessed) && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
                      <div>
                        <p className="text-xs font-medium text-gray-900 leading-snug">{reg.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{reg.regulator}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="text-sm font-semibold text-gray-700">{total}</span>
                  </td>
                  <td className="px-3 py-3.5"><StatCell value={assessed} total={total} /></td>
                  <td className="px-3 py-3.5"><StatCell value={covered} total={assessed} /></td>
                  <td className="px-3 py-3.5"><CountCell value={uniquePolicies} /></td>
                  <td className="px-3 py-3.5"><CountCell value={uniqueControls} /></td>
                  <td className="px-3 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">{reg.workflow.currentStage}</span>
                  </td>
                  <td className="px-3 py-3.5 text-xs text-gray-600 whitespace-nowrap">{reg.workflow.currentAssignee}</td>
                  <td className="px-3 py-3.5">
                    <Badge className={reg.decisionState === "Approved" ? "bg-green-100 text-green-700 border border-green-300" : reg.decisionState === "Reviewed" ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-gray-100 text-gray-500 border border-gray-200"}>
                      {reg.decisionState}
                    </Badge>
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => onOpenRecord(reg.id)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">Open <ChevronRight className="w-3 h-3" /></button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={11} className="px-4 py-12 text-center text-sm text-gray-400">No regulations match the current filter.</td></tr>}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400 flex justify-between">
          <span>0 of {filtered.length} row(s) selected.</span><span>{filtered.length} rows displayed</span>
        </div>
      </div>
    </div>
  );
}

// ─── Action Drawer ────────────────────────────────────────────────────────────

function ActionDrawer({ obligation, regulation, onClose, onCreate }: { obligation: Obligation; regulation: RegulationMapping; onClose: () => void; onCreate: (a: DownstreamAction) => void }) {
  const [title, setTitle] = useState(`Create coverage for: ${obligation.text.slice(0, 55)}…`);
  const [owner, setOwner] = useState(regulation.assignee);
  const [destination, setDestination] = useState<"GRC issue" | "Policy workflow" | "Export">("GRC issue");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("High");
  const [dueDate, setDueDate] = useState("2026-06-30");
  const handleCreate = () => {
    onCreate({ id: `action-${Date.now()}`, title, sourceRegulation: regulation.title, sourceObligation: obligation.text, gapReason: obligation.reasonCode || "Real gap requiring downstream remediation", owner, destination, status: "Created", evidenceExpected: ["Updated policy", "Control mapping", "Approval record"], dueDate, priority, stageType: "Remediation" });
  };
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div><h2 className="text-sm font-semibold text-gray-900">Create downstream action</h2><p className="text-xs text-gray-400 mt-0.5">Linked to a coverage gap</p></div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 space-y-1.5">
            <p className="text-[10px] text-red-500 font-semibold uppercase tracking-wide">Source gap</p>
            <p className="text-xs font-medium text-gray-900">{regulation.title}</p>
            <p className="text-xs text-gray-600 leading-relaxed">{obligation.text}</p>
          </div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Action title</label><input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" /></div>
          <div><label className="block text-xs font-medium text-gray-700 mb-1">Suggested owner</label><input value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full px-3 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" /></div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Destination</label>
            <div className="grid grid-cols-3 gap-2">
              {(["GRC issue", "Policy workflow", "Export"] as const).map((d) => (
                <button key={d} onClick={() => setDestination(d)} className={`px-2 py-2 rounded-md text-xs font-medium border transition-colors ${destination === d ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:border-indigo-300"}`}>{d}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Priority</label><select value={priority} onChange={(e) => setPriority(e.target.value as "High" | "Medium" | "Low")} className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"><option>High</option><option>Medium</option><option>Low</option></select></div>
            <div><label className="block text-xs font-medium text-gray-700 mb-1">Due date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-2 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" /></div>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-3"><p className="text-xs font-medium text-amber-800">Important</p><p className="text-xs text-amber-700 mt-1 leading-relaxed">Creating this action does not close the coverage gap. It initiates remediation and links the action to this record.</p></div>
        </div>
        <div className="px-5 py-4 border-t border-gray-200 flex gap-2 flex-shrink-0">
          <button onClick={onClose} className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={handleCreate} className="flex-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">Create action</button>
        </div>
      </div>
    </div>
  );
}

// ─── Regulation Overview ──────────────────────────────────────────────────────

function RegulationOverview({ regulation: initialReg, regulations, setRegulations, onCreateAction, onBack, showToast, actionObligationIds }: { regulation: RegulationMapping; regulations: RegulationMapping[]; setRegulations: React.Dispatch<React.SetStateAction<RegulationMapping[]>>; onCreateAction: (obl: Obligation, reg: RegulationMapping) => void; onBack: () => void; showToast: (msg: string) => void; actionObligationIds: Set<string> }) {
  const reg = regulations.find((r) => r.id === initialReg.id) || initialReg;

  // Hand-off
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffAssignee, setHandoffAssignee] = useState("");
  const [handoffNote, setHandoffNote] = useState("");

  // Requirements accordion
  const [expandedOblId, setExpandedOblId] = useState<string | null>(null);
  const [oblChatPrompt, setOblChatPrompt] = useState<string | null>(null);

  // Comments
  const [commentDraft, setCommentDraft] = useState("");

  // Audit history
  const [auditExpanded, setAuditExpanded] = useState(false);

  // Applicability (right panel)
  const [applicabilityDraft, setApplicabilityDraft] = useState<Applicability>(reg.applicability);
  const [showRationale, setShowRationale] = useState(false);
  const [rationale, setRationale] = useState("");

  const updateReg = (updater: (r: RegulationMapping) => RegulationMapping) =>
    setRegulations((prev) => prev.map((r) => (r.id === reg.id ? updater(r) : r)));

  const addAudit = (event: Omit<AuditEvent, "id">) =>
    updateReg((r) => ({ ...r, auditHistory: [...r.auditHistory, { ...event, id: `aud-${Date.now()}` }] }));

  const handleHandoff = () => {
    if (!handoffAssignee) return;
    const idx = STAGE_SEQUENCE.indexOf(reg.workflow.currentStage);
    const nextStage = STAGE_SEQUENCE[Math.min(idx + 1, STAGE_SEQUENCE.length - 1)];
    updateReg((r) => ({
      ...r,
      workflow: {
        currentStage: nextStage,
        currentAssignee: handoffAssignee,
        history: [...r.workflow.history, { stage: r.workflow.currentStage, assignee: r.workflow.currentAssignee, completedAt: new Date().toISOString(), note: handoffNote || undefined }],
      },
    }));
    addAudit({ actor: "Maya Patel", action: `Record handed off to ${handoffAssignee} for ${nextStage}`, timestamp: new Date().toISOString(), rationale: handoffNote || undefined });
    showToast(`Record handed off to ${handoffAssignee}.`);
    setHandoffOpen(false); setHandoffAssignee(""); setHandoffNote("");
  };

  const handleSendComment = (oblId: string) => {
    if (!commentDraft.trim()) return;
    updateReg((r) => ({ ...r, obligations: r.obligations.map((o) => o.id === oblId ? { ...o, comments: [...o.comments, { id: `c-${Date.now()}`, actor: "Maya Patel", text: commentDraft, timestamp: new Date().toISOString() }] } : o) }));
    addAudit({ actor: "Maya Patel", action: "Comment added to obligation", timestamp: new Date().toISOString(), after: commentDraft.slice(0, 80) });
    setCommentDraft("");
  };

  const handleSaveApplicability = () => {
    if (!rationale.trim()) return;
    updateReg((r) => ({ ...r, applicability: applicabilityDraft }));
    addAudit({ actor: "Maya Patel", action: "Applicability changed", timestamp: new Date().toISOString(), before: reg.applicability, after: applicabilityDraft, rationale });
    setShowRationale(false); setRationale("");
    showToast("Applicability updated.");
  };

  const handleApprove = () => {
    updateReg((r) => ({ ...r, decisionState: "Approved" }));
    addAudit({ actor: "Maya Patel", action: "Decision Approved", timestamp: new Date().toISOString(), rationale: "Approved by Head of Compliance." });
    showToast("Decision approved.");
  };

  const handleMoveToReviewed = () => {
    updateReg((r) => ({ ...r, decisionState: "Reviewed" }));
    addAudit({ actor: "Maya Patel", action: "Moved to Reviewed", timestamp: new Date().toISOString() });
    showToast("Decision moved to Reviewed.");
  };

  // KPI computations
  const total = reg.obligations.length;
  const assessed = reg.obligations.filter((o) => o.coverageStatus !== "Not assessed").length;
  const covered = reg.obligations.filter((o) => o.coverageStatus === "Covered").length;
  const allPolicies = [...new Set(reg.obligations.flatMap((o) => o.linkedPolicies))];
  const allControls = [...new Set(reg.obligations.flatMap((o) => o.linkedControls))];
  const policiesFinalized = reg.obligations.filter((o) => o.coverageStatus === "Covered" && o.linkedPolicies.length > 0 && o.evidence.length > 0).length;

  const isApproved = reg.decisionState === "Approved";

  const checklistItems = [
    { label: "AI output preserved", done: true },
    { label: "Human rationale captured", done: !!reg.humanRationale },
    { label: "Obligations mapped", done: total > 0 },
    { label: "Coverage assessed", done: assessed === total && total > 0 },
    { label: "Evidence linked", done: reg.obligations.some((o) => o.evidence.length > 0) },
    { label: "Audit history complete", done: reg.auditHistory.length > 2 },
    { label: "Approved decision", done: isApproved },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header row 1 */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 flex-shrink-0 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"><RotateCcw className="w-3 h-3" /> Back</button>
        <span className="text-gray-200">|</span>
        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-sm font-semibold text-gray-900 truncate">{reg.title}</span>
          <Badge className={decisionBadge(reg.decisionState)}>{reg.decisionState}</Badge>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {reg.decisionState === "Draft" && <button onClick={handleMoveToReviewed} className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50">Move to Reviewed</button>}
          {!isApproved && <button onClick={handleApprove} className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">Approve</button>}
          <button onClick={() => showToast("Audit pack exported (simulated).")} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50"><ExternalLink className="w-3 h-3" /> Export</button>
        </div>
      </div>

      {/* Header row 2 — workflow sub-bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-5 py-2 flex items-center gap-3 flex-shrink-0">
        <span className="text-xs text-gray-500">Currently with: <span className="font-semibold text-gray-800">{reg.workflow.currentAssignee}</span></span>
        <span className="text-gray-300">·</span>
        <span className="text-xs text-gray-500">Stage: <span className="font-semibold text-indigo-700">{reg.workflow.currentStage}</span></span>
        {reg.workflow.history.length > 0 && <><span className="text-gray-300">·</span><span className="text-xs text-gray-400">{reg.workflow.history.length} stage{reg.workflow.history.length !== 1 ? "s" : ""} completed</span></>}
        <div className="flex-1" />
        {!isApproved && (
          <button onClick={() => setHandoffOpen(!handoffOpen)} className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border transition-colors ${handoffOpen ? "bg-indigo-600 text-white border-indigo-600" : "text-indigo-600 border-indigo-200 hover:bg-indigo-50"}`}>
            Hand off <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Hand-off panel */}
      {handoffOpen && (
        <div className="bg-white border-b border-indigo-100 px-5 py-4 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-800 mb-3">Hand off this record</p>
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-1">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide">Reassign to</label>
              <select value={handoffAssignee} onChange={(e) => setHandoffAssignee(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                <option value="">Select person…</option>
                {TEAM_MEMBERS.filter((m) => m !== reg.workflow.currentAssignee).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1 space-y-1">
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wide">Note for next reviewer</label>
              <input type="text" value={handoffNote} onChange={(e) => setHandoffNote(e.target.value)} placeholder="Optional note…" className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setHandoffOpen(false); setHandoffAssignee(""); setHandoffNote(""); }} className="px-3 py-1.5 text-xs border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleHandoff} disabled={!handoffAssignee} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium disabled:opacity-40">Confirm hand-off</button>
            </div>
          </div>
        </div>
      )}

      {/* Two-column content */}
      <div className="flex-1 flex overflow-hidden bg-gray-50">
        {/* LEFT — KPIs + requirements table */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-w-0">

          {/* KPI cards */}
          <div className="grid grid-cols-6 gap-3">
            <RegKpiCard label="Requirements" value={total} />
            <RegKpiCard label="Assessed" value={assessed} sub={`of ${total} total`} accent={assessed === total ? "text-green-700" : "text-amber-600"} />
            <RegKpiCard label="Covered" value={covered} sub={`of ${assessed} assessed`} accent={covered > 0 && covered === assessed ? "text-green-700" : "text-gray-900"} />
            <RegKpiCard label="Policies identified" value={allPolicies.length} sub="unique statements" />
            <RegKpiCard label="Policies finalised" value={policiesFinalized} sub={`of ${covered} covered`} accent={policiesFinalized === covered && covered > 0 ? "text-green-700" : "text-gray-900"} />
            <RegKpiCard label="Controls linked" value={allControls.length} sub="unique controls" />
          </div>

          {/* Requirements table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Requirements <span className="ml-1 text-xs font-normal text-gray-400">{total} obligations mapped</span></h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Requirement</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">Coverage</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Policies</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Controls</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Evidence</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {reg.obligations.map((obl) => {
                  const isExpanded = expandedOblId === obl.id;
                  const hasAction = actionObligationIds.has(obl.id);
                  const rowBg = isExpanded ? "bg-indigo-50" : obl.coverageStatus === "Not covered" ? "bg-red-50/40" : obl.coverageStatus === "Partial" ? "bg-amber-50/40" : obl.coverageStatus === "Not assessed" ? "bg-gray-50/60" : "";
                  return (
                    <React.Fragment key={obl.id}>
                      <tr
                        className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${rowBg}`}
                        onClick={() => { setExpandedOblId(isExpanded ? null : obl.id); setOblChatPrompt(null); setCommentDraft(""); }}
                      >
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-xs text-gray-900 leading-relaxed">{obl.text}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge className={riskBadge(reg.risk)}>{reg.risk}</Badge>
                            <Badge className="bg-purple-100 text-purple-700 border border-purple-300">{reg.type}</Badge>
                          </div>
                          {obl.reasonCode && <p className="text-[10px] text-gray-400 italic mt-0.5">{obl.reasonCode}</p>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><Badge className={coverageBadge(obl.coverageStatus)}>{obl.coverageStatus}</Badge></td>
                        <td className="px-4 py-3 text-xs">{obl.linkedPolicies.length > 0 ? <span className="text-green-700 font-semibold">{obl.linkedPolicies.length}</span> : <span className="text-red-400">None</span>}</td>
                        <td className="px-4 py-3 text-xs">{obl.linkedControls.length > 0 ? <span className="text-green-700 font-semibold">{obl.linkedControls.length}</span> : <span className="text-red-400">None</span>}</td>
                        <td className="px-4 py-3 text-xs">{obl.evidence.length > 0 ? <span className="text-green-700 font-semibold">{obl.evidence.length}</span> : <span className="text-red-400">None</span>}</td>
                        <td className="px-4 py-3">
                          {obl.comments.length > 0
                            ? <span className="flex items-center gap-1 text-[10px] text-indigo-600 font-medium"><MessageSquare className="w-3 h-3" />{obl.comments.length}</span>
                            : <span className="text-[10px] text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">{isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-indigo-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}</td>
                      </tr>

                      {isExpanded && (
                        <tr className="border-b border-indigo-100">
                          <td colSpan={7} className="px-4 py-4 bg-indigo-50/70">
                            <div className="space-y-4">
                              {/* Policies / Controls / Evidence */}
                              <div className="grid grid-cols-3 gap-4">
                                {[
                                  { label: "Policies", items: obl.linkedPolicies },
                                  { label: "Controls", items: obl.linkedControls },
                                  { label: "Evidence", items: obl.evidence },
                                ].map(({ label, items }) => (
                                  <div key={label}>
                                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">{label}</p>
                                    {items.length > 0
                                      ? items.map((item) => <p key={item} className="text-xs text-gray-700 mb-0.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />{item}</p>)
                                      : <p className="text-xs text-red-500">No {label.toLowerCase()} linked</p>}
                                  </div>
                                ))}
                              </div>

                              {/* AI chat */}
                              <div className="border-t border-indigo-200 pt-3">
                                <p className="text-[10px] font-semibold text-indigo-600 mb-1.5">Ask AI about this requirement</p>
                                <div className="flex gap-1.5">
                                  {["What is not covered?", "What evidence supports this?"].map((prompt) => (
                                    <button
                                      key={prompt}
                                      onClick={(e) => { e.stopPropagation(); setOblChatPrompt(oblChatPrompt === prompt ? null : prompt); }}
                                      className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${oblChatPrompt === prompt ? "bg-indigo-600 text-white border-indigo-600" : "border-indigo-200 text-indigo-600 hover:bg-indigo-100"}`}
                                    >{prompt}</button>
                                  ))}
                                </div>
                                {oblChatPrompt && (
                                  <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                    <p className="text-[10px] font-semibold text-blue-700 mb-1">{oblChatPrompt}</p>
                                    <p className="text-xs text-gray-700 leading-relaxed">{CONTEXTUAL_CHAT_RESPONSES[oblChatPrompt]}</p>
                                  </div>
                                )}
                              </div>

                              {/* Comments */}
                              <div className="border-t border-indigo-200 pt-3 space-y-2">
                                <p className="text-[10px] font-semibold text-gray-600">Discussion</p>
                                {obl.comments.map((c) => (
                                  <div key={c.id} className="bg-white rounded-md p-2 border border-gray-100">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="text-[10px] font-semibold text-gray-700">{c.actor}</span>
                                      <span className="text-[10px] text-gray-300">·</span>
                                      <span className="text-[10px] text-gray-400">{new Date(c.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-600 leading-relaxed">{c.text}</p>
                                  </div>
                                ))}
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input type="text" value={commentDraft} onChange={(e) => setCommentDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSendComment(obl.id); }} placeholder="Add a note…" className="flex-1 px-2 py-1.5 text-[10px] border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white" />
                                  <button onClick={() => handleSendComment(obl.id)} disabled={!commentDraft.trim()} className="px-2.5 py-1.5 text-[10px] bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-40 font-medium">Send</button>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-2 border-t border-indigo-200 pt-3" onClick={(e) => e.stopPropagation()}>
                                <button className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-indigo-600 border border-gray-200 px-2 py-1 rounded bg-white"><Plus className="w-3 h-3" /> Add evidence</button>
                                {hasAction && <Badge className="bg-indigo-100 text-indigo-700 border border-indigo-200">Action created</Badge>}
                                {(obl.coverageStatus === "Not covered" || obl.coverageStatus === "Partial") && !hasAction && (
                                  <button onClick={() => onCreateAction(obl, reg)} className="flex items-center gap-1 text-[10px] text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-1 rounded font-medium"><ArrowRight className="w-3 h-3" /> Create downstream action</button>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Audit history */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setAuditExpanded((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-900">Audit history</h3>
              {auditExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
            </button>
            {auditExpanded && (
              <div className="px-4 pb-4">
                <div className="relative pl-5">
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
                  <div className="space-y-4">
                    {[...reg.auditHistory].reverse().map((evt) => (
                      <div key={evt.id} className="relative">
                        <div className="absolute -left-4 top-1 w-2.5 h-2.5 rounded-full bg-indigo-200 border-2 border-white" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-900">{evt.action}</span>
                            {evt.actor === "Cardamon AI" && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100">AI-generated</span>}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{evt.actor} · {new Date(evt.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                          {(evt.before || evt.after) && <p className="text-[10px] text-gray-500 mt-0.5">{evt.before} → {evt.after}</p>}
                          {evt.rationale && <p className="text-[10px] text-gray-500 italic mt-0.5">"{evt.rationale}"</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT panel */}
        <div className="w-64 flex-shrink-0 border-l border-gray-200 overflow-y-auto p-4 space-y-4 bg-white">


          {/* Governance checklist */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Governance checklist</h3>
            {checklistItems.map(({ label, done }) => (
              <div key={label} className="flex items-center gap-2">
                {done ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                <span className={`text-xs ${done ? "text-gray-700" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>

          {/* Record details */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Record details</h3>
            {[{ label: "Regulator", value: reg.regulator }, { label: "Jurisdiction", value: reg.jurisdiction }, { label: "Type", value: reg.type }, { label: "Stage", value: reg.workflow.currentStage }, { label: "With", value: reg.workflow.currentAssignee }].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-2">
                <span className="text-[10px] text-gray-400 uppercase tracking-wide flex-shrink-0">{label}</span>
                <span className="text-xs text-gray-700 text-right">{value}</span>
              </div>
            ))}
          </div>

          {/* Stage history */}
          {reg.workflow.history.length > 0 && (
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Stage history</h3>
              {reg.workflow.history.map((h, i) => (
                <div key={i} className="text-[10px]">
                  <div className="flex items-center gap-1.5 mb-0.5"><CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" /><span className="font-semibold text-gray-700">{h.stage}</span></div>
                  <p className="text-gray-400 pl-4">{h.assignee} · {new Date(h.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                  {h.note && <p className="text-gray-400 italic pl-4 mt-0.5 leading-relaxed">"{h.note}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Actions View ─────────────────────────────────────────────────────────────

const STAGE_DESCRIPTIONS: Record<AssignmentStage, string> = {
  Applicability: "Assess applicability and decide scope",
  Obligations: "Map and review obligations coverage",
  "Controls & Evidence": "Link controls and evidence to obligations",
  Approval: "Review and approve the decision record",
};

function ActionsView({ actions, regulations, onOpenRecord }: { actions: DownstreamAction[]; regulations: RegulationMapping[]; onOpenRecord: (id: string) => void }) {
  const [actionsTab, setActionsTab] = useState<"mine" | "team" | "remediation">("mine");
  const myRegs = regulations.filter((r) => r.workflow.currentAssignee === "Maya Patel");
  const remediationActions = actions.filter((a) => a.stageType === "Remediation");

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-200 px-5 flex items-center gap-0 flex-shrink-0">
        {[{ id: "mine" as const, label: "My Tasks", count: myRegs.length }, { id: "team" as const, label: "Team", count: regulations.length }, { id: "remediation" as const, label: "Remediation", count: remediationActions.length }].map((tab) => (
          <button key={tab.id} onClick={() => setActionsTab(tab.id)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${actionsTab === tab.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${actionsTab === tab.id ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {actionsTab === "mine" && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">My Tasks <span className="text-xs font-normal text-gray-400 ml-1">{myRegs.length} regulations assigned to you</span></h2>
            {myRegs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center"><CheckCircle2 className="w-10 h-10 text-green-200 mb-3" /><p className="text-sm font-medium text-gray-500">No tasks assigned to you.</p></div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 bg-gray-50">{["Regulation", "Stage", "What's needed", "Decision state", ""].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {myRegs.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 max-w-[200px]"><p className="text-xs font-medium text-gray-900">{reg.title}</p><p className="text-[10px] text-gray-400 mt-0.5">{reg.regulator}</p></td>
                        <td className="px-4 py-3"><span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">{reg.workflow.currentStage}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[200px]">{STAGE_DESCRIPTIONS[reg.workflow.currentStage]}</td>
                        <td className="px-4 py-3"><Badge className={decisionBadge(reg.decisionState)}>{reg.decisionState}</Badge></td>
                        <td className="px-4 py-3"><button onClick={() => onOpenRecord(reg.id)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">Open record <ChevronRight className="w-3 h-3" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {actionsTab === "team" && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Team Pipeline <span className="text-xs font-normal text-gray-400 ml-1">{regulations.length} regulations in review</span></h2>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 bg-gray-50">{["Regulation", "Stage", "Assigned to", "Handed off by", "Last activity", ""].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {regulations.map((reg) => {
                    const last = reg.workflow.history[reg.workflow.history.length - 1];
                    return (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 max-w-[200px]"><p className="text-xs font-medium text-gray-900">{reg.title}</p><p className="text-[10px] text-gray-400 mt-0.5">{reg.regulator}</p></td>
                        <td className="px-4 py-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${reg.decisionState === "Approved" ? "bg-green-50 text-green-700 border-green-200" : "bg-indigo-50 text-indigo-700 border-indigo-100"}`}>{reg.decisionState === "Approved" ? "Approved" : reg.workflow.currentStage}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-700">{reg.workflow.currentAssignee}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{last ? last.assignee : "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{last ? new Date(last.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—"}</td>
                        <td className="px-4 py-3"><button onClick={() => onOpenRecord(reg.id)} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium whitespace-nowrap">Open <ChevronRight className="w-3 h-3" /></button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {actionsTab === "remediation" && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Remediation Actions <span className="text-xs font-normal text-gray-400 ml-1">{remediationActions.length} total</span></h2>
            {remediationActions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center"><Zap className="w-10 h-10 text-gray-200 mb-3" /><p className="text-sm font-medium text-gray-500">No remediation actions yet.</p></div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 bg-gray-50">{["Action", "Source regulation", "Owner", "Destination", "Priority", "Status"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {remediationActions.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 max-w-[200px]"><p className="text-xs font-medium text-gray-900 leading-snug">{a.title}</p><p className="text-[10px] text-gray-400 mt-0.5">Due {a.dueDate}</p></td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px]"><span className="truncate block">{a.sourceRegulation}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-700">{a.owner}</td>
                        <td className="px-4 py-3"><Badge className="bg-purple-100 text-purple-700 border border-purple-200">{a.destination}</Badge></td>
                        <td className="px-4 py-3"><Badge className={riskBadge(a.priority)}>{a.priority}</Badge></td>
                        <td className="px-4 py-3"><Badge className={a.status === "Pushed downstream" ? "bg-green-100 text-green-700 border border-green-200" : "bg-blue-100 text-blue-700 border border-blue-200"}>{a.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
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

// ─── App ─────────────────────────────────────────────────────────────────────

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
    if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); }
  }, [toast]);

  const showToast = (msg: string) => setToast(msg);

  const handleOpenRecord = (id: string) => { setSelectedRegId(id); setActiveView("records"); };
  const handleFilteredMapping = (filter: string) => { setMappingFilter(filter as MappingFilter); setActiveView("mapping"); };
  const handleCreateAction = (obl: Obligation, reg: RegulationMapping) => setDrawerState({ obl, reg });

  const handleActionCreated = (action: DownstreamAction) => {
    setActions((prev) => [...prev, action]);
    setActionObligationIds((prev) => { const next = new Set(prev); next.add(drawerState!.obl.id); return next; });
    setRegulations((prev) => prev.map((r) => r.id !== drawerState!.reg.id ? r : { ...r, auditHistory: [...r.auditHistory, { id: `aud-action-${Date.now()}`, actor: "Maya Patel", action: "Downstream action created for uncovered obligation", timestamp: new Date().toISOString(), after: action.title }] }));
    setDrawerState(null);
    showToast("Action created and linked to Decision Record.");
  };

  const selectedReg = selectedRegId ? regulations.find((r) => r.id === selectedRegId) || null : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar active={activeView} setActive={(v) => { setActiveView(v); if (v !== "records") setSelectedRegId(null); }} />
      <div className="flex flex-col flex-1 overflow-hidden bg-white">
        <TopBar viewScope={viewScope} setViewScope={setViewScope} />
        <main className="flex-1 overflow-hidden bg-gray-50">
          {activeView === "dashboard" && <Dashboard regulations={regulations} onOpenRecord={handleOpenRecord} onFilteredMapping={handleFilteredMapping} viewScope={viewScope} />}
          {activeView === "mapping" && <MappingTable regulations={regulations} onOpenRecord={handleOpenRecord} activeFilter={mappingFilter} setActiveFilter={setMappingFilter} />}
          {activeView === "records" && selectedReg
            ? <RegulationOverview regulation={selectedReg} regulations={regulations} setRegulations={setRegulations} onCreateAction={handleCreateAction} onBack={() => setActiveView("mapping")} showToast={showToast} actionObligationIds={actionObligationIds} />
            : activeView === "records" && !selectedReg
            ? <MappingTable regulations={regulations} onOpenRecord={handleOpenRecord} activeFilter="all" setActiveFilter={() => {}} />
            : null}
          {activeView === "actions" && <ActionsView actions={actions} regulations={regulations} onOpenRecord={handleOpenRecord} />}
          {activeView === "statements" && <Placeholder title="Policy Statements" icon={AlignLeft} />}
        </main>
      </div>
      {drawerState && <ActionDrawer obligation={drawerState.obl} regulation={drawerState.reg} onClose={() => setDrawerState(null)} onCreate={handleActionCreated} />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
