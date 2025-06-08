//app\(pages)\course\[unique_url]\assignment\page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Button from "@/app/_ui/Button";
import { toast } from "react-toastify";
import CustomLink from "@/app/_components/CustomLink";

const COLORS = ["#28a745", "#dc3545"];

export default function AssignmentPage() {
  const { unique_url } = useParams();
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const currentQ = questions?.[current];
  
  const router = useRouter()
  // 1. Fetch assignment questions
  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await fetch(`/api/course/${unique_url}/assignment`);
        const data = await res.json();
        if (data.success) {
          setQuestions(data.data);
          setAnswers(new Array(data.data.length).fill(null));
        }
        else{
          toast.error(data.message);
          router.push("/")
        }
      } catch (err) {
        console.error("Assignment fetch failed", err);
      }
    };
    fetchAssignment();
  }, [unique_url]);

  // 2. Handle answer selection
  const handleSelect = (key) => {
    setSelected(key);
    const ans = answers;
    ans[current] = key;
    setAnswers(ans);
  };

  // 3. Navigation
  const handleNext = () => {
    setCurrent((prev) => prev + 1);
    setSelected(answers[current + 1] || null);
  };

  const handlePrev = () => {
    setCurrent((prev) => prev - 1);
    setSelected(answers[current - 1] || null);
  };

  // 4. Submit assignment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/course/${unique_url}/assignment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json();
    setResults(data.data);
  };

  if (!questions) {
    return <div className="text-center py-10 text-gray-600 min-h-screen">Loading assignment...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 my-16">
      {!results ? (
        <form onSubmit={handleSubmit}>

          <div className="card bg-white shadow-brand rounded-lg p-6">
            <div className="flex justify-end mb-4 gap-5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={current === 0}
                className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={current === questions.length - 1}
                className="bg-blue-500 text-white p-2 rounded-full disabled:opacity-50"
              >
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-xl font-semibold mb-4">
              Q{current + 1}: {currentQ.qs}
            </h2>
            <div className="space-y-3">
              {["a", "b", "c", "d"].map((key) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleSelect(key)}
                  className={`w-full text-left p-3 rounded-lg border-2 ${selected === key
                    ? "border-brand-primary bg-brand-secondary"
                    : "border-gray-300"
                    }`}
                >
                  <strong>{key.toUpperCase()}.</strong> {currentQ[key]}
                </button>
              ))}
            </div>


            <div className="flex justify-end mt-6">
              <Button
                className="py-2 px-6 max-w-40"
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
            </div>

          </div>
        </form>
      ) : (
        <div className="mt-10 space-y-6">
          <h3 className="text-2xl font-semibold text-center text-brand.dark">Your Result</h3>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <PieChart width={240} height={240}>
              <Pie
                data={[
                  { name: "Correct", value: results.correct },
                  { name: "Wrong", value: results.wrong },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {[results.correct, results.wrong].map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            <div className="text-lg">
              <p>✅ Correct: <strong>{results.correct}</strong></p>
              <p>❌ Wrong: <strong>{results.wrong}</strong></p>
              <p>🎯 Accuracy:{" "}
                <strong>
                  {(
                    (results.correct /
                      (results.correct + results.wrong || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </strong>
              </p>
              {results.cert_id && <CustomLink href={`/certificate/${results.cert_id}`} ><Button className={"py-2 px-3 mt-4"} variant="primary">Download Certificate</Button></CustomLink>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
