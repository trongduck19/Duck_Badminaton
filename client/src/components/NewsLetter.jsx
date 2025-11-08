const NewsLetter = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-24 pb-16 px-4">
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-semibold text-gray-800">Never Miss a Deal!</h1>

      {/* Subtitle */}
      <p className="text-gray-500/80 md:text-lg mt-2 mb-8 max-w-xl">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts.
      </p>

      {/* Form */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex w-full max-w-xl border border-gray-300 rounded-lg overflow-hidden bg-white"
      >
        <input
          type="email"
          placeholder="Enter your email address"
          required
          className="flex-1 px-4 py-3 outline-none text-gray-600 placeholder-gray-400 text-sm md:text-base"
        />
        <button
          type="submit"
          className="px-8 md:px-12 bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
