"use client";

import { sessionSteps } from "@/content/sessionSteps";

export default function SessionSteps() {
  return (
    <section className="px-4 py-12 bg-white text-gray-800">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">{sessionSteps.title}</h2>
        <p className="text-gray-600 mb-8">
          {sessionSteps.subtitle}
        </p>
      </div>

      <div className="space-y-8 max-w-2xl mx-auto">
        {sessionSteps.steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
              {index + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}