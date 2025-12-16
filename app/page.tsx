"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestionsStore } from "./feature/store";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState(0);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const store = QuestionsStore();

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim().toLowerCase())) {
        setSkills([...skills, skillInput.trim().toLowerCase()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || skills.length === 0 || experience <= 0) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, skills, experience }),
      });
      const data = await res.json();

      if (data.status === 200) {
        store.fill(data.response);
        router.push("/pages/test-details");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          AI-Enabled Mock Test
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Test your skills with AI-generated questions
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Skills Tagged Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (Press Enter to add)
            </label>
            <div className="border border-gray-300 rounded-lg p-2 min-h-[50px] flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-indigo-900 hover:text-indigo-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="flex-1 min-w-[120px] outline-none px-2 py-1"
                placeholder="e.g., react, next, javascript"
              />
            </div>
          </div>

          {/* Experience Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="number"
              value={experience || ""}
              onChange={(e) => setExperience(Number(e.target.value))}
              min="0"
              max="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter years"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Generating Test..." : "Start Test"}
          </button>
        </form>
      </div>
    </div>
  );
}
