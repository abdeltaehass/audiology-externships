import { Timestamp } from "firebase/firestore";

export interface UserModel {
  uid: string;
  name: string;
  profileImage: string;
  email: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface PostModel {
  uid: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  question1: string; // Externship Site Name
  question2: string; // Graduation/Completion Year
  question3: string; // Externship in the US?
  question4?: string; // Externship Location (if not in the US)
  question5: string; // City of Externship
  question6?: string; // Externship State or Territory (if in the US)
  question7: string; // Duration of Externship
  question8: string; // Number of days per week
  question9: string; // Hours per day
  question10: string; // Compensation provided?
  question11?: string; // Annual Compensation (if compensation provided)
  question12?: string; // Compensation distribution (if compensation provided)
  question13: string; // Health insurance or other benefits?
  question14?: string; // Details about benefits (if benefits provided)
  question15: string; // Number of preceptors
  question16: string; // Preceptors and CCC-A
  question17: string; // Preceptor's background
  question18: string; // Feedback style of preceptors
  question19: string; // How supported did you feel during the externship?
  question20: string; // Clinic population
  question21: string[]; // Diversity of clientele (racial and ethnic identities)
  question22: string[]; // Predominant population (select any 2)
  question23: string[]; // Socioeconomic categories seen in the clinic
  question24: string; // Predominant socioeconomic population
  question25: string; // Rotations for specialties
  question26?: string; // Details about rotations (if rotations available)
  question27: string[]; // Experiences provided to students
  question28: string; // Frequency of routine audiological testing
  question29: string; // Frequency of hearing aid consultation
  question30: string; // Frequency of hearing aid fitting
  question31: string; // Frequency of hearing aid follow up
  question32: string; // Frequency of ABR
  question33: string; // Frequency of other electrophysiological measures
  question34: string; // Frequency of OAEs
  question35: string; // Frequency of CPA
  question36: string; // Frequency of VRA
  question37: string; // Frequency of CAPD testing
  question38: string; // Frequency of tinnitus evaluation
  question39: string; // Frequency of tinnitus management
  question40: string; // Frequency of vestibular testing
  question41: string; // Frequency of vestibular rehabilitation
  question42: string; // Frequency of CI evaluation
  question43: string; // Frequency of CI activation and follow up
  question44: string; // Frequency of aural rehabilitation
  question45: string; // Frequency of group rehabilitation
  question46: string; // Frequency of intra-operative monitoring
  question47: string; // Duration of shadowing preceptors
  question48: string; // Duration before students are independent
  question49: string; // Do students have independent schedules?
  question50: string; // Number of sites and student placement
  question51: string; // Availability of hearing aid technicians or other staff
  question52: string[]; // Professionals the clinic collaborates with
  question53: string; // Frequency of inter-professional meetings
  question54: string; // Frequency of departmental meetings
  question55: string; // Extern's expected contribution to meetings
  question56: string; // Research opportunities available?
  question57?: string; // Is research required? (if research opportunities available)
  question58?: string; // Time allotted for research (if research opportunities available)
  question59?: string; // Research opportunities involve (if research opportunities available)
  question60: string; // Time off provided to attend conferences?
  question61: string; // Continuing education opportunities
  question62: string; // Where the externship was advertised
  question63: string; // Specialty/most attractive feature of the externship
  question64: string; // Weaknesses of the externship
  question65: string; // Details about lunch breaks
  question66: string; // Externship site looking to hire students post-externship?
  question67: string; // Cost of living in the area
  question68: string; // Affordable housing in the area
}

export interface SurveyStep {
  id: string;
  stepId: string;
  stepTitle: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SurveyQuestion {
  id: string;
  questionId: string;
  stepId: string;
  title: string;
  type: "radiogroup" | "text" | "comment" | "checkbox";
  choices?: string[];
  isRequired: boolean;
  showOtherItem?: boolean;
  otherText?: string;
  otherPlaceholder?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
