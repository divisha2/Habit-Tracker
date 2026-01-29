import React from 'react';
import { Check, Flame, TrendingUp, Calendar, Target, BarChart3 } from 'lucide-react';

const FeatureShowcase = () => {
  return (
    <div className="glass-card rounded-3xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-zen-800 mb-4 flex items-center gap-2">
        <span className="text-xl">✨</span>
        Zen Habit Tracker Features
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* One-Tap Check-in */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-green-800">One-Tap Check-in</div>
            <div className="text-sm text-green-600">Instant habit completion with optimistic UI</div>
          </div>
        </div>

        {/* Streak Tracking */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Flame className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-orange-800">Streak Engine</div>
            <div className="text-sm text-orange-600">Advanced streak calculation & flame icons</div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-blue-800">Radial Progress</div>
            <div className="text-sm text-blue-600">Beautiful animated progress rings</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-purple-800">GitHub Heatmap</div>
            <div className="text-sm text-purple-600">6-month activity visualization</div>
          </div>
        </div>

        {/* Trend Charts */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-indigo-800">Trend Analysis</div>
            <div className="text-sm text-indigo-600">30-day completion trends with Recharts</div>
          </div>
        </div>

        {/* Analytics */}
        <div className="flex items-start gap-3 p-3 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-medium text-pink-800">Advanced Analytics</div>
            <div className="text-sm text-pink-600">Pie charts, bar charts & detailed stats</div>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gradient-to-r from-zen-100 to-zen-200 rounded-xl">
        <div className="text-sm text-zen-700 text-center">
          <span className="font-medium">🧘‍♂️ Zen Design:</span> Glassmorphism cards, soft colors, smooth animations, and lots of whitespace for a calm experience
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;