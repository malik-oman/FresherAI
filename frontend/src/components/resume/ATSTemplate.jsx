import React from "react";

/* A4 = 210mm x 297mm. Keep this file print-safe: no shadows, no colors
   outside black/white, no icons — ATS parsers choke on all three. */

const SectionTitle = ({ children }) => (
  <h3 className="mt-0 mb-[9px] border-b-[1.5px] border-black pb-[3px] text-[10.5px] font-bold uppercase tracking-[0.14em] text-black">
    {children}
  </h3>
);

/* Plain function — NOT async. An async function returns a Promise and
   React silently renders nothing. This was why descriptions were blank. */
const renderDes = (text) => {
  if (!text) return null;

  const lines = String(text)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return null;

  return (
    <ul className="mt-1 ml-4 list-disc p-0">
      {lines.map((line, i) => (
        <li key={i} className="mb-[1px] text-[11px] leading-[1.6] text-black">
          {line.replace(/^[-•*.]\s*/, "")}
        </li>
      ))}
    </ul>
  );
};

const ATSTemplate = ({ data = {} }) => {
  const {
    name,
    email,
    phone,
    location,
    linkedin,
    github,
    summary,
    skills,
    experience,
    projects,
    education,
  } = data;

  /* Guard every array — a missing key used to crash the whole preview
     with "Cannot read properties of undefined (reading 'length')". */
  const experienceList = Array.isArray(experience) ? experience : [];
  const projectList = Array.isArray(projects) ? projects : [];
  const educationList = Array.isArray(education) ? education : [];

  /* skills can arrive as a comma string OR an array */
  const skillList = Array.isArray(skills)
    ? skills.map((s) => String(s).trim()).filter(Boolean)
    : typeof skills === "string"
    ? skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const halfList = Math.ceil(skillList.length / 2);
  const skillCol1 = skillList.slice(0, halfList);
  const skillCol2 = skillList.slice(halfList);

  const contacts = [
    email,
    phone,
    location,
    linkedin ? `linkedin.com/in/${String(linkedin).replace(/^.*\/in\//, "")}` : null,
    github ? `github.com/${String(github).replace(/^.*github\.com\//, "")}` : null,
  ].filter(Boolean);

  return (
    <div
      className="box-border w-[210mm] min-h-[297mm] bg-white px-[18mm] py-[15mm] text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* ===================== HEADER ===================== */}
      <header className="mb-[13px] border-b-2 border-black pb-[10px] text-center">
        <h1 className="m-0 mb-[7px] text-[28px] font-bold uppercase tracking-[0.08em] leading-tight">
          {name || "YOUR NAME"}
        </h1>

        {contacts.length > 0 && (
          <div className="flex flex-wrap justify-center text-[10.5px] text-black">
            {contacts.map((v, i, arr) => (
              <span key={i} className="whitespace-nowrap">
                {v}
                {i < arr.length - 1 && <span className="mx-[7px]">|</span>}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ===================== SUMMARY ===================== */}
      {summary && (
        <section className="mb-[13px]">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="m-0 text-[11px] leading-[1.65] text-black text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* ===================== SKILLS ===================== */}
      {skillList.length > 0 && (
        <section className="mb-[13px]">
          <SectionTitle>Technical Skills</SectionTitle>

          <div className="grid grid-cols-2 gap-x-[20px]">
            <ul className="m-0 list-disc pl-4">
              {skillCol1.map((skill, i) => (
                <li key={i} className="text-[11px] leading-[1.7] capitalize text-black">
                  {skill}
                </li>
              ))}
            </ul>
            <ul className="m-0 list-disc pl-4">
              {skillCol2.map((skill, i) => (
                <li key={i} className="text-[11px] leading-[1.7] capitalize text-black">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ===================== EXPERIENCE ===================== */}
      {experienceList.length > 0 && (
        <section className="mb-[13px]">
          <SectionTitle>Work Experience</SectionTitle>

          {experienceList.map((exp, i) => (
            <div key={i} className="mb-[11px] break-inside-avoid last:mb-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-bold text-black">{exp.role}</span>
                <span className="whitespace-nowrap text-[10.5px] text-black">
                  {exp.duration}
                </span>
              </div>

              {(exp.company || exp.location) && (
                <div className="mb-[2px] flex items-baseline justify-between gap-2 text-[11px] italic text-black">
                  <span>{exp.company}</span>
                  {exp.location && (
                    <span className="not-italic whitespace-nowrap text-[10.5px]">
                      {exp.location}
                    </span>
                  )}
                </div>
              )}

              {renderDes(exp.description)}
            </div>
          ))}
        </section>
      )}

      {/* ===================== PROJECTS ===================== */}
      {projectList.length > 0 && (
        <section className="mb-[13px]">
          <SectionTitle>Projects</SectionTitle>

          {projectList.map((proj, i) => (
            <div key={i} className="mb-[11px] break-inside-avoid last:mb-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-bold text-black">
                  {proj.title || proj.name}
                  {proj.tech && (
                    <span className="text-[10.5px] font-normal italic">
                      {" — "}
                      {proj.tech}
                    </span>
                  )}
                </span>

                {(proj.link || proj.duration) && (
                  <span className="whitespace-nowrap text-[10.5px] text-black">
                    {proj.link
                      ? String(proj.link).replace(/^https?:\/\/(www\.)?/, "")
                      : proj.duration}
                  </span>
                )}
              </div>

              {renderDes(proj.description)}
            </div>
          ))}
        </section>
      )}

      {/* ===================== EDUCATION ===================== */}
      {educationList.length > 0 && (
        <section className="mb-0">
          <SectionTitle>Education</SectionTitle>

          {educationList.map((edu, i) => (
            <div key={i} className="mb-[9px] break-inside-avoid last:mb-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[12px] font-bold text-black">
                  {edu.degree || edu.qualification}
                </span>
                <span className="whitespace-nowrap text-[10.5px] text-black">
                  {edu.duration || edu.year}
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-2 text-[11px] italic text-black">
                <span>{edu.institution || edu.school}</span>
                {(edu.grade || edu.cgpa) && (
                  <span className="not-italic whitespace-nowrap text-[10.5px]">
                    {edu.grade ? `Grade: ${edu.grade}` : `CGPA: ${edu.cgpa}`}
                  </span>
                )}
              </div>

              {renderDes(edu.description)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ATSTemplate;