import React from 'react';
import { Flame, Plus, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRandomQuote } from '../utils/motivationalQuotes';

const Landing = () => {
  const navigate = useNavigate();
  const quote = getRandomQuote();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 sticky top-0 z-40 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-secondary font-display">
                  Zen Habits
                </h1>
                <p className="text-xs sm:text-sm text-muted hidden sm:block">
                  Track your daily progress
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/signin')}
                className="px-5 py-2.5 text-secondary font-semibold hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl sm:text-6xl font-bold text-secondary font-display mb-6 leading-tight">
              Build Better Habits
            </h2>
            <p className="text-lg sm:text-xl text-muted mb-8 leading-relaxed">
              Track your daily progress with beautiful visualizations. Build streaks, stay motivated, and achieve your goals with Zen Habits.
            </p>

            {/* Quote */}
            <div className="mb-8 p-6 bg-accent/20 rounded-xl border-l-4 border-primary">
              <p className="text-secondary italic text-lg font-medium">
                "{quote.text}"
              </p>
              <p className="text-muted text-sm mt-3">— {quote.author}</p>
            </div>

            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-6 h-6" />
              Get Started Free
            </button>
          </div>

          {/* Right Features */}
          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    One-Tap Check-In
                  </h3>
                  <p className="text-muted">
                    Mark habits complete in seconds. No friction, just progress.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    Beautiful Analytics
                  </h3>
                  <p className="text-muted">
                    Visualize your progress with heatmaps and trend charts.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">
                    Build Streaks
                  </h3>
                  <p className="text-muted">
                    Track your longest streaks and stay motivated to keep going.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-accent/10 border-t border-gray-200 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-secondary font-display mb-4">
            Ready to start tracking?
          </h3>
          <p className="text-lg text-muted mb-8">
            Join thousands building better habits. It's free and takes less than a minute.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
