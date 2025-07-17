import Link from "next/link";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-[calc(100vh-48px)] bg-gray-600">
      <h1 className="text-2xl text-white">Welcome to the home page</h1>
      <p className="text-white">
        Go to the{" "}
        <Link
          href="/dashboard"
          className="font-bold text-lg hover:!underline text-blue-800"
        >
          Dashboard &rarr;
        </Link>{" "}
        to get started.
      </p>
    </div>
  );
};

export default Home;
