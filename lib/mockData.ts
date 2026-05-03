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

export type Obligation = {
  id: string;
  text: string;
  coverageStatus: CoverageStatus;
  reasonCode?: ReasonCode;
  linkedPolicies: string[];
  linkedControls: string[];
  evidence: string[];
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
    assignee: "Maya Patel",
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
    obligations: [
      {
        id: "obl-001-1",
        text: "Maintain active licences in each operating state.",
        coverageStatus: "Covered",
        reasonCode: undefined,
        linkedPolicies: ["US Regulatory Licensing Policy"],
        linkedControls: ["CTRL-US-LIC-004 Licence register review"],
        evidence: ["Q1 Licence Attestation", "NMLS Annual Report 2025"],
      },
      {
        id: "obl-001-2",
        text: "Notify regulator of material business changes.",
        coverageStatus: "Not covered",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-001-3",
        text: "Maintain minimum net worth or surety bond requirements.",
        coverageStatus: "Covered",
        reasonCode: undefined,
        linkedPolicies: ["US Regulatory Licensing Policy"],
        linkedControls: ["CTRL-US-LIC-004 Licence register review"],
        evidence: ["Q1 Licence Attestation"],
      },
      {
        id: "obl-001-4",
        text: "Submit periodic regulatory reports.",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["Regulatory Reporting Procedure"],
        linkedControls: [],
        evidence: [],
      },
    ],
    auditHistory: [
      {
        id: "aud-001-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-03-01T09:00:00Z",
      },
      {
        id: "aud-001-2",
        actor: "Maya Patel",
        action: "Applicability confirmed",
        timestamp: "2026-03-05T11:30:00Z",
        before: "Not assessed",
        after: "Applicable",
        rationale: "Wise US Inc operates as an MSB in all 50 states.",
      },
      {
        id: "aud-001-3",
        actor: "Maya Patel",
        action: "Moved to Reviewed",
        timestamp: "2026-03-10T14:00:00Z",
      },
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
    assignee: "Maya Patel",
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
    obligations: [
      {
        id: "obl-002-1",
        text: "Maintain a written AML programme.",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: ["CTRL-US-AML-001 Transaction monitoring rules"],
        evidence: ["AML Policy v3.2"],
      },
      {
        id: "obl-002-2",
        text: "Appoint a compliance officer.",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
      },
      {
        id: "obl-002-3",
        text: "Conduct independent testing.",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: ["Control Test Report 2026-04"],
      },
      {
        id: "obl-002-4",
        text: "Provide AML training to relevant staff.",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-002-5",
        text: "Monitor and report suspicious activity (SAR filing).",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: ["CTRL-US-AML-001 Transaction monitoring rules"],
        evidence: ["AML Policy v3.2", "Control Test Report 2026-04"],
      },
    ],
    auditHistory: [
      {
        id: "aud-002-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-03-01T09:00:00Z",
      },
      {
        id: "aud-002-2",
        actor: "Maya Patel",
        action: "Human rationale added",
        timestamp: "2026-03-07T10:15:00Z",
        rationale: "Training evidence is stale. Will flag as partial gap.",
      },
      {
        id: "aud-002-3",
        actor: "Maya Patel",
        action: "Moved to Reviewed",
        timestamp: "2026-03-12T09:00:00Z",
      },
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
    assignee: "Alex Chen",
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
    obligations: [
      {
        id: "obl-003-1",
        text: "Provide required pre-payment disclosures.",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: ["CTRL-US-CFPB-006 Disclosure QA sample check"],
        evidence: ["Disclosure QA Evidence Pack"],
      },
      {
        id: "obl-003-2",
        text: "Provide receipt with transfer amount, fees and exchange rate.",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: ["CTRL-US-CFPB-006 Disclosure QA sample check"],
        evidence: ["Disclosure QA Evidence Pack"],
      },
      {
        id: "obl-003-3",
        text: "Maintain error resolution process.",
        coverageStatus: "Not covered",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-003-4",
        text: "Retain evidence of disclosures provided to consumers.",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: [],
        evidence: [],
      },
    ],
    auditHistory: [
      {
        id: "aud-003-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-03-01T09:00:00Z",
      },
      {
        id: "aud-003-2",
        actor: "Alex Chen",
        action: "Human summary edited",
        timestamp: "2026-04-02T15:00:00Z",
        rationale: "Clarified scope to consumer transfers only.",
      },
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
    assignee: "Maya Patel",
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
    obligations: [
      {
        id: "obl-004-1",
        text: "Screen customers against OFAC SDN list at onboarding.",
        coverageStatus: "Covered",
        linkedPolicies: ["Sanctions Screening Standard"],
        linkedControls: ["CTRL-US-SAN-002 Real-time sanctions screening"],
        evidence: ["Control Test Report 2026-04"],
      },
      {
        id: "obl-004-2",
        text: "Screen transactions in real time against applicable sanctions lists.",
        coverageStatus: "Covered",
        linkedPolicies: ["Sanctions Screening Standard"],
        linkedControls: ["CTRL-US-SAN-002 Real-time sanctions screening"],
        evidence: ["Control Test Report 2026-04"],
      },
      {
        id: "obl-004-3",
        text: "Maintain documented escalation and blocking procedures.",
        coverageStatus: "Covered",
        linkedPolicies: ["Sanctions Screening Standard"],
        linkedControls: ["CTRL-US-SAN-002 Real-time sanctions screening"],
        evidence: ["AML Policy v3.2"],
      },
    ],
    auditHistory: [
      {
        id: "aud-004-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-02-15T09:00:00Z",
      },
      {
        id: "aud-004-2",
        actor: "Maya Patel",
        action: "Applicability confirmed",
        timestamp: "2026-02-20T10:00:00Z",
        before: "Not assessed",
        after: "Applicable",
        rationale: "Confirmed in scope for all US operations.",
      },
      {
        id: "aud-004-3",
        actor: "Maya Patel",
        action: "Moved to Reviewed",
        timestamp: "2026-02-25T11:00:00Z",
      },
      {
        id: "aud-004-4",
        actor: "Sarah Okonkwo (Global CCO)",
        action: "Decision Approved",
        timestamp: "2026-03-01T09:00:00Z",
        rationale: "Controls verified. Screening vendor confirmed operational.",
      },
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
    assignee: "Samir Khan",
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
    obligations: [
      {
        id: "obl-005-1",
        text: "Maintain a written cybersecurity policy.",
        coverageStatus: "Covered",
        linkedPolicies: ["Incident Response Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
      },
      {
        id: "obl-005-2",
        text: "Designate a CISO responsible for cybersecurity programme.",
        coverageStatus: "Covered",
        linkedPolicies: ["Incident Response Policy"],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-005-3",
        text: "Conduct annual penetration testing.",
        coverageStatus: "Not assessed",
        reasonCode: "Not assessed",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-005-4",
        text: "Implement multi-factor authentication for critical systems.",
        coverageStatus: "Not assessed",
        reasonCode: "Not assessed",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-005-5",
        text: "Notify NYDFS of cybersecurity events within 72 hours.",
        coverageStatus: "Not assessed",
        reasonCode: "Not assessed",
        linkedPolicies: [],
        linkedControls: [],
        evidence: [],
      },
    ],
    auditHistory: [
      {
        id: "aud-005-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-03-15T09:00:00Z",
      },
      {
        id: "aud-005-2",
        actor: "Samir Khan",
        action: "Applicability overridden",
        timestamp: "2026-04-01T14:00:00Z",
        before: "Applicable",
        after: "Partially applicable",
        rationale:
          "Full programme applies to NY licensed entity only. Assessment ongoing.",
      },
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
    assignee: "Alex Chen",
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
    obligations: [
      {
        id: "obl-006-1",
        text: "Maintain a written complaint management policy.",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
      },
      {
        id: "obl-006-2",
        text: "Capture and investigate consumer complaints within SLA.",
        coverageStatus: "Covered",
        linkedPolicies: ["Customer Disclosures Policy"],
        linkedControls: [],
        evidence: ["Disclosure QA Evidence Pack"],
      },
      {
        id: "obl-006-3",
        text: "Report complaint data to regulators on request.",
        coverageStatus: "Covered",
        linkedPolicies: ["Regulatory Reporting Procedure"],
        linkedControls: [],
        evidence: ["Q1 Licence Attestation"],
      },
    ],
    auditHistory: [
      {
        id: "aud-006-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-02-10T09:00:00Z",
      },
      {
        id: "aud-006-2",
        actor: "Alex Chen",
        action: "Moved to Reviewed",
        timestamp: "2026-02-18T10:00:00Z",
      },
      {
        id: "aud-006-3",
        actor: "Sarah Okonkwo (Global CCO)",
        action: "Decision Approved",
        timestamp: "2026-02-20T09:00:00Z",
        rationale: "Process mature and well evidenced.",
      },
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
    obligations: [
      {
        id: "obl-007-1",
        text: "Collect and retain sender and recipient information for transfers ≥ $3,000.",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: ["CTRL-US-AML-001 Transaction monitoring rules"],
        evidence: ["AML Policy v3.2"],
      },
      {
        id: "obl-007-2",
        text: "Transmit required information with transfers (Travel Rule).",
        coverageStatus: "Partial",
        reasonCode: "Real gap requiring downstream remediation",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: [],
      },
      {
        id: "obl-007-3",
        text: "Retain records for five years.",
        coverageStatus: "Covered",
        linkedPolicies: ["US AML Policy"],
        linkedControls: [],
        evidence: ["AML Policy v3.2"],
      },
    ],
    auditHistory: [
      {
        id: "aud-007-1",
        actor: "Cardamon AI",
        action: "AI mapping generated",
        timestamp: "2026-03-20T09:00:00Z",
      },
    ],
  },
];

export const INITIAL_ACTIONS: DownstreamAction[] = [];

export const CONTEXTUAL_CHAT_RESPONSES: Record<string, string> = {
  "Why is this applicable?":
    "This appears applicable because Wise US Inc provides money transmission services in the United States. The obligation relates to licensed money transmitters and requires evidence of state-level compliance. The current human rationale limits applicability to US operations only.",
  "Explain the source":
    "This regulation is issued by the relevant federal or state regulator and forms part of the statutory framework governing money services businesses in the United States. The source text has been ingested from the regulator's official publication and summarised by the Cardamon AI engine.",
  "What evidence supports this?":
    "The primary evidence linked to this record includes the AML Policy v3.2, the Q1 Licence Attestation, and the Control Test Report from April 2026. Some obligations reference the Disclosure QA Evidence Pack. Evidence completeness varies by obligation — see the obligations panel for detail.",
  "What is not covered?":
    "Two or more obligations have incomplete coverage in this record. The specific gaps include obligations with no linked control evidence and obligations where a formal policy has not been linked. Both are marked as real gaps requiring downstream remediation. You can create a downstream action from each uncovered obligation.",
  "Challenge this decision":
    "The AI engine identified this regulation as applicable based on Wise US Inc's licence profile and operating scope. The human override to Partially applicable is noted. If you believe the scope should be narrowed further, you should update the human rationale and link the relevant jurisdictional scoping document as evidence before moving to Approved.",
};
