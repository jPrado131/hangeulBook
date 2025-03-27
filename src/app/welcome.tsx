interface WelcomeProps {
  onStarted: () => void;
}
export default function Welcome({ onStarted }: WelcomeProps) {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Hangeul Book</h1>
      <h2 className="text-2xl mb-6 text-center">Practice Hangeul Anytime, Anywhere!</h2>
      <p className="text-lg mb-6 text-center">
      Learn Hangeul easily with Hangeul Book. Whether you&apos;re at home, commuting, or taking a break, our app helps you practice and review your Korean language skills anytime, anywhere. Stay consistent and improve effortlessly with our simple and effective learning tools!
      </p>
      <button
        onClick={onStarted}
        className="bg-green-700 text-gray-200 px-6 py-3 rounded-md text-lg font-bold hover:bg-green-500 animate-pulse hover:animate-none"
      >
        Get Started 🚀
      </button>
    </div>
  );
}
