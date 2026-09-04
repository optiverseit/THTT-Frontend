
interface WorkPermitFaqProps {
  question: string;
  answer?: string;
}

const WorkPermitFaq = () => {
  const allfaqs: WorkPermitFaqProps[] = [
    {
      question: "What do I need to book a flight ticket?",
      answer:
        "Share your full name (as per passport/ID), route,dates and preferred flight time. We'll send options with pricing and confirmation steps.   ",
    },
    {
      question: "Can I change or cancel my ticket?",
      answer: "",
    },
    {
      question: "Do you handle group bookings?",
      answer: "",
    },
    {
      question: "How fast will I receive the e-ticket?",
      answer: "",
    },
    {
      question: "Can you help with missed flights or rescheduling?",
      answer: "",
    },
  ];

  return (
    <div className="flex justify-center w-full">
      <section className="mt-8 w-full p-8 max-w-6xl ">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-purple-950 mb-8">
            Frequently Asked Questions (FAQs)
          </h2>

          <div className="space-y-4 w-full">
            {allfaqs?.map((item, index) => (
              <div
                key={index}
                className="w-full collapse collapse-arrow bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <input type="radio" name="package-faq-accordion" />
                <div className="collapse-title text-md font-bold text-purple-950 w-full">
                  {item.question}
                </div>
                <div className="collapse-content text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkPermitFaq;
