import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems.js";
import Navbar from "../components/Navbar.jsx";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription.jsx";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston.js";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(
    PROBLEMS[currentProblemId].starterCode.javascript,
  );
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  useEffect(() => {
    //use effect will run whenever id or language changes and a corresponding problem for that id exists
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      //setter function will run for this corresponding id
      //and will fetch the corresponding problem and starter code language for this id
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  //below are the functionality required

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) =>
    navigate(`/problems/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ","),
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };
  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActualOutput = normalizeOutput(actualOutput);
    const normalizedExpectedOutput = normalizeOutput(expectedOutput);
    return normalizedActualOutput === normalizedExpectedOutput;
  };

  const handleRunCode = async () => {
    console.log("1️⃣ Run button clicked");

    setIsRunning(true);
    setOutput(null);

    try {
      console.log("2️⃣ Calling executeCode");

      const result = await executeCode(selectedLanguage, code);

      console.log("3️⃣ Execution result:", result);

      setOutput(result);

      if (result.success) {
        console.log("4️⃣ Execution successful");

        const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
        const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

        console.log("5️⃣ Tests passed:", testsPassed);

        if (testsPassed) {
          toast.success("All test cases passed! Great Job! 😁");
          triggerConfetti();
        } else {
          toast.error("Test failed ❌");
        }
      }
    } catch (err) {
      console.error("❌ Execution error:", err);
    }

    setIsRunning(false);
  };
  // const handleRunCode = async () => {
  //     setIsRunning(true);
  //     setOutput(null);

  //     const result = await executeCode(selectedLanguage, code);
  //     setOutput(result);
  //     setIsRunning(false);

  //     // check if code executed successfully and matches expected output

  //     if (result.success) {
  //     const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
  //     const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

  //     if (testsPassed) {
  //         triggerConfetti();
  //         toast.success("All tests passed! Great job!");
  //     } else {
  //         toast.error("Tests failed. Check your output!");
  //     }
  //     } else {
  //     toast.error("Code execution failed!");
  //     }
  // };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* we will use resizable pannel to create 3 panels namely problem description and
            on right side we will have code editor and a console on bottom */}
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            {/* left panel-problem description */}
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />
          {/* right panel-code editor and output panel or console */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />
              {/* output panel */}
              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemDetailPage;
