// ==================== URJA WELLNESS CLUB MOCK DATA ====================
// Developer-Ready Seed Data matching Screen & Workflow Specification

export const ROLES = ['ADMIN', 'COACH', 'RECEPTION', 'STOCK MANAGER', 'ACCOUNT USER'];

export const CENTERS = [
  { id: 'CTR01', name: 'URJA Wellness Club — Main Branch (Surat)' },
  { id: 'CTR02', name: 'URJA Wellness Club — City Light Branch' },
  { id: 'CTR03', name: 'URJA Wellness Club — Varachha Branch' },
];

export const USERS = [
  {
    id: 'USR01', name: 'Admin User', mobile: '9876543210', username: 'admin', role: 'ADMIN',
    access: { attendance: true, billing: true, payment: true, inventory: true, purchaseRate: true, profitReport: true, ledger: true, settings: true }
  },
  {
    id: 'USR02', name: 'Priya Sharma (Coach)', mobile: '9825011111', username: 'priya_coach', role: 'COACH',
    access: { attendance: true, billing: true, payment: true, inventory: false, purchaseRate: false, profitReport: false, ledger: false, settings: false }
  },
  {
    id: 'USR03', name: 'Rahul Receptionist', mobile: '9825022222', username: 'reception', role: 'RECEPTION',
    access: { attendance: true, billing: true, payment: true, inventory: false, purchaseRate: false, profitReport: false, ledger: true, settings: false }
  },
  {
    id: 'USR04', name: 'Ketan Stock Manager', mobile: '9825033333', username: 'stock_mgr', role: 'STOCK MANAGER',
    access: { attendance: false, billing: false, payment: false, inventory: true, purchaseRate: true, profitReport: false, ledger: false, settings: false }
  },
  {
    id: 'USR05', name: 'Anita Accountant', mobile: '9825044444', username: 'accountant', role: 'ACCOUNT USER',
    access: { attendance: false, billing: true, payment: true, inventory: true, purchaseRate: true, profitReport: true, ledger: true, settings: false }
  },
];

export const COACHES = [
  { id: 'C001', name: 'Priya Sharma', mobile: '9825011111', membersAssigned: 24 },
  { id: 'C002', name: 'Rahul Patel', mobile: '9825022222', membersAssigned: 18 },
  { id: 'C003', name: 'Anita Mehta', mobile: '9825044444', membersAssigned: 20 },
];

export const PACKAGES = [
  { id: 'P1', name: 'Basic 1 Month Plan', days: 30, amount: 2500 },
  { id: 'P2', name: 'Standard 3 Month Plan', days: 90, amount: 6000 },
  { id: 'P3', name: 'Premium 6 Month Plan', days: 180, amount: 10000 },
  { id: 'P4', name: 'Annual Wellness Plan', days: 365, amount: 18000 },
];

export const PROGRAM_TYPES = [
  'Weight Loss',
  'Weight Gain',
  'Weight Maintenance',
  'Fitness',
  'Healthy Lifestyle',
  'General Nutrition'
];

export const BATCH_TIMES = [
  '06:00 AM - 07:00 AM',
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM'
];

export const PRODUCTS = [
  {
    id: 'PRD-001', name: 'Nutrition Formula 1 Shake (Vanilla)', barcode: '8901001', category: 'Shake',
    purchasePrice: 1800, sellingPrice: 2500, mrp: 2750, openingStock: 20, currentStock: 15, minStock: 5,
    unit: 'Can', batchNo: 'BCH-2025-A', expiryDate: '2026-11-30', supplier: 'HerbaLife India Pvt Ltd', shelfNo: 'A-12', usageDays: 26, status: 'Good Stock'
  },
  {
    id: 'PRD-002', name: 'Personalized Protein Powder', barcode: '8901002', category: 'Supplement',
    purchasePrice: 1100, sellingPrice: 1500, mrp: 1650, openingStock: 15, currentStock: 4, minStock: 5,
    unit: 'Can', batchNo: 'BCH-2025-B', expiryDate: '2026-10-15', supplier: 'HerbaLife India Pvt Ltd', shelfNo: 'A-14', usageDays: 26, status: 'Low Stock'
  },
  {
    id: 'PRD-003', name: 'Aloe Concentrate Drink (Original)', barcode: '8901003', category: 'Drink',
    purchasePrice: 1200, sellingPrice: 1600, mrp: 1750, openingStock: 10, currentStock: 0, minStock: 4,
    unit: 'Bottle', batchNo: 'BCH-2025-C', expiryDate: '2026-04-10', supplier: 'NutriSupply Co', shelfNo: 'B-02', usageDays: 30, status: 'Out of Stock' },
  {
    id: 'PRD-004', name: 'Active Fiber Complex', barcode: '8901004', category: 'Supplement',
    purchasePrice: 900, sellingPrice: 1300, mrp: 1400, openingStock: 25, currentStock: 22, minStock: 5,
    unit: 'Can', batchNo: 'BCH-2025-D', expiryDate: '2026-03-25', supplier: 'HerbaLife India Pvt Ltd', shelfNo: 'B-05', usageDays: 30, status: 'Good Stock'
  },
  {
    id: 'PRD-005', name: 'Multivitamin Complex', barcode: '8901005', category: 'Supplement',
    purchasePrice: 600, sellingPrice: 900, mrp: 1000, openingStock: 40, currentStock: 32, minStock: 10,
    unit: 'Bottle', batchNo: 'BCH-2025-E', expiryDate: '2026-12-10', supplier: 'NutriSupply Co', shelfNo: 'C-01', usageDays: 30, status: 'Good Stock'
  },
  {
    id: 'PRD-006', name: 'Herbal Control Energy Tea', barcode: '8901006', category: 'Drink',
    purchasePrice: 750, sellingPrice: 1100, mrp: 1200, openingStock: 30, currentStock: 3, minStock: 6,
    unit: 'Pack', batchNo: 'BCH-2025-F', expiryDate: '2026-02-15', supplier: 'HerbaLife India Pvt Ltd', shelfNo: 'B-08', usageDays: 20, status: 'Low Stock'
  },
  {
    id: 'PRD-007', name: 'Cell-U-Loss Herbal Concentrate', barcode: '8901007', category: 'Supplement',
    purchasePrice: 850, sellingPrice: 1250, mrp: 1350, openingStock: 18, currentStock: 12, minStock: 5,
    unit: 'Bottle', batchNo: 'BCH-2025-G', expiryDate: '2026-08-20', supplier: 'NutriSupply Co', shelfNo: 'C-04', usageDays: 30, status: 'Good Stock'
  },
  {
    id: 'PRD-008', name: 'Dinoshake Chocolate (Kids)', barcode: '8901008', category: 'Shake',
    purchasePrice: 950, sellingPrice: 1400, mrp: 1500, openingStock: 12, currentStock: 2, minStock: 4,
    unit: 'Can', batchNo: 'BCH-2025-H', expiryDate: '2026-01-05', supplier: 'HerbaLife India Pvt Ltd', shelfNo: 'A-16', usageDays: 30, status: 'Low Stock'
  },
];

export const MEMBERS = [
  {
    id: 'URJA-00001', barcode: '890001', name: 'Amit Sureliya', mobile: '9426934500', altMobile: '9825099999',
    dob: '1990-05-15', gender: 'Male', joiningDate: '2025-09-11', address: 'B-402, Apple Heights', area: 'Vesu, Surat',
    coach: 'Priya Sharma', coachId: 'C001', batchTime: '07:00 AM - 08:00 AM', programType: 'Weight Loss',
    referralPerson: 'Rajesh Patel', notes: 'Diabetic history, target 10kg weight loss', photo: null,
    package: 'Standard 3 Month Plan', packageId: 'P2', startDate: '2025-09-11', expiryDate: '2025-12-10',
    totalDays: 90, amount: 6000, paid: 4750, pending: 1250, dueDate: '2025-10-15', paymentMode: 'Cash',
    receiptNo: 'RCP-1025', status: 'Active', weight: 78, targetWeight: 68, visitsCount: 86, lastPurchaseDate: '2025-09-01',
    nextRefillDate: '2025-10-05', lastPaymentDate: '2025-09-11',
  },
  {
    id: 'URJA-00002', barcode: '890002', name: 'Priya Desai', mobile: '9123456780', altMobile: '9900112233',
    dob: '1995-08-22', gender: 'Female', joiningDate: '2025-08-01', address: '12, Sunset Row House', area: 'Adajan, Surat',
    coach: 'Anita Mehta', coachId: 'C003', batchTime: '08:00 AM - 09:00 AM', programType: 'Healthy Lifestyle',
    referralPerson: 'Self Walk-in', notes: 'Regular attendance preferred', photo: null,
    package: 'Basic 1 Month Plan', packageId: 'P1', startDate: '2025-09-01', expiryDate: '2025-10-01',
    totalDays: 30, amount: 2500, paid: 2500, pending: 0, dueDate: null, paymentMode: 'UPI',
    receiptNo: 'RCP-1018', status: 'Expired', weight: 65, targetWeight: 58, visitsCount: 22, lastPurchaseDate: '2025-09-01',
    nextRefillDate: '2025-09-28', lastPaymentDate: '2025-09-01',
  },
  {
    id: 'URJA-00003', barcode: '890003', name: 'Rohan Shah', mobile: '9012345678', altMobile: '9876500001',
    dob: '1988-03-10', gender: 'Male', joiningDate: '2025-07-15', address: '401, Galaxy Complex', area: 'City Light, Surat',
    coach: 'Rahul Patel', coachId: 'C002', batchTime: '06:00 AM - 07:00 AM', programType: 'Fitness',
    referralPerson: 'Amit Sureliya', notes: 'Post workout shake routine', photo: null,
    package: 'Premium 6 Month Plan', packageId: 'P3', startDate: '2025-07-15', expiryDate: '2026-01-14',
    totalDays: 180, amount: 10000, paid: 10000, pending: 0, dueDate: null, paymentMode: 'Bank',
    receiptNo: 'RCP-0988', status: 'Active', weight: 88, targetWeight: 75, visitsCount: 64, lastPurchaseDate: '2025-09-15',
    nextRefillDate: '2025-10-15', lastPaymentDate: '2025-07-15',
  },
  {
    id: 'URJA-00004', barcode: '890004', name: 'Sneha Patel', mobile: '9988001122', altMobile: '9977001122',
    dob: '2000-11-05', gender: 'Female', joiningDate: '2025-09-20', address: '55, Shanti Nagar', area: 'Varachha, Surat',
    coach: 'Priya Sharma', coachId: 'C001', batchTime: '05:00 PM - 06:00 PM', programType: 'Weight Gain',
    referralPerson: 'Instagram Ad', notes: 'Underweight gain program', photo: null,
    package: 'Basic 1 Month Plan', packageId: 'P1', startDate: '2025-09-20', expiryDate: '2025-10-20',
    totalDays: 30, amount: 2500, paid: 1500, pending: 1000, dueDate: '2025-10-10', paymentMode: 'Cash',
    receiptNo: 'RCP-1044', status: 'Active', weight: 45, targetWeight: 52, visitsCount: 12, lastPurchaseDate: '2025-09-20',
    nextRefillDate: '2025-10-18', lastPaymentDate: '2025-09-20',
  },
  {
    id: 'URJA-00005', barcode: '890005', name: 'Ketan Modi', mobile: '9765432100', altMobile: '9865432100',
    dob: '1985-12-28', gender: 'Male', joiningDate: '2025-06-01', address: 'A-101, Titanium Plaza', area: 'Althan, Surat',
    coach: 'Rahul Patel', coachId: 'C002', batchTime: '07:00 AM - 08:00 AM', programType: 'Weight Maintenance',
    referralPerson: 'Dr. Mehta', notes: 'Cardio + shake routine', photo: null,
    package: 'Annual Wellness Plan', packageId: 'P4', startDate: '2025-06-01', expiryDate: '2026-05-31',
    totalDays: 365, amount: 18000, paid: 18000, pending: 0, dueDate: null, paymentMode: 'UPI',
    receiptNo: 'RCP-0890', status: 'Active', weight: 92, targetWeight: 80, visitsCount: 110, lastPurchaseDate: '2025-09-20',
    nextRefillDate: '2025-10-05', lastPaymentDate: '2025-06-01',
  },
  {
    id: 'URJA-00006', barcode: '890006', name: 'Nisha Joshi', mobile: '9654321000', altMobile: '9554321000',
    dob: '1993-07-14', gender: 'Female', joiningDate: '2025-09-25', address: '78, Green Park', area: 'Piplod, Surat',
    coach: 'Anita Mehta', coachId: 'C003', batchTime: '06:00 PM - 07:00 PM', programType: 'General Nutrition',
    referralPerson: 'Facebook Event', notes: 'Post pregnancy wellness', photo: null,
    package: 'Standard 3 Month Plan', packageId: 'P2', startDate: '2025-09-25', expiryDate: '2025-12-24',
    totalDays: 90, amount: 6000, paid: 6000, pending: 0, dueDate: null, paymentMode: 'Bank',
    receiptNo: 'RCP-1060', status: 'Active', weight: 62, targetWeight: 55, visitsCount: 8, lastPurchaseDate: '2025-09-25',
    nextRefillDate: '2025-10-22', lastPaymentDate: '2025-09-25',
  },
];

export const ATTENDANCE = [
  { id: 'ATT001', memberId: 'URJA-00001', memberName: 'Amit Sureliya', date: '2025-10-01', time: '07:42 AM', status: 'Present', shake: 'Formula 1 Shake', shakeCount: 1, tea: true, aloe: true, protein: false, fiber: false, remarks: 'Feeling energetic' },
  { id: 'ATT002', memberId: 'URJA-00003', memberName: 'Rohan Shah', date: '2025-10-01', time: '06:30 AM', status: 'Present', shake: 'Personalized Protein', shakeCount: 1, tea: true, aloe: true, protein: true, fiber: true, remarks: 'Post workout' },
  { id: 'ATT003', memberId: 'URJA-00004', memberName: 'Sneha Patel', date: '2025-10-01', time: '05:15 PM', status: 'Present', shake: 'Formula 1 Shake', shakeCount: 1, tea: false, aloe: false, protein: false, fiber: false, remarks: 'Gaining weight steadily' },
  { id: 'ATT004', memberId: 'URJA-00005', memberName: 'Ketan Modi', date: '2025-10-01', time: '07:15 AM', status: 'Present', shake: 'Formula 1 Shake', shakeCount: 2, tea: true, aloe: true, protein: true, fiber: false, remarks: 'Double shake taken' },
  { id: 'ATT005', memberId: 'URJA-00006', memberName: 'Nisha Joshi', date: '2025-09-30', time: '06:10 PM', status: 'Present', shake: 'Formula 1 Shake', shakeCount: 1, tea: true, aloe: false, protein: false, fiber: false, remarks: 'Evening batch' },
];

export const PAYMENTS = [
  { id: 'PAY1001', memberId: 'URJA-00001', memberName: 'Amit Sureliya', date: '2025-09-11', amount: 4000, cash: 1000, upi: 2000, bank: 0, credit: 1000, mode: 'Split', type: 'Package & Product Purchase', receiptNo: 'RCP-1025', status: 'Part Paid', balanceDue: 1250 },
  { id: 'PAY1002', memberId: 'URJA-00002', memberName: 'Priya Desai', date: '2025-09-01', amount: 2500, cash: 0, upi: 2500, bank: 0, credit: 0, mode: 'UPI', type: 'Package Fee', receiptNo: 'RCP-1018', status: 'Paid', balanceDue: 0 },
  { id: 'PAY1003', memberId: 'URJA-00003', memberName: 'Rohan Shah', date: '2025-07-15', amount: 10000, cash: 0, upi: 0, bank: 10000, credit: 0, mode: 'Bank', type: 'Package Fee', receiptNo: 'RCP-0988', status: 'Paid', balanceDue: 0 },
  { id: 'PAY1004', memberId: 'URJA-00004', memberName: 'Sneha Patel', date: '2025-09-20', amount: 1500, cash: 1500, upi: 0, bank: 0, credit: 1000, mode: 'Cash', type: 'Part Payment', receiptNo: 'RCP-1044', status: 'Part Paid', balanceDue: 1000 },
  { id: 'PAY1005', memberId: 'URJA-00005', memberName: 'Ketan Modi', date: '2025-06-01', amount: 18000, cash: 0, upi: 18000, bank: 0, credit: 0, mode: 'UPI', type: 'Package Fee', receiptNo: 'RCP-0890', status: 'Paid', balanceDue: 0 },
  { id: 'PAY1006', memberId: 'URJA-00006', memberName: 'Nisha Joshi', date: '2025-09-25', amount: 6000, cash: 0, upi: 0, bank: 6000, credit: 0, mode: 'Bank', type: 'Package Fee', receiptNo: 'RCP-1060', status: 'Paid', balanceDue: 0 },
];

export const MEMBER_LEDGERS = {
  'URJA-00001': [
    { date: '2025-09-01', particular: 'Product Purchase (Formula 1 + Aloe)', debit: 4000, credit: 0, balance: 4000, billNo: 'INV-1025' },
    { date: '2025-09-05', particular: 'UPI Payment Received', debit: 0, credit: 2000, balance: 2000, billNo: 'RCP-1030' },
    { date: '2025-09-10', particular: 'Cash Payment Received', debit: 0, credit: 750, balance: 1250, billNo: 'RCP-1040' },
  ],
  'URJA-00002': [
    { date: '2025-09-01', particular: 'Basic Package Purchase', debit: 2500, credit: 0, balance: 2500, billNo: 'INV-1018' },
    { date: '2025-09-01', particular: 'UPI Full Payment', debit: 0, credit: 2500, balance: 0, billNo: 'RCP-1018' },
  ],
  'URJA-00004': [
    { date: '2025-09-20', particular: 'Basic Package Purchase', debit: 2500, credit: 0, balance: 2500, billNo: 'INV-1044' },
    { date: '2025-09-20', particular: 'Cash Part Payment', debit: 0, credit: 1500, balance: 1000, billNo: 'RCP-1044' },
  ]
};

export const PURCHASES = [
  {
    id: 'PUR-001', supplier: 'HerbaLife India Pvt Ltd', invoiceNo: 'INV-HL-9981', date: '2025-09-15',
    totalAmount: 25000, paidAmount: 20000, supplierDue: 5000, paymentStatus: 'Part Paid',
    items: [
      { product: 'Nutrition Formula 1 Shake (Vanilla)', batchNo: 'BCH-2025-A', expiryDate: '2026-11-30', qty: 10, purchaseRate: 1800, amount: 18000 },
      { product: 'Herbal Control Energy Tea', batchNo: 'BCH-2025-F', expiryDate: '2026-02-15', qty: 10, purchaseRate: 700, amount: 7000 },
    ]
  },
  {
    id: 'PUR-002', supplier: 'NutriSupply Co', invoiceNo: 'INV-NS-4012', date: '2025-09-22',
    totalAmount: 18000, paidAmount: 18000, supplierDue: 0, paymentStatus: 'Paid',
    items: [
      { product: 'Multivitamin Complex', batchNo: 'BCH-2025-E', expiryDate: '2026-12-10', qty: 20, purchaseRate: 600, amount: 12000 },
      { product: 'Cell-U-Loss Herbal Concentrate', batchNo: 'BCH-2025-G', expiryDate: '2026-08-20', qty: 7, purchaseRate: 850, amount: 5950 },
    ]
  }
];

export const STOCK_ADJUSTMENTS = [
  { id: 'ADJ-001', date: '2025-09-28', product: 'Aloe Concentrate Drink (Original)', qty: 2, reason: 'Damaged during transit', user: 'Stock Manager (Ketan)' },
  { id: 'ADJ-002', date: '2025-09-25', product: 'Personalized Protein Powder', qty: 1, reason: 'Sample Used for Club Trial', user: 'Admin User' },
];

export const EXPENSES = [
  { id: 'EXP-001', date: '2025-10-01', category: 'Milk', amount: 450, paymentMode: 'Cash', remarks: '20 Liters Fresh Milk for Shake Center' },
  { id: 'EXP-002', date: '2025-10-01', category: 'Fruits', amount: 350, paymentMode: 'UPI', remarks: 'Bananas & Strawberries for Shake toppings' },
  { id: 'EXP-003', date: '2025-09-30', category: 'Cleaning', amount: 400, paymentMode: 'Cash', remarks: 'Sanitizer & Disinfectant Supplies' },
  { id: 'EXP-004', date: '2025-09-28', category: 'Electricity', amount: 4200, paymentMode: 'Bank', remarks: 'GEB Electricity Bill September' },
  { id: 'EXP-005', date: '2025-09-25', category: 'Rent', amount: 15000, paymentMode: 'Bank', remarks: 'Club Premises Monthly Rent' },
];

export const LEADS = [
  { id: 'L001', name: 'Vikram Singh', mobile: '9111222333', date: '2025-10-01', source: 'Walk-in', area: 'Vesu', interestedIn: 'Weight Loss', assignedTo: 'Priya Sharma', stage: 'NEW', followUpDate: '2025-10-04', remarks: 'Wants to lose 8kg before wedding' },
  { id: 'L002', name: 'Kavya Nair', mobile: '9222333444', date: '2025-09-30', source: 'WhatsApp', area: 'Adajan', interestedIn: 'Healthy Lifestyle', assignedTo: 'Rahul Patel', stage: 'CONTACTED', followUpDate: '2025-10-03', remarks: 'Enquired about 3 month package' },
  { id: 'L003', name: 'Deepak Rao', mobile: '9333444555', date: '2025-09-29', source: 'Referral', area: 'City Light', interestedIn: 'Fitness', assignedTo: 'Anita Mehta', stage: 'INVITED', followUpDate: '2025-10-02', remarks: 'Referred by Amit Sureliya' },
  { id: 'L004', name: 'Sunita Gupta', mobile: '9444555666', date: '2025-09-28', source: 'Social Media', area: 'Piplod', interestedIn: 'Weight Loss', assignedTo: 'Priya Sharma', stage: 'TRIAL', followUpDate: '2025-10-05', remarks: 'Attended 1 day shake trial' },
  { id: 'L005', name: 'Arjun Verma', mobile: '9555666777', date: '2025-09-27', source: 'Event', area: 'Althan', interestedIn: 'Weight Gain', assignedTo: 'Rahul Patel', stage: 'FOLLOW-UP', followUpDate: '2025-10-06', remarks: 'Call after 2 days' },
  { id: 'L006', name: 'Meera Krishnan', mobile: '9666777888', date: '2025-09-26', source: 'Friend', area: 'Vesu', interestedIn: 'General Nutrition', assignedTo: 'Anita Mehta', stage: 'JOINED', followUpDate: '2025-09-26', remarks: 'Converted to URJA-00006 Member' },
];

export const GUESTS = [
  { id: 'G001', name: 'Raj Kumar', mobile: '9777888999', introducedBy: 'Amit Sureliya (URJA-00001)', visitDate: '2025-10-01', shakeGiven: true, convertedMember: false, remarks: 'Sample Shake Tried' },
  { id: 'G002', name: 'Pooja Sharma', mobile: '9888999000', introducedBy: 'Rohan Shah (URJA-00003)', visitDate: '2025-09-30', shakeGiven: true, convertedMember: true, remarks: 'Joined Basic 1 Month Plan' },
];

export const WHATSAPP_MESSAGES = [
  {
    id: 'WA001', to: 'Amit Sureliya', mobile: '9876543210', type: 'Product Refill Reminder',
    messageEng: 'Namaste Amit Ji,\nYour nutrition product refill date is approaching.\nExpected refill date: 05/10/2025.\nFor refill assistance, please contact URJA WELLNESS CLUB.\nThank You.',
    messageGuj: 'નમસ્તે અમિતજી,\nતમારી Nutrition Productનો અંદાજિત Refill સમય નજીક આવી રહ્યો છે.\nઅંદાજિત તારીખ: 05/10/2025\nજરૂર હોય તો URJA WELLNESS CLUB નો સંપર્ક કરશો.\nઆભાર.',
    sentAt: '2025-10-01 09:00', status: 'Delivered'
  },
  {
    id: 'WA002', to: 'Priya Desai', mobile: '9123456780', type: 'Renewal Reminder',
    messageEng: 'Namaste Priya Ji,\nYour URJA Wellness membership has expired on 01/10/2025.\nRenew today to maintain your health journey!\nThank You.',
    messageGuj: 'નમસ્તે પ્રિયાજી,\nતમારું URJA Wellness સભ્યપદ 01/10/2025 એ પૂર્ણ થયેલ છે.\nનવીનીકરણ માટે સંપર્ક કરો.',
    sentAt: '2025-10-01 09:05', status: 'Read'
  },
  {
    id: 'WA003', to: 'Rohan Shah', mobile: '9012345678', type: 'Birthday Wish',
    messageEng: 'Happy Birthday Rohan Ji! 🎉\nWishing you good health, fitness & happiness.\n- URJA Wellness Club Team',
    messageGuj: 'હાર્દિક શુભેચ્છા રોહનજી! 🎉\nતમારું સ્વાસ્થ્ય ઉત્તમ રહે એવી URJA Wellness Club તરફથી શુભેચ્છા.',
    sentAt: '2025-10-01 08:00', status: 'Delivered'
  },
];

export const DAILY_CLOSING = [
  {
    date: '2025-09-30', cashCollection: 5800, creditSale: 1200, bankCollection: 3000, upiCollection: 9500,
    totalSales: 19500, expenses: 1200, expectedCash: 5800, actualCash: 5800, difference: 0, closed: true, closedBy: 'Admin'
  },
  {
    date: '2025-09-29', cashCollection: 4500, creditSale: 800, bankCollection: 2000, upiCollection: 3500,
    totalSales: 10800, expenses: 900, expectedCash: 4500, actualCash: 4500, difference: 0, closed: true, closedBy: 'Admin'
  },
];

export const AUDIT_LOGS = [
  { id: 'LOG-101', time: '10:35 AM', date: '2025-10-01', user: 'Reception (Rahul)', action: 'Attendance Marked', details: 'Amit Sureliya (URJA-00001) marked Present' },
  { id: 'LOG-102', time: '10:15 AM', date: '2025-10-01', user: 'Admin User', action: 'Bill Generated', details: 'Bill #INV-1025 created for Amit Sureliya (₹4,000)' },
  { id: 'LOG-103', time: '09:40 AM', date: '2025-10-01', user: 'Stock Manager', action: 'Stock Adjusted', details: 'Aloe Vera Drink reduced by 2 units (Transit Damage)' },
  { id: 'LOG-104', time: '09:00 AM', date: '2025-10-01', user: 'System Auto', action: 'WhatsApp Reminder Sent', details: 'Refill message sent to Amit Sureliya' },
];

export const SALES_BY_MODE_TODAY = [
  { name: 'Cash', value: 7000, color: '#4CAF50' },
  { name: 'UPI', value: 9500, color: '#2196F3' },
  { name: 'Bank', value: 3000, color: '#9C27B0' },
  { name: 'Credit', value: 2000, color: '#FF9800' },
];

export const MONTHLY_STATS = [
  { month: 'Apr', members: 42, revenue: 85000, shakes: 620 },
  { month: 'May', members: 48, revenue: 92000, shakes: 710 },
  { month: 'Jun', members: 52, revenue: 98000, shakes: 780 },
  { month: 'Jul', members: 55, revenue: 105000, shakes: 820 },
  { month: 'Aug', members: 58, revenue: 112000, shakes: 870 },
  { month: 'Sep', members: 64, revenue: 118500, shakes: 960 },
];

export const RECENT_ACTIVITIES = [
  { id: 1, type: 'payment', icon: '💳', text: 'Amit Sureliya paid ₹4,000 (Split: ₹1,000 Cash + ₹2,000 UPI + ₹1,000 Credit)', time: '10:32 AM', color: 'green' },
  { id: 2, type: 'member', icon: '👤', text: 'New member Nisha Joshi joined (URJA-00006)', time: '10:15 AM', color: 'blue' },
  { id: 3, type: 'attendance', icon: '✅', text: 'Barcode Scanned: Amit Sureliya marked Present at 07:42 AM', time: '07:42 AM', color: 'green' },
  { id: 4, type: 'stock', icon: '⚠️', text: '🔴 Low Stock Alert: Personalized Protein Powder (4 cans left)', time: '09:30 AM', color: 'red' },
  { id: 5, type: 'birthday', icon: '🎂', text: "Today is Rohan Shah's birthday! WhatsApp wish sent.", time: '09:00 AM', color: 'purple' },
  { id: 6, type: 'refill', icon: '🔔', text: 'Product Refill due in 4 days for Amit Sureliya (Formula 1 Shake)', time: '08:45 AM', color: 'orange' },
];

export const REFILL_REMINDERS = [
  { id: 'R001', memberId: 'URJA-00001', memberName: 'Amit Sureliya', mobile: '9426934500', product: 'Nutrition Formula 1 Shake', purchaseDate: '2025-09-01', expectedFinish: '2025-09-27', reminderDate: '2025-09-23', daysLeft: 4, status: 'DUE TODAY' },
  { id: 'R002', memberId: 'URJA-00003', memberName: 'Rohan Shah', mobile: '9012345678', product: 'Personalized Protein Powder', purchaseDate: '2025-09-15', expectedFinish: '2025-10-11', reminderDate: '2025-10-07', daysLeft: 10, status: 'UPCOMING' },
  { id: 'R003', memberId: 'URJA-00005', memberName: 'Ketan Modi', mobile: '9765432100', product: 'Herbal Control Energy Tea', purchaseDate: '2025-09-20', expectedFinish: '2025-10-10', reminderDate: '2025-10-06', daysLeft: 5, status: 'DUE SOON' },
  { id: 'R004', memberId: 'URJA-00006', memberName: 'Nisha Joshi', mobile: '9654321000', product: 'Multivitamin Complex', purchaseDate: '2025-09-25', expectedFinish: '2025-10-25', reminderDate: '2025-10-21', daysLeft: 20, status: 'UPCOMING' },
];
