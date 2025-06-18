import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">Mecamot E-commerce</h1>
        <p className="text-xl text-gray-600">
          Plateforme e-commerce pour pièces automobiles
        </p>

        <div className="space-y-4">
          <Link
            href="/test"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tester l'API
          </Link>
        </div>
      </div>
    </main>
  );
}
