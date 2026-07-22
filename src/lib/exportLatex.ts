// @ts-ignore
import TEX_PREAMBLE from "../tex/preamble.tex" with { mode: "text" };
// @ts-ignore
import TEX_RESUME_CMDS from "../tex/resumeCmds.tex" with { mode: "text" };
import { escLatex } from "./helpers";
import type {
  Award,
  Certification,
  CoverLetterData,
  Education,
  Experience,
  Involvement,
  PersonalInfo,
  Project,
  ReactFiberNode,
  ResumeData,
  ResumeDataFields,
  Skill,
} from "./types";

const TEX_SEPARATOR = `\n\n%${Array.from({ length: 40 }, () => "-").join("")}\n\n`;

/**
 * @param date - Date in YYYY-MM format
 */
const formatDate = (date: string) =>
  new Date(`${date}-1`).toLocaleDateString("en-US", { month: "short", year: "numeric" });

const formatTimeRange = (start: string, end: string, isToPresent: boolean) => {
  if (start === end) {
    return formatDate(start);
  }

  const startMonth = formatDate(start);
  const endMonth = isToPresent ? "Present" : formatDate(end);
  return `${startMonth} - ${endMonth}`;
};

const formatPhoneNumber = (t: string) => {
  if (!t.match(/^\d+$/)) return t;
  const padded = t.padStart(10, "0");
  return `${padded.slice(0, 3)}-${padded.slice(3, 6)}-${padded.slice(6, 10)}`;
};

/**
 * @param list - List of items separated by newlines
 * ```md
 * - Item 1
 * - Item 2
 * ```
 */
const formatBulletList = (list: string) =>
  list
    .split("\n")
    .map((line) => `\\resumeItem{${escLatex(line.split("- ").pop() ?? "")}}`)
    .join("\n");

const formatPersonalInfo = (e: PersonalInfo) => {
  let text = `\\begin{center}
\\textbf{\\Huge ${escLatex(e.firstName)} ${escLatex(e.lastName)}} \\\\ \\vspace{6pt}
\\small{
`;

  const infoItems = [];
  if (e.location) infoItems.push(escLatex(e.location));
  if (e.phone) infoItems.push(`\\href{tel:${escLatex(e.phone)}}{${escLatex(formatPhoneNumber(e.phone))}}`);
  if (e.email) infoItems.push(`\\href{mailto:${escLatex(e.email)}}{${escLatex(e.email)}}`);
  if (e.linkedin) infoItems.push(`\\href{https://${escLatex(e.linkedin)}}{\\uline{${escLatex(e.linkedinTitle)}}}`);
  if (e.github) infoItems.push(`\\href{https://${escLatex(e.github)}}{\\uline{${escLatex(e.githubTitle)}}}`);
  if (e.website) infoItems.push(`\\href{https://${escLatex(e.website)}}{\\uline{${escLatex(e.websiteTitle)}}}`);
  if (e.otherLink) infoItems.push(`\\href{https://${escLatex(e.otherLink)}}{\\uline{${escLatex(e.otherLinkTitle)}}}`);
  text += infoItems.join("\n\\kern 4pt $|$\\kern 4pt\n");

  text += `\n}\n\\end{center}`;
  return text;
};

const formatExperience = (e: Experience[]) => {
  let text = `\\section{experience}
\\resumeSubHeadingListStart\n\n`;

  text += e
    .map(
      (exp) => `\\resumeSubHeading
{${escLatex(exp.jobTitle)}}{${formatTimeRange(exp.startDate, exp.endDate, exp.currentlyWorking)}}
{${escLatex(exp.company)}}{${escLatex(exp.location)}}
\\resumeItemListStart
${formatBulletList(exp.description)}
\\resumeItemListEnd`,
    )
    .join("\n\n");

  text += `\n\n\\resumeSubHeadingListEnd`;
  return text;
};

const formatEducation = (e: Education[]) => {
  let text = `\\section{education}
\\resumeSubHeadingListStart\n\n`;

  text += e
    .map(
      (exp) => `\\resumeSubHeading
{${escLatex(exp.institution)}}{${formatTimeRange(exp.startDate, exp.endDate, exp.currentlyStudying)}}
{${escLatex(exp.degree)}}{${escLatex(exp.location)}}
\\resumeItemListStart
${formatBulletList(exp.additionalInfo)}
\\resumeItemListEnd`,
    )
    .join("\n\n");

  text += `\n\n\\resumeSubHeadingListEnd`;
  return text;
};

const formatSkill = (e: Skill[]) => `\\section{skills}
\\resumeSubHeadingListStart
\\item{
${e.map((s) => escLatex(s.skills)).join(" \\\\\n")}
}
\\resumeSubHeadingListEnd`;

const formatProject = (e: Project[]) => {
  let text = `\\section{projects}
\\resumeSubHeadingListStart\n\n`;

  text += e
    .map(
      (exp) => `\\resumeSubHeading
{${escLatex(exp.projectLink) ? `\\href{https://${escLatex(exp.projectLink)}}{${escLatex(exp.title)}}` : escLatex(exp.title)}}{${formatTimeRange(exp.startDate, exp.endDate, exp.ongoing)}}
{${escLatex(exp.organization)}}{}
\\resumeItemListStart
${formatBulletList(exp.description)}
\\resumeItemListEnd`,
    )
    .join("\n\n");

  text += `\n\n\\resumeSubHeadingListEnd`;
  return text;
};

const formatCertification = (e: Certification[]) => {
  let text = `\\section{certifications}
\\resumeSubHeadingListStart\n\n`;

  text += e
    .map(
      (exp) => `\\resumeSubHeading
{${escLatex(exp.name)}}{${formatTimeRange(exp.date, exp.date, false)}}
{}{${escLatex(exp.location)}}
\\resumeItemListStart
${formatBulletList(exp.additionalInfo)}
\\resumeItemListEnd`,
    )
    .join("\n\n");

  text += `\n\n\\resumeSubHeadingListEnd`;
  return text;
};

const formatInvolvement = (e: Involvement[]) => {
  let text = `\\section{involvement}
\\resumeSubHeadingListStart\n\n`;

  text += e
    .map(
      (exp) => `\\resumeSubHeading
{${escLatex(exp.role)}}{${formatTimeRange(exp.startDate, exp.endDate, exp.currentlyActive)}}
{${escLatex(exp.organization)}}{${escLatex(exp.location)}}
\\resumeItemListStart
${formatBulletList(exp.additionalInfo)}
\\resumeItemListEnd`,
    )
    .join("\n\n");

  text += `\n\n\\resumeSubHeadingListEnd`;
  return text;
};

const formatAward = (e: Award[]) => {
  let text = `\\section{awards}
\\resumeSubHeadingListStart\n\n`;

  text += e
    .map(
      (exp) => `\\resumeSubHeading
{${escLatex(exp.name)}}{${formatTimeRange(exp.date, exp.date, false)}}
{${escLatex(exp.issuer)}}{}
\\resumeItemListStart
${formatBulletList(exp.additionalInfo)}
\\resumeItemListEnd`,
    )
    .join("\n\n");

  text += `\n\n\\resumeSubHeadingListEnd`;
  return text;
};

const formatters = {
  personalInfo: formatPersonalInfo,
  experience: formatExperience,
  education: formatEducation,
  skills: formatSkill,
  projects: formatProject,
  certifications: formatCertification,
  involvement: formatInvolvement,
  awards: formatAward,
};

function formatSection<K extends keyof ResumeDataFields>(key: K, data: ResumeDataFields[K]): string {
  const formatter = formatters[key] as (d: typeof data) => string;
  return formatter(data);
}

export const exportResume = () => {
  const docRoot = document.querySelector(".scaled-content-for-print") as Record<string, unknown> | null;
  if (!docRoot) throw new Error("Resume document not found");

  const fiberKey = Object.keys(docRoot).find((key) => key.startsWith("__reactFiber"));
  if (!fiberKey) throw new Error("React fiber not found");
  const fiber = docRoot[fiberKey] as ReactFiberNode;

  const resumeData = fiber.child?.memoizedProps.resumeData as ResumeData | undefined;
  if (!resumeData) throw new Error("Resume data not found");

  const sections = (["personalInfo", ...resumeData.sectionOrder] as (keyof ResumeDataFields)[])
    .filter((section) =>
      resumeData[section] instanceof Array ? resumeData[section].length > 0 : !!resumeData[section],
    )
    .map((section) => formatSection(section, resumeData[section]));

  return `${TEX_PREAMBLE}${TEX_SEPARATOR}${TEX_RESUME_CMDS}${TEX_SEPARATOR}\\begin{document}\n\n${sections.join(TEX_SEPARATOR)}\n\n\\end{document}`;
};

export const exportCoverLetter = () => {
  const docRoot = document.querySelector(".cl-scaled-content") as Record<string, unknown> | null;
  if (!docRoot) throw new Error("Cover letter document not found");

  const fiberKey = Object.keys(docRoot).find((key) => key.startsWith("__reactFiber"));
  if (!fiberKey) throw new Error("React fiber not found");
  const fiber = docRoot[fiberKey] as ReactFiberNode;

  const clData = fiber.child?.memoizedProps.data as CoverLetterData | undefined;
  if (!clData) throw new Error("Cover letter data not found");

  const personalInfo = fiber.child?.memoizedProps.personalInfo as PersonalInfo | undefined;
  if (!personalInfo) throw new Error("Personal info not found");

  const TEX_LINE_SEPARATOR = " \\\\\n";
  const TEX_PARAGRAPH_SEPARATOR = `\n\n\\vspace{1.4em}\n\n`;
  const TEX_SECTION_SEPARATOR = `\n\n\\vspace{2.1em}\n\n`;

  let content = formatPersonalInfo(personalInfo);

  content += `${TEX_SEPARATOR}${TEX_PARAGRAPH_SEPARATOR}${clData.date}${TEX_SECTION_SEPARATOR}`;
  content += [
    clData.recipientName,
    clData.recipientTitle,
    clData.companyName,
    clData.recipientAddressLine1,
    clData.recipientAddressLine2,
  ]
    .filter(Boolean)
    .map(escLatex)
    .join(TEX_LINE_SEPARATOR);

  content += `${TEX_SECTION_SEPARATOR}${escLatex(clData.greeting)}${TEX_SECTION_SEPARATOR}`;
  content += "\n\\justifying\n";
  content += clData.paragraphs.map((p) => `\\qquad ${escLatex(p.content)}`).join(TEX_PARAGRAPH_SEPARATOR);
  content += "\n\\raggedright\n";

  content += `${TEX_SECTION_SEPARATOR}${escLatex(clData.closing)}${TEX_PARAGRAPH_SEPARATOR}${escLatex(clData.senderName)}`;

  return `${TEX_PREAMBLE}${TEX_SEPARATOR}${TEX_RESUME_CMDS}${TEX_SEPARATOR}\\begin{document}\n\n${content}\n\n\\end{document}`;
};
