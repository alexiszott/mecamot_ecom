interface BreadcrumbProps {
  currentStep: number; // 1 = Cart, 2 = Shipping, 3 = Payment, 4 = Confirmation
}

const steps = ["Panier", "Livraison", "Paiement", "Confirmation"];

export default function CheckoutBreadcrumb({ currentStep }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Progression du paiement"
      className="mb-8 flex justify-center items-center mx-auto max-w-4xl p-4 bg-white shadow-md rounded-lg"
    >
      <ol className="flex space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <li key={step} className="flex items-center">
              <div
                className={`
                    flex items-center justify-center w-8 h-8 rounded-full
                    ${
                      isCompleted
                        ? "bg-green-600 text-white"
                        : isActive
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }
                  `}
              >
                {stepNumber}
              </div>
              <span
                className={`
                    ml-2 text-sm font-medium
                    ${isActive ? "text-blue-600" : "text-gray-600"}
                  `}
              >
                {step}
              </span>
              {index !== steps.length - 1 && (
                <svg
                  className="w-5 h-5 text-gray-400 mx-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
