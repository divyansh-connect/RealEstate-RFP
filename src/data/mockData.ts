import type { UserProfile, RealtorContact, Conversation, PropertyDeal, AppNotification, AuditLogItem } from '../types/crm';

export const MOCK_USERS: UserProfile[] = [
  { id: 'usr-1', name: 'Alexander Vance', email: 'alex.vance@apexacquire.com', role: 'ADMIN', avatar: 'AV', title: 'Managing Director & Partner', status: 'Active' },
  { id: 'usr-2', name: 'Elena Rostova', email: 'elena.r@apexacquire.com', role: 'MANAGER', avatar: 'ER', title: 'Head of Acquisitions', status: 'Active' },
  { id: 'usr-3', name: 'Marcus Sterling', email: 'marcus.s@apexacquire.com', role: 'AGENT', avatar: 'MS', title: 'Senior Acquisition Specialist', status: 'Active' },
  { id: 'usr-4', name: 'Sophia Chen', email: 'sophia.c@apexacquire.com', role: 'AGENT', avatar: 'SC', title: 'Acquisition Associate', status: 'Active' },
  { id: 'usr-5', name: 'David Miller', email: 'david.m@apexacquire.com', role: 'READ_ONLY', avatar: 'DM', title: 'Investment Analyst', status: 'Active' },
];

export const INITIAL_CONTACTS: RealtorContact[] = [
  {
    id: 'cnt-101',
    name: 'Sarah Jenkins',
    licenseNumber: 'TREC #0748291',
    brokerage: 'Compass Real Estate DFW',
    email: 'sarah.jenkins@compass.com',
    phone: '(214) 892-4102',
    market: 'Dallas Metro - Highland Park',
    status: 'Responded',
    ownerId: 'usr-3',
    ownerName: 'Marcus Sterling',
    tags: ['High Volume', 'Luxury Specialist'],
    lastContacted: '10 mins ago',
    lastResponse: '5 mins ago',
    grade: 'A',
    score: 94,
    notes: ['Motivated seller for fast 14-day cash settlement.']
  },
  {
    id: 'cnt-102',
    name: 'Robert Vance',
    licenseNumber: 'TREC #0619284',
    brokerage: 'Keller Williams Urban Dallas',
    email: 'r.vance@kw.com',
    phone: '(972) 341-8820',
    market: 'Fort Worth / Tarrant',
    status: 'Escalated',
    ownerId: 'usr-4',
    ownerName: 'Sophia Chen',
    tags: ['Fixer Upper'],
    lastContacted: '1 hour ago',
    lastResponse: '42 mins ago',
    grade: 'A',
    score: 88,
    notes: ['Awaiting final seller confirmation before Monday listing.']
  },
  {
    id: 'cnt-103',
    name: 'Amanda Brooks',
    licenseNumber: 'TREC #0812930',
    brokerage: 'Coldwell Banker Apex',
    email: 'abrooks@coldwellbanker.com',
    phone: '(214) 559-0012',
    market: 'Plano / Frisco',
    status: 'Active in Outreach',
    ownerId: 'usr-3',
    ownerName: 'Marcus Sterling',
    tags: ['Suburbs'],
    lastContacted: '2 hours ago',
    lastResponse: '1 hour ago',
    grade: 'B',
    score: 76,
    notes: []
  },
  {
    id: 'cnt-104',
    name: 'Michael Chang',
    licenseNumber: 'TREC #0592817',
    brokerage: 'RE/MAX Premier DFW',
    email: 'mchang@remax.net',
    phone: '(469) 782-9901',
    market: 'Arlington / Mansfield',
    status: 'Responded',
    ownerId: 'usr-2',
    ownerName: 'Elena Rostova',
    tags: ['REO Specialist'],
    lastContacted: '3 hours ago',
    lastResponse: '2 hours ago',
    grade: 'A',
    score: 91,
    notes: ['3209 Oakridge Dr, Arlington TX available under market.']
  },
  {
    id: 'cnt-105',
    name: 'Jessica Thorne',
    licenseNumber: 'TREC #0928374',
    brokerage: 'Ebby Halliday Realtors',
    email: 'jessica.thorne@ebby.com',
    phone: '(972) 881-2390',
    market: 'Dallas Metro - Uptown',
    status: 'Opted Out',
    ownerId: 'usr-4',
    ownerName: 'Sophia Chen',
    tags: ['Unresponsive'],
    lastContacted: '1 day ago',
    lastResponse: '1 day ago',
    grade: 'D',
    score: 22,
    notes: []
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    contactId: 'cnt-101',
    realtorName: 'Sarah Jenkins',
    realtorPhone: '(214) 892-4102',
    realtorEmail: 'sarah.jenkins@compass.com',
    brokerage: 'Compass Real Estate DFW',
    latestMessage: 'Yes, 4812 Bordeaux Ave in Highland Park! Asking $1,450,000, roof needs work. Can close in 14 days.',
    timestamp: '5 mins ago',
    grade: 'A',
    score: 94,
    gradeReason: 'Captured property address (4812 Bordeaux Ave), asking price ($1.45M), and fast closing timeline.',
    status: 'Leads With Address',
    aiStatus: 'Active',
    unread: true,
    classification: 'Has Property',
    messages: [
      { id: 'm1', sender: 'ai', text: 'Hi Sarah, Marcus here with Apex Capital. Looking for off-market deals in Highland Park.', timestamp: '10:15 AM', channel: 'sms' },
      { id: 'm2', sender: 'realtor', text: 'Hey Marcus! I have an estate property before MLS listing.', timestamp: '10:18 AM', channel: 'sms' },
      { id: 'm3', sender: 'ai', text: 'Great! What is the address and asking price?', timestamp: '10:19 AM', channel: 'sms' },
      { id: 'm4', sender: 'realtor', text: 'Yes, 4812 Bordeaux Ave in Highland Park! Asking $1,450,000, roof needs work. Can close in 14 days.', timestamp: '10:22 AM', channel: 'sms' }
    ],
    propertyCaptured: {
      address: '4812 Bordeaux Ave',
      city: 'Dallas',
      state: 'TX',
      zip: '75205',
      askingPrice: 1450000,
      beds: 4,
      baths: 3.5,
      sqft: 3820,
      condition: 'Cosmetic & roof update required',
      timeline: '14 Days Cash Close',
      intent: 'Probate Estate Settlement'
    }
  },
  {
    id: 'conv-2',
    contactId: 'cnt-102',
    realtorName: 'Robert Vance',
    realtorPhone: '(972) 341-8820',
    realtorEmail: 'r.vance@kw.com',
    brokerage: 'Keller Williams Urban Dallas',
    latestMessage: 'I need to check with the seller if they want to entertain cash offers before listing on Monday.',
    timestamp: '42 mins ago',
    grade: 'A',
    score: 88,
    gradeReason: 'High intent, timeline urgency indicated (listing Monday), waiting on final seller confirmation.',
    status: 'Needs Human',
    aiStatus: 'Human Takeover',
    unread: false,
    classification: 'Interested',
    messages: [
      { id: 'm10', sender: 'ai', text: 'Hello Robert, do you have single-family inventory in Tarrant County?', timestamp: '09:00 AM', channel: 'sms' },
      { id: 'm11', sender: 'realtor', text: 'I might have a 3/2 near Arlington. Owner hesitant about investor lowballs.', timestamp: '09:30 AM', channel: 'sms' },
      { id: 'm12', sender: 'human', text: 'Hi Robert, Marcus from Apex taking over. We pay fair market cash with zero seller commission fees.', timestamp: '09:40 AM', channel: 'sms' },
      { id: 'm13', sender: 'realtor', text: 'I need to check with the seller if they want to entertain cash offers before listing on Monday.', timestamp: '09:45 AM', channel: 'sms' }
    ]
  }
];

export const INITIAL_DEALS: PropertyDeal[] = [
  {
    id: 'dl-1',
    conversationId: 'conv-1',
    contactId: 'cnt-101',
    address: '4812 Bordeaux Ave',
    city: 'Dallas',
    state: 'TX',
    zip: '75205',
    askingPrice: 1450000,
    beds: 4,
    baths: 3.5,
    sqft: 3820,
    yearBuilt: 1998,
    propertyType: 'Single Family Residence',
    stage: 'Qualifying',
    isAiInbound: true,
    ownerId: 'usr-3',
    ownerName: 'Marcus Sterling',
    grade: 'A',
    score: 94,
    realtorName: 'Sarah Jenkins',
    realtorBrokerage: 'Compass Real Estate DFW',
    realtorPhone: '(214) 892-4102',
    realtorEmail: 'sarah.jenkins@compass.com',
    createdAt: 'Today, 10:22 AM',
    updatedAt: '10 mins ago',
    source: 'AI Outreach Capture',
    underwriting: {
      arv: 1850000,
      estimatedRehab: 280000,
      targetWholesaleFee: 75000,
      calculatedMao: 1495000
    },
    offerDetails: {
      purchasePrice: 1380000,
      earnestMoney: 25000,
      optionFee: 1000,
      optionPeriodDays: 5,
      closingDate: '2026-09-25',
      buyerEntity: 'Apex Acquisitions DFW LLC',
      sellerName: 'Estate of Thomas Bordeaux',
      titleCompany: 'Republic Title - Turtle Creek',
      financingType: 'Cash',
      inspectionPeriodDays: 5,
      specialProvisions: 'AS-IS cash acquisition with 5-day inspection period.'
    }
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'nt-1',
    title: 'High-Grade Address Discovered',
    message: 'Sarah Jenkins provided property address 4812 Bordeaux Ave (Grade A - 94/100).',
    type: 'address_captured',
    timestamp: '5 mins ago',
    read: false,
    targetPath: 'conversations'
  },
  {
    id: 'nt-2',
    title: 'Human Takeover Escalation',
    message: 'Robert Vance conversation requires human takeover regarding price negotiation.',
    type: 'conversation_escalated',
    timestamp: '42 mins ago',
    read: false,
    targetPath: 'conversations'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  { id: 'aud-1', actor: 'Alexander Vance (Admin)', action: 'Updated Global AI Persona & Instructions', timestamp: 'Today, 09:30 AM', affectedRecord: 'Settings / AI Engine' },
  { id: 'aud-2', actor: 'Elena Rostova (Manager)', action: 'Reassigned 12 contacts to Marcus Sterling', timestamp: 'Today, 08:15 AM', affectedRecord: 'Contacts Batch #41' }
];
