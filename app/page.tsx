"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QuestionsStore } from "./feature/store";

type FormData = {
  name: string;
  skills: Array<string>;
  experience: number;
};

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    skills: [],
    experience: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const store = QuestionsStore();

  const handleOnChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    console.log("Calling api");
    fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 200) {
          store.fill(data.response);
          router.push("/pages/test");
        }
      })
      .catch((data) => console.log(data))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <div className="flex justify-center items-center flex-col w-screen h-screen gap-4">
        <div className="w-xl">
          {/* Title */}
          <div className="flex justify-center mb-5">
            <h1 className="text-xl">AI Enable Mock Test</h1>
          </div>
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                className="border-1 rounded-full px-3 py-2 w-full hover:border-blue-300"
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleOnChange}
                required
              />
              <input
                className="border-1 rounded-full px-3 py-2 w-full hover:border-blue-300"
                id="skills"
                name="skills"
                type="text"
                placeholder="Enter Skills"
                value={formData.skills}
                onChange={handleOnChange}
                required
              />
              <input
                className="border-1 rounded-full px-3 py-2 w-full hover:border-blue-300"
                id="experience"
                name="experience"
                type="number"
                placeholder="Enter Experience in year"
                value={formData.experience}
                onChange={handleOnChange}
                required
              />

              <input
                className="rounded-full px-3 py-2 w-full bg-orange-500 hover:bg-orange-300"
                type="submit"
                value={loading ? "Generating..." : "Generate Test"}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
