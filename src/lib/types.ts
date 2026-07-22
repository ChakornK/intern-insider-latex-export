export interface ResumeDataFields {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  involvement: Involvement[];
  awards: Award[];
}

export interface ResumeData extends ResumeDataFields {
  sectionOrder: (keyof ResumeDataFields)[];
}

export interface PersonalInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  linkedinTitle: string;
  github: string;
  githubTitle: string;
  website: string;
  websiteTitle: string;
  otherLink: string;
  otherLinkTitle: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  additionalInfo: string;
}

export interface Skill {
  id: string;
  skills: string;
}

export interface Project {
  id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  ongoing: boolean;
  projectLink: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  location: string;
  date: string;
  additionalInfo: string;
}

export interface Involvement {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyActive: boolean;
  additionalInfo: string;
}

export interface Award {
  id: string;
  name: string;
  issuer: string;
  date: string;
  additionalInfo: string;
}

export interface ReactFiberNode {
  tag: number;
  type: any;
  stateNode: any;
  return: ReactFiberNode | null;
  child: ReactFiberNode | null;
  sibling: ReactFiberNode | null;
  memoizedProps: Record<string, any>;
  memoizedState: any;
  alternate: ReactFiberNode | null;
}
