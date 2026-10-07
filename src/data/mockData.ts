// ==================== URJA WELLNESS CLUB MASTER BLUEPRINT MOCK DATA ====================
// Master Blueprint Version matching 27 Sections with Gujarati & English rich demo content

export const ROLES = ['OWNER', 'COACH', 'STAFF', 'MEMBER'];

export const USERS = [
  {
    id: 'USR01', name: 'Center Owner (Master Admin)', mobile: '9876543210', username: 'owner', role: 'OWNER',
    access: { all: true }
  },
  {
    id: 'USR02', name: 'Priya Sharma (Wellness Coach)', mobile: '9825011111', username: 'priya_coach', role: 'COACH',
    access: { members: true, attendance: true, wellness: true, photos: true, measurements: true, followup: true, reports: true }
  },
  {
    id: 'USR03', name: 'Rahul Receptionist (Staff)', mobile: '9825022222', username: 'staff', role: 'STAFF',
    access: { attendance: true, payment: true, stock: true, basicMembers: true }
  },
  {
    id: 'USR04', name: 'Amit Sureliya (Member Portal)', mobile: '9426934500', username: 'amit_member', role: 'MEMBER',
    memberId: 'URJA-00001', access: { memberPortal: true }
  }
];

export const COACHES = [
  { id: 'C001', name: 'Priya Sharma', mobile: '9825011111', assignedCount: 24 },
  { id: 'C002', name: 'Rahul Patel', mobile: '9825022222', assignedCount: 18 },
  { id: 'C003', name: 'Anita Mehta', mobile: '9825044444', assignedCount: 20 },
];

export const PACKAGES = [
  { id: 'P1', name: 'Basic 1 Month Plan', days: 30, amount: 2500 },
  { id: 'P2', name: 'Standard 3 Month Plan', days: 90, amount: 6000 },
  { id: 'P3', name: 'Premium 6 Month Plan', days: 180, amount: 10000 },
  { id: 'P4', name: 'Annual Wellness Plan', days: 365, amount: 18000 },
];

export const PROGRAM_TYPES = [
  'Weight Loss', 'Weight Gain', 'Weight Maintenance', 'Fitness', 'Healthy Lifestyle', 'General Nutrition'
];

export const BATCH_TIMES = [
  '06:00 AM - 07:00 AM',
  '07:00 AM - 08:00 AM',
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM'
];

export const PRODUCTS = [
  {
    id: 'PRD-001', name: 'Nutrition Formula 1 Shake (Vanilla)', barcode: '8901001', category: 'Shake',
    purchasePrice: 1800, sellingPrice: 2500, openingStock: 25, currentStock: 18, minStock: 5,
    unit: 'Can', batchNo: 'BCH-2025-A', supplier: 'HerbaLife India Pvt Ltd', status: 'Good Stock'
  },
  {
    id: 'PRD-002', name: 'Personalized Protein Powder', barcode: '8901002', category: 'Supplement',
    purchasePrice: 1100, sellingPrice: 1500, openingStock: 15, currentStock: 4, minStock: 5,
    unit: 'Can', batchNo: 'BCH-2025-B', supplier: 'HerbaLife India Pvt Ltd', status: 'Low Stock'
  },
  {
    id: 'PRD-003', name: 'Aloe Concentrate Drink (Original)', barcode: '8901003', category: 'Drink',
    purchasePrice: 1200, sellingPrice: 1600, openingStock: 10, currentStock: 0, minStock: 4,
    unit: 'Bottle', batchNo: 'BCH-2025-C', supplier: 'NutriSupply Co', status: 'Out of Stock'
  },
  {
    id: 'PRD-004', name: 'Afresh Energy Drink Mix (Lemon)', barcode: '8901004', category: 'Drink',
    purchasePrice: 650, sellingPrice: 900, openingStock: 30, currentStock: 22, minStock: 8,
    unit: 'Bottle', batchNo: 'BCH-2025-D', supplier: 'HerbaLife India Pvt Ltd', status: 'Good Stock'
  },
  {
    id: 'PRD-005', name: 'Active Fiber Complex', barcode: '8901005', category: 'Supplement',
    purchasePrice: 1300, sellingPrice: 1800, openingStock: 12, currentStock: 3, minStock: 4,
    unit: 'Can', batchNo: 'BCH-2025-E', supplier: 'NutriSupply Co', status: 'Low Stock'
  }
];

export const MEMBERS = [
  {
    id: 'URJA-00001', barcode: '890001', name: 'Amit Sureliya', photo: null, mobile: '9426934500',
    dob: '1990-05-15', age: 36, gender: 'Male', address: 'B-402, Apple Heights, Surat', occupation: 'Business',
    joiningDate: '2025-09-11', emergencyContact: '9825099999', wellnessGoal: 'Weight Loss & Visceral Fat Reduction',
    coach: 'Priya Sharma', coachId: 'C001', package: 'Standard 3 Month Plan', startDate: '2025-09-11',
    endDate: '2025-12-10', status: 'Active', amount: 6000, paid: 4750, pending: 1250,
    waterGoalLiters: 3.5, habitScore: '8/8 (Excellent)'
  },
  {
    id: 'URJA-00002', barcode: '890002', name: 'Priya Desai', photo: null, mobile: '9123456780',
    dob: '1995-08-22', age: 31, gender: 'Female', address: '12, Sunset Row House, Surat', occupation: 'Teacher',
    joiningDate: '2025-08-01', emergencyContact: '9900112233', wellnessGoal: 'Healthy Lifestyle & Energy',
    coach: 'Anita Mehta', coachId: 'C003', package: 'Basic 1 Month Plan', startDate: '2025-09-01',
    endDate: '2025-10-01', status: 'Expired', amount: 2500, paid: 2500, pending: 0,
    waterGoalLiters: 3.0, habitScore: '6/8 (Good)'
  },
  {
    id: 'URJA-00003', barcode: '890003', name: 'Rajesh Patel', photo: null, mobile: '9825012345',
    dob: '1988-11-10', age: 38, gender: 'Male', address: '45, VIP Road, Vesu, Surat', occupation: 'Engineer',
    joiningDate: '2025-09-15', emergencyContact: '9825088776', wellnessGoal: 'Weight Gain & Muscle Building',
    coach: 'Rahul Patel', coachId: 'C002', package: 'Standard 3 Month Plan', startDate: '2025-09-15',
    endDate: '2025-12-15', status: 'Active', amount: 6000, paid: 6000, pending: 0,
    waterGoalLiters: 4.0, habitScore: '7/8 (Very Good)'
  },
  {
    id: 'URJA-00004', barcode: '890004', name: 'Kavita Shah', photo: null, mobile: '9909011223',
    dob: '1992-03-30', age: 34, gender: 'Female', address: 'A-101, Green City, Adajan, Surat', occupation: 'Doctor',
    joiningDate: '2025-09-20', emergencyContact: '9909055443', wellnessGoal: 'Fitness & General Nutrition',
    coach: 'Priya Sharma', coachId: 'C001', package: 'Premium 6 Month Plan', startDate: '2025-09-20',
    endDate: '2026-03-20', status: 'Active', amount: 10000, paid: 7500, pending: 2500,
    waterGoalLiters: 3.2, habitScore: '8/8 (Excellent)'
  },
  {
    id: 'URJA-00005', barcode: '890005', name: 'Hardik Mehta', photo: null, mobile: '9712345678',
    dob: '1997-07-12', age: 29, gender: 'Male', address: '88, Silver residency, Katargam, Surat', occupation: 'IT Consultant',
    joiningDate: '2025-09-28', emergencyContact: '9712300000', wellnessGoal: 'Weight Loss & Stamina',
    coach: 'Rahul Patel', coachId: 'C002', package: 'Basic 1 Month Plan', startDate: '2025-09-28',
    endDate: '2025-10-28', status: 'Active', amount: 2500, paid: 1500, pending: 1000,
    waterGoalLiters: 3.5, habitScore: '5/8 (Average)'
  }
];

// Master Section 7: Body Measurements Timeline Data
export const MEMBER_MEASUREMENTS = {
  'URJA-00001': [
    {
      date: '2025-09-11', stage: 'Day 1 Baseline', weight: 78.0, height: 175, bmi: 25.5, bodyFat: 26.5,
      muscleMass: 54.0, visceralFat: 9, waist: 38.0, abdomen: 40.0, chest: 41.0, hip: 42.0, arm: 14.5, thigh: 23.0
    },
    {
      date: '2025-09-25', stage: 'Day 14 Review', weight: 76.2, height: 175, bmi: 24.9, bodyFat: 25.1,
      muscleMass: 54.5, visceralFat: 8, waist: 37.0, abdomen: 39.0, chest: 40.5, hip: 41.5, arm: 14.2, thigh: 22.5
    },
    {
      date: '2025-10-01', stage: 'Day 30 Progress', weight: 74.0, height: 175, bmi: 24.2, bodyFat: 23.8,
      muscleMass: 55.2, visceralFat: 7, waist: 35.5, abdomen: 37.5, chest: 40.0, hip: 40.5, arm: 14.0, thigh: 22.0
    }
  ],
  'URJA-00003': [
    {
      date: '2025-09-15', stage: 'Day 1 Baseline', weight: 62.0, height: 178, bmi: 19.5, bodyFat: 14.5,
      muscleMass: 48.0, visceralFat: 4, waist: 30.0, abdomen: 31.0, chest: 36.0, hip: 35.0, arm: 11.5, thigh: 19.0
    },
    {
      date: '2025-10-01', stage: 'Day 14 Review', weight: 64.5, height: 178, bmi: 20.3, bodyFat: 15.2,
      muscleMass: 50.2, visceralFat: 4, waist: 30.5, abdomen: 31.5, chest: 37.5, hip: 36.0, arm: 12.5, thigh: 20.2
    }
  ]
};

// Master Section 6: Photo Management Baseline & Comparisons
export const MEMBER_PHOTOS = {
  'URJA-00001': [
    { date: '2025-09-11', stage: 'Day 1 Baseline', front: '📸 Baseline Front View', side: '📸 Baseline Side View', back: '📸 Baseline Back View' },
    { date: '2025-10-01', stage: 'Day 30 Progress', front: '📸 Day 30 Front View', side: '📸 Day 30 Side View', back: '📸 Day 30 Back View' }
  ],
  'URJA-00003': [
    { date: '2025-09-15', stage: 'Day 1 Baseline', front: '📸 Day 1 Baseline Front', side: '📸 Day 1 Baseline Side', back: '📸 Day 1 Baseline Back' }
  ]
};

// Master Section 8, 9, 10, 11, 12, 13: Daily Nutrition, Hydration, Activity, Sleep, Stress & Habits
export const DAILY_WELLNESS_LOGS = {
  'URJA-00001': {
    date: '2025-10-01',
    food: {
      breakfast: 'Formula 1 Shake (Vanilla) + 1 Scoop Protein + Herbal Tea',
      lunch: '2 Roti + Green Vegetables + Salad + Dal + Curd',
      dinner: '1 Roti + Vegetable Soup + Sprouts',
      snacks: 'Fruits (Apple & Almonds)',
      proteinSources: 'Herbalife Protein Powder, Sprouts, Curd',
      waterLiters: 3.5
    },
    hydration: { goal: 3.5, morning: 1.0, afternoon: 1.5, evening: 1.0, total: 3.5 },
    activity: { steps: 8400, walkingMin: 45, exercise: 'Cardio & Light Weights', strengthMin: 30, activeMin: 75 },
    sleep: { sleepTime: '10:30 PM', wakeTime: '06:00 AM', totalHours: 7.5, quality: 'Good' },
    stress: { stressLevel: 2, breathingDone: true, meditationDone: true, screenBreakDone: true },
    habitsChecklist: {
      nutrition: true, water: true, activity: true, sleep: true,
      fruitsVeg: true, movement: true, stressMgmt: true, centerSession: true
    },
    habitScore: '8/8 Excellent'
  }
};

// Master Section 4: Attendance Records
export const ATTENDANCE_RECORDS = [
  { id: 'ATT01', memberId: 'URJA-00001', memberName: 'Amit Sureliya', date: '2025-10-01', time: '07:42 AM', session: 'Morning Batch', coach: 'Priya Sharma', status: 'Present', shakeCount: 1, aloeServed: true, proteinServed: true },
  { id: 'ATT02', memberId: 'URJA-00003', memberName: 'Rajesh Patel', date: '2025-10-01', time: '08:15 AM', session: 'Morning Batch', coach: 'Rahul Patel', status: 'Present', shakeCount: 2, aloeServed: true, proteinServed: true },
  { id: 'ATT03', memberId: 'URJA-00004', memberName: 'Kavita Shah', date: '2025-10-01', time: '08:45 AM', session: 'Morning Batch', coach: 'Priya Sharma', status: 'Present', shakeCount: 1, aloeServed: false, proteinServed: true },
  { id: 'ATT04', memberId: 'URJA-00002', memberName: 'Priya Desai', date: '2025-09-30', time: '08:15 AM', session: 'Morning Batch', coach: 'Anita Mehta', status: 'Absent', shakeCount: 0, aloeServed: false, proteinServed: false }
];

// Master Section 14: Payment & Ledger
export const PAYMENT_TRANSACTIONS = [
  { id: 'PAY01', memberId: 'URJA-00001', memberName: 'Amit Sureliya', date: '2025-09-11', particular: 'Standard 3 Month Package', debit: 6000, credit: 4750, balance: 1250, mode: 'UPI & Cash', receiptNo: 'RCP-1025', amount: 4750 },
  { id: 'PAY02', memberId: 'URJA-00003', memberName: 'Rajesh Patel', date: '2025-09-15', particular: 'Standard 3 Month Package', debit: 6000, credit: 6000, balance: 0, mode: 'UPI', receiptNo: 'RCP-1026', amount: 6000 },
  { id: 'PAY03', memberId: 'URJA-00004', memberName: 'Kavita Shah', date: '2025-09-20', particular: 'Premium 6 Month Package', debit: 10000, credit: 7500, balance: 2500, mode: 'Bank Transfer', receiptNo: 'RCP-1027', amount: 7500 }
];

// Master Section 18: Follow-up System List
export const FOLLOW_UP_LIST = [
  { id: 'FLW01', memberId: 'URJA-00001', memberName: 'Amit Sureliya', reason: '🔴 Measurement & Progress Review Due (Day 30)', status: 'Pending', coach: 'Priya Sharma', dueDate: '2025-10-01' },
  { id: 'FLW02', memberId: 'URJA-00002', memberName: 'Priya Desai', reason: '🔴 Package Expired & 3+ Days Absent', status: 'Pending', coach: 'Anita Mehta', dueDate: '2025-10-01' },
  { id: 'FLW03', memberId: 'URJA-00005', memberName: 'Hardik Mehta', reason: '🥤 Nutrition Stock Refill Reminder', status: 'Pending', coach: 'Rahul Patel', dueDate: '2025-10-02' }
];

// Master Section 17: WhatsApp Message Templates (Gujarati & English)
export const WHATSAPP_TEMPLATES = [
  {
    type: 'Payment Pending',
    eng: 'Namaste {name} Ji,\nYour payment balance of ₹{pending} is pending at URJA Wellness Club. Please clear at your earliest convenience.\nThank You.',
    guj: 'નમસ્તે {name}જી,\nURJA Wellness Club માં આપનું ₹{pending} પેમેન્ટ બાકી છે. કૃપા કરીને વહેલી તકે ચુકવણું કરવા નમ્ર વિનંતી.\nઆભાર.'
  },
  {
    type: 'Renewal Alert',
    eng: 'Namaste {name} Ji,\nYour wellness package is nearing completion. Renew today to maintain your health journey!\nThank You.',
    guj: 'નમસ્તે {name}જી,\nતમારું wellness package પૂર્ણ થવા આવ્યું છે. સ્વાસ્થ્ય યાત્રા ચાલુ રાખવા આજે જ રિન્યુ કરો.\nઆભાર.'
  },
  {
    type: 'Attendance Missed',
    eng: 'Namaste {name} Ji,\nWe missed you at URJA Wellness Club today for your session. Consistency is key to your transformation!\nThank You.',
    guj: 'નમસ્તે {name}જી,\nઆજે URJA Wellness Club ખાતે આપનું wellness session બાકી છે. સાતત્ય જ પરિણામ આપશે!'
  },
  {
    type: 'Progress Review Due',
    eng: 'Namaste {name} Ji,\nYour next body measurement & photo transformation review is due today! See you at the center.\nThank You.',
    guj: 'નમસ્તે {name}જી,\nઆપનું આગામી બૉડી મેઝરમેન્ટ અને પ્રોગ્રેસ રિવ્યૂ બાકી છે. સેન્ટર પર પધારવા વિનંતી.'
  }
];

export const SALES_BY_MODE_TODAY = [
  { name: 'Cash', value: 4500, color: '#16a34a' },
  { name: 'UPI', value: 8200, color: '#0284c7' },
  { name: 'Bank Transfer', value: 3000, color: '#9333ea' },
  { name: 'Credit', value: 1250, color: '#e11d48' }
];

export const MONTHLY_STATS = [
  { month: 'May', revenue: 45000, members: 28, shakes: 650 },
  { month: 'Jun', revenue: 52000, members: 32, shakes: 720 },
  { month: 'Jul', revenue: 61000, members: 38, shakes: 850 },
  { month: 'Aug', revenue: 58000, members: 36, shakes: 810 },
  { month: 'Sep', revenue: 74000, members: 45, shakes: 980 },
  { month: 'Oct', revenue: 82000, members: 50, shakes: 1100 }
];

export const RECENT_ACTIVITIES = [
  { id: 1, text: 'Amit Sureliya marked Attendance at 07:42 AM', time: '10 min ago', type: 'attendance', color: 'green', icon: '✅' },
  { id: 2, text: 'Payment of ₹4,750 received from Amit Sureliya via UPI', time: '25 min ago', type: 'payment', color: 'blue', icon: '💰' },
  { id: 3, text: 'Day 30 Body Measurement recorded for Amit Sureliya', time: '1 hour ago', type: 'measurement', color: 'purple', icon: '📏' },
  { id: 4, text: 'Formula 1 Shake Stock low alert triggered (4 cans remaining)', time: '2 hours ago', type: 'alert', color: 'red', icon: '📦' }
];

export const LEADS = [
  { id: 'LD01', name: 'Ramesh Patel', mobile: '9898011223', source: 'Walk-in', coach: 'Priya Sharma', stage: 'New Lead', notes: 'Interested in weight loss program', lastContact: 'Today' },
  { id: 'LD02', name: 'Suman Shah', mobile: '9727044556', source: 'WhatsApp', coach: 'Rahul Patel', stage: 'Visited', notes: 'Attended free trial session', lastContact: 'Yesterday' }
];

export const GUESTS = [
  { id: 'GST01', name: 'Mahesh Vyas', mobile: '9988776655', introducedBy: 'Amit Sureliya', visitDate: '2025-10-01', shakeGiven: true, converted: false }
];
