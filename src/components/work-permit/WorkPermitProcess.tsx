import React from "react";

const steps = [
  {
    number: 1,
    title: "CHOOSE COUNTRY & PERMIT TYPE",
    description:
      "Select your destination and permit type from our global network.",
  },
  {
    number: 2,
    title: "SUBMIT REQUIRED DOCUMENTS",
    description:
      "Provide necessary identity and work papers through our secure portal.",
  },
  {
    number: 3,
    title: "PROCESSING & FOLLOW-UP",
    description:
      "Our experienced team coordinates directly with government bodies.",
  },
  {
    number: 4,
    title: "PERMIT APPROVAL",
    description:
      "Collect your verified and authenticated work permit successfully.",
  },
];

const WorkPermitProcess = () => {
  return (
    <div className="flex justify-center w-full bg-white py-8 px-6">
      <div className="max-w-7xl w-full">
        {/* Header */}
        <header className="flex flex-col items-center mb-14">
          <p className="text-pink-500 tracking-widest text-xs font-semibold uppercase text-center mb-2">
            OUR WORKFLOW
          </p>
          <h1 className="text-4xl font-extrabold text-purple-950 text-center">
            How the Process Works
          </h1>
          <div className="rounded-full h-1 w-16 bg-pink-600 mt-3"></div>
        </header>

        {/* Steps */}
        <div className="flex items-start justify-between relative">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step */}
              <div className="flex flex-col items-center text-center w-50">
                {/* Circle */}
                <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg shadow-pink-300 bg-pink-600 flex items-center justify-center text-white text-xl font-bold mb-5 z-10 relative">
                  {step.number}
                </div>
                {/* Title */}
                <p className="text-sm font-extrabold text-purple-950 uppercase leading-tight mb-2">
                  {step.title}
                </p>
                {/* Description */}
                <p className="text-[10px] text-purple-900 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-center mt-6 flex-1 mx-2">
                  <div className="flex-1 h-0.5 w-30 bg-pink-500"></div>
                  <svg
                    className="text-pink-500 w-4 h-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 4.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkPermitProcess;
