export type Risk = "Low" | "Medium" | "High";
export type Applicability = "Applicable" | "Not applicable" | "Partially applicable";
export type DecisionState = "Draft" | "Reviewed" | "Approved" | "Superseded";
export type CoverageStatus = "Covered" | "Partial" | "Not covered" | "Not assessed";
export type ReasonCode =
  | "Not required"
  | "Acceptable absence"
  | "Real gap requiring downstream remediation"
  | "Not assessed";
export type ActionDestination = "GRC issue" | "Policy workflow" | "Export";
export type ActionStatus = "Created" | "Pushed downstream" | "Draft";
export type AssignmentStage = "Applicability" | "Obligations" | "Controls & Evidence" | "Approval";
export type StageStatus = "Pending" | "In progress" | "Complete";

export type ObligationComment = {
  id: string;
  actor: string;
  text: string;
  timestamp: string;
};

export type Obligation = {
  id: string;
  section?: string;
  subsection?: string;
  text: string;
  aiSummary: string;
  oblApplicability: Applicability;
  coverageStatus: CoverageStatus;
  reasonCode?: ReasonCode;
  linkedPolicies: string[];
  linkedControls: string[];
  evidence: string[];
  riskTags: string[];
  aiActionPoints: string[];
  comments: ObligationComment[];
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  before?: string;
  after?: string;
  rationale?: string;
};

export type WorkflowHistory = {
  stage: AssignmentStage;
  assignee: string;
  completedAt: string;
  note?: string;
};

export type WorkflowAssignment = {
  currentStage: AssignmentStage;
  currentAssignee: string;
  history: WorkflowHistory[];
};

export type RegulationMapping = {
  id: string;
  title: string;
  regulator: string;
  jurisdiction: string;
  type: string;
  risk: Risk;
  applicability: Applicability;
  aiApplicability: Applicability;
  decisionState: DecisionState;
  assignee: string;
  controlCoverage: number;
  policyCoverage: number;
  aiSummary: string;
  humanSummary: string;
  aiRationale: string;
  humanRationale: string;
  obligations: Obligation[];
  auditHistory: AuditEvent[];
  workflow: WorkflowAssignment;
};

export type DownstreamAction = {
  id: string;
  title: string;
  sourceRegulation: string;
  sourceObligation: string;
  gapReason: string;
  owner: string;
  destination: ActionDestination;
  status: ActionStatus;
  evidenceExpected: string[];
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  stageType: "Stage review" | "Hand-off" | "Remediation";
};

export const MOCK_REGULATIONS: RegulationMapping[] = [
  {
    id: "reg-001",
    title: "State Money Transmission Licensing Requirements",
    regulator: "State Regulators (NMLS)",
    jurisdiction: "United States",
    type: "Licensing",
    risk: "High",
    applicability: "Applicable",
    aiApplicability: "Applicable",
    decisionState: "Reviewed",
    assignee: "Samir Khan",
    controlCoverage: 75,
    policyCoverage: 50,
    aiSummary:
      "Wise US Inc must maintain active money transmission licences across all states where it operates. Requirements include minimum net worth or surety bond thresholds, notification obligations for material business changes, and periodic regulatory reporting to state authorities via NMLS.",
    humanSummary:
      "Wise US Inc holds MSB licences in 50 states. Licence maintenance, net worth requirements and material change notifications are in scope. We exclude non-US operations from this mapping.",
    aiRationale:
      "Wise US Inc transmits funds on behalf of customers across US states, meeting the statutory definition of a money transmitter under state law. All major operating states have active licence requirements.",
    humanRationale:
      "Confirmed applicable to US operations only. Wise US Inc holds active licences in all required states. Material change notification obligations are partially mapped but evidence of procedure is incomplete.",
    workflow: {
      currentStage: "Controls & Evidence",
      currentAssignee: "Samir Khan",
      history: [
        { stage: "Applicability", assignee: "Maya Patel", completedAt: "2026-03-05T11:30:00Z", note: "Confirmed applicable to all 50-state operations. Passing to Alex for obligations review." },
        { stage: "Obligations", assignee: "Alex Chen", completedAt: "2026-03-10T14:00:00Z", note: "Two obligations have gaps — material change notification and periodic reporting. Samir to map controls." },
      ],
    },
    obligations: [
      {
        id: "obl-001-1",
        section: "§ 1004",
        subsection: "(a)",
        text: "Maintain active licences in each operating state.",
        aiSummary: "Hold a valid money transmission licence in every US state where the entity conducts business.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US Regulatory Licensing Policy"],
        linkedControls: ["CTRL-US-LIC-004 Licence register review"],
        evidence: ["Q1 Licence Attestation", "NMLS Annual Report 2025"],
        riskTags: ["Licensing", "Regulatory"],
        aiActionPoints: [
          "Coverage complete — no immediate action required.",
          "Consider scheduling a Q3 attestation refresh to keep evidence current.",
        ],
        comments: [],
      },
      {
        id: "obl-001-2",
        section: "§ 1007",
        subsection: "(b)",
        text: "Notify regulator of material business changes.",
        aiSummary: "Report ownership, control or product-scope changes to state regulators within required timeframes.",
        oblApplicability: "Applicable",
        coverageStatus: "Not covered",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
        riskTags: ["Regulatory", "Operational"],
        aiActionPoints: [
          "No policy linked — draft a material change notification procedure and link it here.",
          "No control mapped — search the control library for 'change notification' candidates.",
          "Create a downstream remediation action to formalise this obligation.",
        ],
        comments: [
          { id: "c-001-2-a", actor: "Alex Chen", text: "No written procedure exists for this. We handle it ad hoc. Samir — can you check if there's a control we can link here?", timestamp: "2026-03-10T14:05:00Z" },
          { id: "c-001-2-b", actor: "Samir Khan", text: "Checked — nothing in the control library maps to this. We need a new procedure. Creating a remediation action.", timestamp: "2026-03-11T09:30:00Z" },
        ],
      },
      {
        id: "obl-001-3",
        section: "§ 1010",
        subsection: "(a)",
        text: "Maintain minimum net worth or surety bond requirements.",
        aiSummary: "Entity must meet each state's minimum net worth threshold or post the required surety bond.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US Regulatory Licensing Policy"],
        linkedControls: ["CTRL-US-LIC-004 Licence register review"],
        evidence: ["Q1 Licence Attestation"],
        riskTags: ["Financial", "Licensing"],
        aiActionPoints: [
          "Coverage complete — bond amounts are within required thresholds.",
          "Consider linking a quarterly finance attestation to strengthen evidence.",
        ],
        comments: [],
      },
      {
        id: "obl-001-4",
        section: "§ 1013",
        subsection: "(c)",
        text: "Submit periodic regulatory reports.",
        aiSummary: "File required financial and operational reports with state regulators via NMLS on a scheduled basis.",
        oblApplicability: "Applicable",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["Regulatory Reporting Procedure"],
        linkedControls: [],
        evidence: [],
        riskTags: ["Reporting", "Regulatory"],
        aiActionPoints: [
          "Policy exists but no control is linked — map an appropriate control from the library.",
          "Evidence is missing — link the most recent NMLS submission as proof of compliance.",
          "Suggest control: CTRL-US-LIC-005 NMLS quarterly submission if it exists in your library.",
        ],
        comments: [
          { id: "c-001-4-a", actor: "Alex Chen", text: "Policy exists but no control has been linked. Samir — please map the appropriate control from the library.", timestamp: "2026-03-10T14:10:00Z" },
        ],
      },
    ],
    auditHistory: [
      { id: "aud-001-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-03-01T09:00:00Z" },
      { id: "aud-001-2", actor: "Maya Patel", action: "Applicability confirmed", timestamp: "2026-03-05T11:30:00Z", before: "Not assessed", after: "Applicable", rationale: "Wise US Inc operates as an MSB in all 50 states." },
      { id: "aud-001-3", actor: "Maya Patel", action: "Record handed off to Alex Chen for Obligations review", timestamp: "2026-03-05T11:31:00Z", rationale: "Confirmed applicable to all 50-state operations. Passing to Alex for obligations review." },
      { id: "aud-001-4", actor: "Alex Chen", action: "Moved to Reviewed", timestamp: "2026-03-10T14:00:00Z" },
      { id: "aud-001-5", actor: "Alex Chen", action: "Record handed off to Samir Khan for Controls & Evidence", timestamp: "2026-03-10T14:01:00Z", rationale: "Two obligations have gaps — material change notification and periodic reporting. Samir to map controls." },
    ],
  },
  {
    id: "reg-002",
    title: "FinCEN AML Programme Rule",
    regulator: "FinCEN",
    jurisdiction: "United States",
    type: "AML/CFT",
    risk: "High",
    applicability: "Applicable",
    aiApplicability: "Applicable",
    decisionState: "Reviewed",
    assignee: "Alex Chen",
    controlCoverage: 80,
    policyCoverage: 60,
    aiSummary:
      "All money services businesses registered with FinCEN must maintain a written AML programme. The programme must include internal policies, designation of a compliance officer, independent testing, employee training, and a suspicious activity reporting mechanism.",
    humanSummary:
      "Wise US Inc maintains a written AML programme under FinCEN MSB rules. Programme elements are in place. Independent testing and SAR filing are covered. Training evidence requires a refresh.",
    aiRationale:
      "Wise US Inc is registered as an MSB with FinCEN. The AML Programme Rule applies to all registered MSBs without threshold. All five programme pillars are in scope.",
    humanRationale:
      "Fully applicable. AML policy v3.2 is in force. Compliance officer designated. Independent test completed Q1 2026. Training programme requires update — evidence pack is from 2024.",
    workflow: {
      currentStage: "Obligations",
      currentAssignee: "Alex Chen",
      history: [
        { stage: "Applicability", assignee: "Maya Patel", completedAt: "2026-03-07T10:15:00Z", note: "Fully applicable — no scope limitations. Alex to map obligations." },
      ],
    },
    obligations: [
      {
        id: "obl-002-1",
        section: "§ 1022.210",
        subsection: "(a)",
        text: "Maintain a written AML programme.",
        aiSummary: "Establish and document a comprehensive AML programme addressing all five FinCEN-required pillars.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: ["CTRL-US-AML-001 Transaction monitoring rules"],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Financial Crime", "Regulatory"],
        aiActionPoints: [
          "Programme documentation is current — AML Policy v3.2 covers all five pillars.",
          "Consider an annual review cycle to keep the policy version up to date.",
        ],
        comments: [],
      },
      {
        id: "obl-002-2",
        section: "§ 1022.210",
        subsection: "(a)(1)",
        text: "Appoint a compliance officer.",
        aiSummary: "Designate a qualified individual to implement and oversee the day-to-day AML programme.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Operational", "Regulatory"],
        aiActionPoints: [
          "Compliance officer designation is documented in policy.",
          "Link an org-chart or board resolution as secondary evidence for examination readiness.",
        ],
        comments: [],
      },
      {
        id: "obl-002-3",
        section: "§ 1022.210",
        subsection: "(a)(3)",
        text: "Conduct independent testing.",
        aiSummary: "Arrange periodic independent audits or reviews to test the AML programme's effectiveness.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: ["Control Test Report 2026-04"],
        riskTags: ["Operational", "Regulatory"],
        aiActionPoints: [
          "Q1 2026 independent test is on file and complete.",
          "Schedule Q3 2026 testing to maintain annual cadence.",
        ],
        comments: [],
      },
      {
        id: "obl-002-4",
        section: "§ 1022.210",
        subsection: "(a)(2)",
        text: "Provide AML training to relevant staff.",
        aiSummary: "Deliver role-appropriate AML training to all staff involved in AML compliance and transaction processing.",
        oblApplicability: "Applicable",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: [],
        riskTags: ["Operational", "Financial Crime"],
        aiActionPoints: [
          "Training completion records on file are from 2024 — evidence is stale.",
          "Obtain 2025/26 training completion certificates from HR and link here.",
          "Consider creating a downstream action for HR to issue updated records by Q2 2026.",
        ],
        comments: [
          { id: "c-002-4-a", actor: "Maya Patel", text: "Training completion records from 2024 are on file but we need 2025/26 evidence. Who is leading the refresh?", timestamp: "2026-03-07T10:20:00Z" },
          { id: "c-002-4-b", actor: "Alex Chen", text: "HR owns this. I've raised a ticket. Expect updated records by end of Q2. Marking as partial for now.", timestamp: "2026-03-08T09:00:00Z" },
        ],
      },
      {
        id: "obl-002-5",
        section: "§ 1022.320",
        subsection: "(a)",
        text: "Monitor and report suspicious activity (SAR filing).",
        aiSummary: "Detect and file SARs for transactions of $2,000 or more where criminal activity is suspected.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: ["CTRL-US-AML-001 Transaction monitoring rules"],
        evidence: ["AML Policy v3.2", "Control Test Report 2026-04"],
        riskTags: ["Financial Crime", "Reporting"],
        aiActionPoints: [
          "SAR filing process is documented and control-tested.",
          "Ensure transaction monitoring rule thresholds are reviewed annually.",
        ],
        comments: [],
      },
    ],
    auditHistory: [
      { id: "aud-002-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-03-01T09:00:00Z" },
      { id: "aud-002-2", actor: "Maya Patel", action: "Human rationale added", timestamp: "2026-03-07T10:15:00Z", rationale: "Training evidence is stale. Will flag as partial gap." },
      { id: "aud-002-3", actor: "Maya Patel", action: "Record handed off to Alex Chen for Obligations review", timestamp: "2026-03-07T10:16:00Z", rationale: "Fully applicable — no scope limitations. Alex to map obligations." },
      { id: "aud-002-4", actor: "Alex Chen", action: "Moved to Reviewed", timestamp: "2026-03-12T09:00:00Z" },
    ],
  },
  {
    id: "reg-003",
    title: "CFPB Remittance Transfer Rule",
    regulator: "CFPB",
    jurisdiction: "United States",
    type: "Consumer Protection",
    risk: "Medium",
    applicability: "Applicable",
    aiApplicability: "Applicable",
    decisionState: "Draft",
    assignee: "Maya Patel",
    controlCoverage: 50,
    policyCoverage: 25,
    aiSummary:
      "Providers of remittance transfers must provide pre-payment disclosures, issue a receipt at time of payment, maintain an error resolution process, and retain evidence of disclosures provided to consumers. Applies to transfers sent by consumers to foreign countries.",
    humanSummary:
      "Applicable to Wise US cross-border consumer transfers. Disclosure QA process exists but policy coverage is incomplete. Error resolution procedure is not yet formally documented.",
    aiRationale:
      "Wise US Inc provides international consumer remittance transfers, meeting the definition under Regulation E. Pre-payment disclosure and receipt requirements apply to all such transfers.",
    humanRationale:
      "Applicable. Disclosure QA sample checks are in place. Error resolution SLA exists operationally but is not captured in a formal policy. Needs policy gap addressed.",
    workflow: {
      currentStage: "Applicability",
      currentAssignee: "Maya Patel",
      history: [],
    },
    obligations: [
      {
        id: "obl-003-1",
        section: "§ 1005.31",
        subsection: "(b)",
        text: "Provide required pre-payment disclosures.",
        aiSummary: "Disclose fees, exchange rate and transfer amount to the consumer before payment is made.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: ["CTRL-US-CFPB-006 Disclosure QA sample check"],
        evidence: ["Disclosure QA Evidence Pack"],
        riskTags: ["Consumer Protection", "Disclosure"],
        aiActionPoints: [
          "Disclosure process is QA-tested and evidenced.",
          "Verify that disclosure content reflects current fee schedule.",
        ],
        comments: [],
      },
      {
        id: "obl-003-2",
        section: "§ 1005.31",
        subsection: "(e)",
        text: "Provide receipt with transfer amount, fees and exchange rate.",
        aiSummary: "Issue a consumer receipt at point of payment confirming all transfer details.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: ["CTRL-US-CFPB-006 Disclosure QA sample check"],
        evidence: ["Disclosure QA Evidence Pack"],
        riskTags: ["Consumer Protection", "Disclosure"],
        aiActionPoints: [
          "Receipt generation is automated and within scope of QA checks.",
          "Ensure receipt format satisfies state-level Regulation E requirements.",
        ],
        comments: [],
      },
      {
        id: "obl-003-3",
        section: "§ 1005.33",
        subsection: "(a)",
        text: "Maintain error resolution process.",
        aiSummary: "Operate a documented process for consumers to raise and resolve errors in remittance transfers.",
        oblApplicability: "Applicable",
        coverageStatus: "Not covered",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
        riskTags: ["Consumer Protection", "Operational"],
        aiActionPoints: [
          "No policy linked — draft an error resolution procedure aligned with § 1005.33.",
          "No control mapped — define an operational process and link it as a control.",
          "Create a downstream remediation action to prioritise this gap.",
        ],
        comments: [],
      },
      {
        id: "obl-003-4",
        section: "§ 1005.35",
        subsection: "(a)",
        text: "Retain evidence of disclosures provided to consumers.",
        aiSummary: "Keep records of all pre-payment disclosures and receipts issued to consumers for at least two years.",
        oblApplicability: "Applicable",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: [],
        evidence: [],
        riskTags: ["Consumer Protection", "Reporting"],
        aiActionPoints: [
          "Policy covers disclosure content but does not specify a retention schedule.",
          "Update the Customer Disclosures Policy to include a two-year retention requirement.",
          "Link a retention control or evidence of archive system configuration.",
        ],
        comments: [],
      },
    ],
    auditHistory: [
      { id: "aud-003-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-03-01T09:00:00Z" },
      { id: "aud-003-2", actor: "Maya Patel", action: "Human summary edited", timestamp: "2026-04-02T15:00:00Z", rationale: "Clarified scope to consumer transfers only." },
    ],
  },
  {
    id: "reg-004",
    title: "OFAC Sanctions Screening Expectations",
    regulator: "OFAC / US Treasury",
    jurisdiction: "United States",
    type: "Sanctions",
    risk: "High",
    applicability: "Applicable",
    aiApplicability: "Applicable",
    decisionState: "Approved",
    assignee: "Sarah Okonkwo",
    controlCoverage: 90,
    policyCoverage: 85,
    aiSummary:
      "All US persons and entities must comply with OFAC sanctions programmes. Financial institutions and MSBs are expected to screen customers, transactions and counterparties against OFAC's SDN and other sanctions lists in real time.",
    humanSummary:
      "Wise US Inc screens all customers and transactions against OFAC SDN, OFAC Sectoral Sanctions and other relevant lists using a real-time screening vendor. Escalation and blocking procedures are documented.",
    aiRationale:
      "As a US-domiciled MSB, Wise US Inc is a US person subject to all applicable OFAC sanctions programmes. Screening obligations apply to all products and customer journeys.",
    humanRationale:
      "Fully applicable. Real-time sanctions screening is in place via third-party vendor. Controls tested Q1 2026. Approved by Global CCO.",
    workflow: {
      currentStage: "Approval",
      currentAssignee: "Sarah Okonkwo",
      history: [
        { stage: "Applicability", assignee: "Maya Patel", completedAt: "2026-02-20T10:00:00Z", note: "Confirmed in scope for all US operations." },
        { stage: "Obligations", assignee: "Alex Chen", completedAt: "2026-02-23T11:00:00Z", note: "All obligations mapped and covered. Passing to Samir for control verification." },
        { stage: "Controls & Evidence", assignee: "Samir Khan", completedAt: "2026-02-25T11:00:00Z", note: "Controls verified and tested. Ready for CCO approval." },
      ],
    },
    obligations: [
      {
        id: "obl-004-1",
        section: "OFAC",
        subsection: "(a)",
        text: "Screen customers against OFAC SDN list at onboarding.",
        aiSummary: "Check all new customers against the Specially Designated Nationals list before onboarding is completed.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Sanctions Screening Standard"],
        linkedControls: ["CTRL-US-SAN-002 Real-time sanctions screening"],
        evidence: ["Control Test Report 2026-04"],
        riskTags: ["Financial Crime", "Sanctions"],
        aiActionPoints: [
          "Onboarding screening is automated via third-party vendor — fully evidenced.",
          "Confirm vendor SLA for list refresh cadence meets OFAC expectations.",
        ],
        comments: [],
      },
      {
        id: "obl-004-2",
        section: "OFAC",
        subsection: "(b)",
        text: "Screen transactions in real time against applicable sanctions lists.",
        aiSummary: "Apply real-time sanctions checks to all outbound and inbound transactions across applicable lists.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Sanctions Screening Standard"],
        linkedControls: ["CTRL-US-SAN-002 Real-time sanctions screening"],
        evidence: ["Control Test Report 2026-04"],
        riskTags: ["Financial Crime", "Sanctions"],
        aiActionPoints: [
          "Transaction-level screening is in scope of CTRL-US-SAN-002 and tested.",
          "Review sectoral sanctions list coverage beyond SDN in vendor configuration.",
        ],
        comments: [],
      },
      {
        id: "obl-004-3",
        section: "OFAC",
        subsection: "(c)",
        text: "Maintain documented escalation and blocking procedures.",
        aiSummary: "Keep written procedures for escalating and blocking transactions or accounts that generate sanctions alerts.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Sanctions Screening Standard"],
        linkedControls: ["CTRL-US-SAN-002 Real-time sanctions screening"],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Financial Crime", "Operational"],
        aiActionPoints: [
          "Escalation procedures are documented in the Sanctions Screening Standard.",
          "Consider a standalone escalation runbook for examination readiness.",
        ],
        comments: [],
      },
    ],
    auditHistory: [
      { id: "aud-004-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-02-15T09:00:00Z" },
      { id: "aud-004-2", actor: "Maya Patel", action: "Applicability confirmed", timestamp: "2026-02-20T10:00:00Z", before: "Not assessed", after: "Applicable", rationale: "Confirmed in scope for all US operations." },
      { id: "aud-004-3", actor: "Alex Chen", action: "Obligations mapped and verified", timestamp: "2026-02-23T11:00:00Z" },
      { id: "aud-004-4", actor: "Samir Khan", action: "Controls verified", timestamp: "2026-02-25T11:00:00Z" },
      { id: "aud-004-5", actor: "Sarah Okonkwo (Global CCO)", action: "Decision Approved", timestamp: "2026-03-01T09:00:00Z", rationale: "Controls verified. Screening vendor confirmed operational." },
    ],
  },
  {
    id: "reg-005",
    title: "NYDFS Cybersecurity Regulation (23 NYCRR 500)",
    regulator: "NYDFS",
    jurisdiction: "New York, United States",
    type: "Cybersecurity",
    risk: "High",
    applicability: "Partially applicable",
    aiApplicability: "Applicable",
    decisionState: "Draft",
    assignee: "Maya Patel",
    controlCoverage: 40,
    policyCoverage: 30,
    aiSummary:
      "NYDFS-licensed entities must establish and maintain a cybersecurity programme that protects the confidentiality, integrity and availability of information systems. Requirements include annual penetration testing, multi-factor authentication, incident notification, and CISO designation.",
    humanSummary:
      "Applicable to Wise US Inc's New York licensed operations. Wise holds a New York BitLicence and MTL. Cybersecurity programme is in place but several obligations have not yet been formally assessed against NYDFS-specific requirements.",
    aiRationale:
      "Wise US Inc holds a New York money transmission licence and BitLicence, making it a covered entity under 23 NYCRR 500. All programme requirements apply.",
    humanRationale:
      "Partially applicable — the full NYDFS cybersecurity programme obligations apply to our NY-licensed entity only. Assessment is underway. Several obligations are not yet assessed.",
    workflow: {
      currentStage: "Applicability",
      currentAssignee: "Maya Patel",
      history: [],
    },
    obligations: [
      {
        id: "obl-005-1",
        section: "§ 500.03",
        subsection: "(a)",
        text: "Maintain a written cybersecurity policy.",
        aiSummary: "Establish a documented cybersecurity policy covering all domains required by 23 NYCRR 500.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Incident Response Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Cybersecurity", "Operational"],
        aiActionPoints: [
          "Policy exists — verify it explicitly references NYDFS domain requirements.",
          "Link the current approved policy version as primary evidence.",
        ],
        comments: [],
      },
      {
        id: "obl-005-2",
        section: "§ 500.04",
        subsection: "(a)",
        text: "Designate a CISO responsible for cybersecurity programme.",
        aiSummary: "Appoint a qualified Chief Information Security Officer to manage and oversee cybersecurity.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Incident Response Policy"],
        linkedControls: [],
        evidence: [],
        riskTags: ["Cybersecurity", "Operational"],
        aiActionPoints: [
          "CISO designation is noted in policy — link evidence such as an appointment letter or org chart.",
          "Ensure CISO submits the required annual certification to NYDFS.",
        ],
        comments: [],
      },
      {
        id: "obl-005-3",
        section: "§ 500.05",
        subsection: "(a)",
        text: "Conduct annual penetration testing.",
        aiSummary: "Perform external and internal penetration testing of all covered information systems at least annually.",
        oblApplicability: "Partially applicable",
        coverageStatus: "Not assessed",
        reasonCode: "Not assessed",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
        riskTags: ["Cybersecurity", "Operational"],
        aiActionPoints: [
          "Assessment not yet started — confirm scope of NY-licensed systems with IT Security.",
          "If pen testing exists enterprise-wide, obtain the latest report and assess coverage.",
        ],
        comments: [],
      },
      {
        id: "obl-005-4",
        section: "§ 500.12",
        subsection: "(a)",
        text: "Implement multi-factor authentication for critical systems.",
        aiSummary: "Require MFA for all users accessing critical internal systems and non-public information.",
        oblApplicability: "Applicable",
        coverageStatus: "Not assessed",
        reasonCode: "Not assessed",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
        riskTags: ["Cybersecurity", "Operational"],
        aiActionPoints: [
          "Not yet assessed — verify MFA is enforced on all NYDFS-in-scope systems.",
          "Link IAM configuration evidence or access management policy to cover this.",
        ],
        comments: [],
      },
      {
        id: "obl-005-5",
        section: "§ 500.17",
        subsection: "(a)",
        text: "Notify NYDFS of cybersecurity events within 72 hours.",
        aiSummary: "Report qualifying cybersecurity incidents to NYDFS via the online portal within 72 hours of discovery.",
        oblApplicability: "Applicable",
        coverageStatus: "Not assessed",
        reasonCode: "Not assessed",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
        riskTags: ["Cybersecurity", "Regulatory"],
        aiActionPoints: [
          "Incident notification procedure should reference the 72-hour NYDFS threshold explicitly.",
          "Link the Incident Response Policy and confirm it covers NYDFS notification requirements.",
        ],
        comments: [],
      },
    ],
    auditHistory: [
      { id: "aud-005-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-03-15T09:00:00Z" },
      { id: "aud-005-2", actor: "Maya Patel", action: "Applicability overridden", timestamp: "2026-04-01T14:00:00Z", before: "Applicable", after: "Partially applicable", rationale: "Full programme applies to NY licensed entity only. Assessment ongoing." },
    ],
  },
  {
    id: "reg-006",
    title: "Consumer Complaint Handling Requirements",
    regulator: "CFPB / State Regulators",
    jurisdiction: "United States",
    type: "Consumer Protection",
    risk: "Medium",
    applicability: "Applicable",
    aiApplicability: "Applicable",
    decisionState: "Approved",
    assignee: "Sarah Okonkwo",
    controlCoverage: 85,
    policyCoverage: 80,
    aiSummary:
      "Consumer financial services providers must maintain a complaint management programme that captures, investigates and resolves consumer complaints within defined timeframes. Complaints must be tracked and regulators may request complaint data.",
    humanSummary:
      "Wise US Inc operates a complaint management programme through its US support and compliance teams. Complaints are tracked in Zendesk and reviewed monthly. Regulator data requests are handled by the compliance team.",
    aiRationale:
      "As a consumer-facing MSB and remittance provider, Wise US Inc is subject to CFPB complaint handling expectations and state-level requirements. All consumer products are in scope.",
    humanRationale:
      "Fully applicable. Complaint process is well documented and operationally mature. Monthly reporting is in place. Approved.",
    workflow: {
      currentStage: "Approval",
      currentAssignee: "Sarah Okonkwo",
      history: [
        { stage: "Applicability", assignee: "Maya Patel", completedAt: "2026-02-12T10:00:00Z", note: "Clearly applicable. Mature process. Passing to Alex." },
        { stage: "Obligations", assignee: "Alex Chen", completedAt: "2026-02-16T14:00:00Z", note: "All obligations covered. No gaps. Ready for controls check." },
        { stage: "Controls & Evidence", assignee: "Samir Khan", completedAt: "2026-02-19T09:00:00Z", note: "Controls confirmed. Zendesk integration verified. Ready for approval." },
      ],
    },
    obligations: [
      {
        id: "obl-006-1",
        section: "12 CFR",
        subsection: "§ 1024(a)",
        text: "Maintain a written complaint management policy.",
        aiSummary: "Document a formal complaint management policy covering receipt, investigation and resolution procedures.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Consumer Protection", "Operational"],
        aiActionPoints: [
          "Policy is documented and referenced in evidence.",
          "Consider creating a dedicated Complaints Management Policy separate from disclosures.",
        ],
        comments: [],
      },
      {
        id: "obl-006-2",
        section: "12 CFR",
        subsection: "§ 1024(b)",
        text: "Capture and investigate consumer complaints within SLA.",
        aiSummary: "Log all consumer complaints and resolve them within defined SLA timeframes, tracking outcomes.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: [],
        evidence: ["Disclosure QA Evidence Pack"],
        riskTags: ["Consumer Protection", "Operational"],
        aiActionPoints: [
          "Zendesk integration provides complaint tracking — evidenced in QA pack.",
          "Link a monthly SLA performance report as ongoing evidence.",
        ],
        comments: [],
      },
      {
        id: "obl-006-3",
        section: "12 CFR",
        subsection: "§ 1024(c)",
        text: "Report complaint data to regulators on request.",
        aiSummary: "Provide structured complaint data to CFPB or state regulators when formally requested.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["Regulatory Reporting Procedure"],
        linkedControls: [],
        evidence: ["Q1 Licence Attestation"],
        riskTags: ["Reporting", "Regulatory"],
        aiActionPoints: [
          "Reporting procedure is in place and evidenced.",
          "Confirm data format aligns with CFPB's current submission requirements.",
        ],
        comments: [],
      },
    ],
    auditHistory: [
      { id: "aud-006-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-02-10T09:00:00Z" },
      { id: "aud-006-2", actor: "Alex Chen", action: "Moved to Reviewed", timestamp: "2026-02-18T10:00:00Z" },
      { id: "aud-006-3", actor: "Sarah Okonkwo (Global CCO)", action: "Decision Approved", timestamp: "2026-02-20T09:00:00Z", rationale: "Process mature and well evidenced." },
    ],
  },
  {
    id: "reg-007",
    title: "Bank Secrecy Act — Recordkeeping & Travel Rule",
    regulator: "FinCEN",
    jurisdiction: "United States",
    type: "AML/CFT",
    risk: "Medium",
    applicability: "Applicable",
    aiApplicability: "Applicable",
    decisionState: "Draft",
    assignee: "Maya Patel",
    controlCoverage: 55,
    policyCoverage: 40,
    aiSummary:
      "MSBs must collect and retain records for transfers of $3,000 or more, including sender and recipient information. The Travel Rule requires that certain information travel with transfers above the threshold.",
    humanSummary:
      "Applicable to Wise US transfers above $3,000. Recordkeeping is in place. Travel Rule compliance is partially addressed — cross-border data transmission format is under review.",
    aiRationale:
      "Wise US Inc is a registered MSB conducting transfers above the $3,000 threshold. Both recordkeeping and Travel Rule obligations are in scope.",
    humanRationale:
      "Applicable. Recordkeeping controls exist. Travel Rule data format alignment with counterparty VASPs is an open item under the FATF guidance review.",
    workflow: {
      currentStage: "Obligations",
      currentAssignee: "Maya Patel",
      history: [
        { stage: "Applicability", assignee: "Maya Patel", completedAt: "2026-03-22T10:00:00Z", note: "Applicable — all transfers above threshold are in scope. Moving to obligations." },
      ],
    },
    obligations: [
      {
        id: "obl-007-1",
        section: "31 CFR",
        subsection: "§ 1010.410(e)",
        text: "Collect and retain sender and recipient information for transfers ≥ $3,000.",
        aiSummary: "Capture and store full sender and recipient details for all fund transfers at or above the $3,000 threshold.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: ["CTRL-US-AML-001 Transaction monitoring rules"],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Financial Crime", "Recordkeeping"],
        aiActionPoints: [
          "Recordkeeping process is covered by the AML policy and transaction monitoring control.",
          "Confirm data fields captured match the full BSA recordkeeping schedule.",
        ],
        comments: [],
      },
      {
        id: "obl-007-2",
        section: "31 CFR",
        subsection: "§ 1010.410(f)",
        text: "Transmit required information with transfers (Travel Rule).",
        aiSummary: "Pass originator and beneficiary data to the receiving institution alongside each qualifying transfer.",
        oblApplicability: "Applicable",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: [],
        riskTags: ["Financial Crime", "Regulatory"],
        aiActionPoints: [
          "Travel Rule data format alignment with counterparty VASPs is pending a vendor update.",
          "Link the vendor roadmap or technical specification as interim evidence.",
          "Create a downstream action to track FATF Travel Rule implementation by Q3 2026.",
        ],
        comments: [
          { id: "c-007-2-a", actor: "Maya Patel", text: "FATF Travel Rule implementation is pending vendor update. Expected Q3 2026. Marking partial for now — will reassess once vendor confirms format compatibility.", timestamp: "2026-03-22T10:30:00Z" },
        ],
      },
      {
        id: "obl-007-3",
        section: "31 CFR",
        subsection: "§ 1010.430(a)",
        text: "Retain records for five years.",
        aiSummary: "Store all required BSA records for a minimum of five years from the date of the transaction.",
        oblApplicability: "Applicable",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
        riskTags: ["Recordkeeping", "Regulatory"],
        aiActionPoints: [
          "Five-year retention is stated in the AML Policy.",
          "Link evidence of archive system configuration or data retention schedule.",
        ],
        comments: [],
      },
    ],
    auditHistory: [
      { id: "aud-007-1", actor: "Cardamon AI", action: "AI mapping generated", timestamp: "2026-03-20T09:00:00Z" },
      { id: "aud-007-2", actor: "Maya Patel", action: "Applicability confirmed", timestamp: "2026-03-22T10:00:00Z", rationale: "Applicable — all transfers above threshold are in scope." },
      { id: "aud-007-3", actor: "Maya Patel", action: "Record handed off to self for Obligations review", timestamp: "2026-03-22T10:01:00Z" },
    ],
  },
];

export const INITIAL_ACTIONS: DownstreamAction[] = [
  {
    id: "action-seed-001",
    title: "Draft material change notification procedure",
    sourceRegulation: "State Money Transmission Licensing Requirements",
    sourceObligation: "Notify regulator of material business changes.",
    gapReason: "Real gap requiring downstream remediation",
    owner: "Samir Khan",
    destination: "Policy workflow",
    status: "Created",
    evidenceExpected: ["Updated procedure document", "CCO sign-off"],
    dueDate: "2026-06-15",
    priority: "High",
    stageType: "Remediation",
  },
  {
    id: "action-seed-002",
    title: "Refresh AML training evidence pack (2025/26)",
    sourceRegulation: "FinCEN AML Programme Rule",
    sourceObligation: "Provide AML training to relevant staff.",
    gapReason: "Real gap requiring downstream remediation",
    owner: "Alex Chen",
    destination: "GRC issue",
    status: "Draft",
    evidenceExpected: ["Training completion records", "HR sign-off"],
    dueDate: "2026-05-31",
    priority: "High",
    stageType: "Remediation",
  },
  {
    id: "action-seed-003",
    title: "Document error resolution process for remittance transfers",
    sourceRegulation: "CFPB Remittance Transfer Rule",
    sourceObligation: "Maintain error resolution process.",
    gapReason: "Real gap requiring downstream remediation",
    owner: "Maya Patel",
    destination: "Policy workflow",
    status: "Draft",
    evidenceExpected: ["Error resolution policy", "Approval record"],
    dueDate: "2026-06-30",
    priority: "Medium",
    stageType: "Remediation",
  },
];

export const CONTEXTUAL_CHAT_RESPONSES: Record<string, string> = {
  "Why is this applicable?":
    "This appears applicable because Wise US Inc provides money transmission services in the United States. The obligation relates to licensed money transmitters and requires evidence of state-level compliance. The current human rationale limits applicability to US operations only.",
  "Challenge this decision":
    "The AI engine identified this regulation as applicable based on Wise US Inc's licence profile and operating scope. The human override to Partially applicable is noted. If you believe the scope should be narrowed further, you should update the human rationale and link the relevant jurisdictional scoping document as evidence before moving to Approved.",
  "What is not covered?":
    "Two or more obligations have incomplete coverage in this record. The specific gaps include obligations with no linked control evidence and obligations where a formal policy has not been linked. Both are marked as real gaps requiring downstream remediation. You can create a downstream action from each uncovered obligation.",
  "What evidence supports this?":
    "The primary evidence linked to this record includes the AML Policy v3.2, the Q1 Licence Attestation, and the Control Test Report from April 2026. Some obligations reference the Disclosure QA Evidence Pack. Evidence completeness varies by obligation — see the obligations panel for detail.",
};

export const TEAM_MEMBERS = [
  "Maya Patel",
  "Alex Chen",
  "Samir Khan",
  "Sarah Okonkwo",
];

export const STAGE_SEQUENCE: AssignmentStage[] = [
  "Applicability",
  "Obligations",
  "Controls & Evidence",
  "Approval",
];
