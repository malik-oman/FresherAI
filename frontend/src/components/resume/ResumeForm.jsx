import React from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

// ================================ INPUT COMPONENT =================
function Input({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-slate-800">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-300 hover:border-slate-300 shadow-sm"
      />
    </div>
  );
}

// ============================ TEXT AREA COMPONENT =================
function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-slate-800">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        rows={rows}
        className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-xl px-3.5 py-2.5 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-300 hover:border-slate-300 resize-none shadow-sm"
      />
    </div>
  );
}

// ============================ ENTRY CARD =================
function EntryCard({ children, onRemove }) {
  return (
    <div className="relative overflow-hidden bg-slate-50/80 border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
      >
        <FiTrash2 size={14} />
      </button>
      <div className="relative flex flex-col gap-3 pr-8">{children}</div>
    </div>
  );
}

// ============================ ADD BUTTON =================
function AddButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-xs font-medium text-slate-400 hover:border-slate-400 hover:text-slate-700 hover:bg-slate-50 active:scale-[0.99] transition-all duration-200"
    >
      <FiPlus size={14} /> {label}
    </button>
  );
}

// ============================ RESUME FORM COMPONENT =================
const ResumeForm = ({ step, data, setData }) => {
  // ================================= STEP 1 ================================
  if (step === 1) {
    return (
      <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
        <Input
          label="Full Name"
          placeholder="Malik Oman"
          onChange={(v) => setData({ ...data, name: v })}
          value={data.name}
        />
        <Input
          label="Email"
          placeholder="oman@gmail.com"
          onChange={(v) => setData({ ...data, email: v })}
          value={data.email}
        />
        <Input
          label="Phone"
          placeholder="+92 300 0000000"
          onChange={(v) => setData({ ...data, phone: v })}
          value={data.phone}
        />
        <Input
          label="Location"
          placeholder="TPS Colony M.Garh"
          onChange={(v) => setData({ ...data, location: v })}
          value={data.location}
        />
        <Input
          label="LinkedIn URL"
          placeholder="linkedin.com/malikoman"
          onChange={(v) => setData({ ...data, linkedin: v })}
          value={data.linkedin}
        />
        <Input
          label="GitHub URL"
          placeholder="github.com/malikoman"
          onChange={(v) => setData({ ...data, github: v })}
          value={data.github}
        />
      </div>
    );
  }

  // ================================= STEP 2 ================================
  if (step === 2) {
    return (
      <div className="flex flex-col gap-4">
        <TextArea
          label="Professional Summary"
          placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
          rows={6}
          onChange={(v) => setData({ ...data, summary: v })}
          value={data.summary}
        />
        <p className="text-[11px] text-slate-400">
          Leave empty to skip this section.
        </p>
      </div>
    );
  }

  // ================================= STEP 3 ================================
  if (step === 3) {
    return (
      <div className="flex flex-col gap-4">
        <TextArea
          label="Skills (comma separated)"
          placeholder="JavaScript, TypeScript, ReactJs, NodeJs, Express, MongoDB, Redis, Docker, AWS, Git..."
          rows={5}
          onChange={(v) => setData({ ...data, skills: v })}
          value={data.skills}
        />
        <p className="text-[11px] text-slate-400">
          Separate each skill with a comma.
        </p>
      </div>
    );
  }

  // ================================= STEP 4 ================================
  if (step === 4) {
    const addExp = () => {
      setData({
        ...data,
        experience: [
          ...data.experience,
          { company: "", role: "", duration: "", description: "" },
        ],
      });
    };
    const removeExp = (index) => {
      setData({
        ...data,
        experience: data.experience.filter((_, i) => i !== index),
      });
    };
    const updateExp = (index, field, value) => {
      const updated = data.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp,
      );
      setData({ ...data, experience: updated });
    };

    return (
      <div className="flex flex-col gap-4">
        {data.experience.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">
            No experience yet. Click below to add.
          </p>
        )}

        {data.experience.map((exp, index) => (
          <EntryCard key={index} onRemove={() => removeExp(index)}>
            <Input
              label="Company"
              placeholder="ABC Technologies"
              onChange={(v) => updateExp(index, "company", v)}
              value={exp.company}
            />
            <Input
              label="Role"
              placeholder="Backend Developer"
              onChange={(v) => updateExp(index, "role", v)}
              value={exp.role}
            />
            <Input
              label="Duration"
              placeholder="Jan 2023 - Dec 2026"
              onChange={(v) => updateExp(index, "duration", v)}
              value={exp.duration}
            />
            <TextArea
              label="Description"
              placeholder={"Built REST APIs\nImproved performance by 40%"}
              onChange={(v) => updateExp(index, "description", v)}
              value={exp.description}
            />
          </EntryCard>
        ))}

        <AddButton onClick={addExp} label="Add Experience" />
      </div>
    );
  }

  // ================================= STEP 5 ================================
  if (step === 5) {
    const addPro = () => {
      setData({
        ...data,
        projects: [
          ...data.projects,
          { name: "", techStack: "", github: "", description: "" },
        ],
      });
    };
    const removePro = (index) => {
      setData({
        ...data,
        projects: data.projects.filter((_, i) => i !== index),
      });
    };
    const updatePro = (index, field, value) => {
      const updated = data.projects.map((pro, i) =>
        i === index ? { ...pro, [field]: value } : pro,
      );
      setData({ ...data, projects: updated });
    };

    return (
      <div className="flex flex-col gap-4">
        {data.projects.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">
            No projects yet. Click below to add.
          </p>
        )}

        {data.projects.map((pro, index) => (
          <EntryCard key={index} onRemove={() => removePro(index)}>
            <Input
              label="Project Name"
              placeholder="InterviewIQ"
              onChange={(v) => updatePro(index, "name", v)}
              value={pro.name}
            />
            <Input
              label="Tech Stack"
              placeholder="NextJs, ReactJs, NodeJs, MERN Stack"
              onChange={(v) => updatePro(index, "techStack", v)}
              value={pro.techStack}
            />
            <Input
              label="GitHub Link"
              placeholder="github.com/malikoman"
              onChange={(v) => updatePro(index, "github", v)}
              value={pro.github}
            />
            <TextArea
              label="Description"
              placeholder="AI-powered preparation platform with mock interviews and resume builder."
              onChange={(v) => updatePro(index, "description", v)}
              value={pro.description}
            />
          </EntryCard>
        ))}

        <AddButton onClick={addPro} label="Add Project" />
      </div>
    );
  }

  // ================================= STEP 6 ================================
  if (step === 6) {
    const addEdu = () => {
      setData({
        ...data,
        education: [
          ...data.education,
          { college: "", degree: "", branch: "", cgpa: "", year: "" },
        ],
      });
    };
    const removeEdu = (index) => {
      setData({
        ...data,
        education: data.education.filter((_, i) => i !== index),
      });
    };
    const updateEdu = (index, field, value) => {
      const updated = data.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu,
      );
      setData({ ...data, education: updated });
    };

    return (
      <div className="flex flex-col gap-4">
        {data.education.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-4">
            No education yet. Click below to add.
          </p>
        )}

        {data.education.map((edu, index) => (
          <EntryCard key={index} onRemove={() => removeEdu(index)}>
            <Input
              label="College/University"
              placeholder="COMSATS University Islamabad"
              onChange={(v) => updateEdu(index, "college", v)}
              value={edu.college}
            />
            <Input
              label="Degree"
              placeholder="BS Computer Science"
              onChange={(v) => updateEdu(index, "degree", v)}
              value={edu.degree}
            />
            <Input
              label="Branch/Specialization"
              placeholder="Software Engineering"
              onChange={(v) => updateEdu(index, "branch", v)}
              value={edu.branch}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="CGPA"
                placeholder="3.75"
                onChange={(v) => updateEdu(index, "cgpa", v)}
                value={edu.cgpa}
              />
              <Input
                label="Graduation Year"
                placeholder="2026"
                onChange={(v) => updateEdu(index, "year", v)}
                value={edu.year}
              />
            </div>
          </EntryCard>
        ))}

        <AddButton onClick={addEdu} label="Add Education" />
      </div>
    );
  }
};

export default ResumeForm;