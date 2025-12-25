'use client';

import { useTranslations } from 'next-intl';
import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ProblemSolution() {
  const t = useTranslations('bmasia.problemSolution');

  const problems = [
    {
      key: 'problem1',
      icon: '🎵'
    },
    {
      key: 'problem2',
      icon: '🔄'
    },
    {
      key: 'problem3',
      icon: '⏰'
    },
    {
      key: 'problem4',
      icon: '🎯'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-dark-gray mb-6">
            {t('title')}
          </h2>
          <p className="text-xl font-inter text-dark-gray/70 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Problems Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <XCircleIcon className="w-8 h-8 text-red-500" />
              <h3 className="text-2xl font-playfair font-bold text-dark-gray">
                {t('problemsTitle')}
              </h3>
            </div>
            {problems.map((problem, index) => (
              <div
                key={problem.key}
                className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl flex-shrink-0">{problem.icon}</span>
                  <div>
                    <h4 className="font-inter font-semibold text-dark-gray mb-2">
                      {t(`${problem.key}.title`)}
                    </h4>
                    <p className="text-dark-gray/70">
                      {t(`${problem.key}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Solutions Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
              <h3 className="text-2xl font-playfair font-bold text-dark-gray">
                {t('solutionsTitle')}
              </h3>
            </div>
            {problems.map((problem, index) => (
              <div
                key={`solution-${problem.key}`}
                className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-inter font-semibold text-dark-gray mb-2">
                      {t(`solution${index + 1}.title`)}
                    </h4>
                    <p className="text-dark-gray/70">
                      {t(`solution${index + 1}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
