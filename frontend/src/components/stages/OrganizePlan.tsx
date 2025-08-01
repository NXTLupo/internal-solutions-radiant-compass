import React, { useState } from 'react';
import { RadiantLogo } from '../RadiantLogo';

interface OrganizePlanProps {
  onBackToDashboard?: () => void;
}

interface JourneyMapStep {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  status: 'completed' | 'current' | 'upcoming';
  tasks: string[];
  resources: string[];
}

interface PeerStory {
  id: string;
  patientName: string;
  condition: string;
  storyTitle: string;
  excerpt: string;
  tags: string[];
  helpful: number;
  timeToRead: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'guide' | 'tool';
  description: string;
  source: string;
  rating: number;
  readTime: string;
  category: string;
}

const journeyMapSteps: JourneyMapStep[] = [
  {
    id: 'organize-info',
    title: 'Organize Information',
    description: 'Collect and organize all medical records, test results, and documentation',
    timeframe: 'Week 1-2',
    status: 'completed',
    tasks: [
      'Create digital folder for medical records',
      'Request copies of all test results',
      'Organize medications list',
      'Document symptom timeline'
    ],
    resources: ['Medical record templates', 'Medication tracking apps', 'Cloud storage setup']
  },
  {
    id: 'research-condition',
    title: 'Research Your Condition',
    description: 'Build comprehensive understanding through reliable medical sources',
    timeframe: 'Week 2-3',
    status: 'current',
    tasks: [
      'Review condition overview from medical sources',
      'Understand treatment options',
      'Learn about prognosis factors',
      'Identify key questions for doctors'
    ],
    resources: ['NIH patient resources', 'Medical journals', 'Condition-specific websites']
  },
  {
    id: 'build-network',
    title: 'Build Support Network',
    description: 'Connect with healthcare team, family, and peer communities',
    timeframe: 'Week 3-4',
    status: 'upcoming',
    tasks: [
      'Identify key family/friend supporters',
      'Join online patient communities',
      'Find local support groups',
      'Connect with patient advocates'
    ],
    resources: ['Support group directories', 'Online communities', 'Advocacy organizations']
  },
  {
    id: 'plan-logistics',
    title: 'Plan Care Logistics',
    description: 'Organize practical aspects of ongoing care and treatment',
    timeframe: 'Week 4+',
    status: 'upcoming',
    tasks: [
      'Set up appointment scheduling system',
      'Plan transportation for treatments',
      'Arrange work/life accommodations',
      'Prepare emergency care plan'
    ],
    resources: ['Transportation services', 'Workplace accommodation guides', 'Emergency planning templates']
  }
];

const peerStories: PeerStory[] = [
  {
    id: '1',
    patientName: 'Maria S.',
    condition: 'Rare Autoimmune Disorder',
    storyTitle: 'How I Built My Care Team',
    excerpt: 'Finding the right specialists seemed impossible at first, but I learned to be my own advocate. Here\'s how I assembled a team that really listens...',
    tags: ['Care Team', 'Advocacy', 'Specialists'],
    helpful: 23,
    timeToRead: '4 min read'
  },
  {
    id: '2',
    patientName: 'James K.',
    condition: 'Genetic Condition',
    storyTitle: 'Organizing My Medical Information',
    excerpt: 'After years of scattered records and missed information, I created a system that keeps everything organized and accessible...',
    tags: ['Organization', 'Medical Records', 'Systems'],
    helpful: 31,
    timeToRead: '3 min read'
  },
  {
    id: '3',
    patientName: 'Sarah L.',
    condition: 'Chronic Rare Disease',
    storyTitle: 'Finding My Support Community',
    excerpt: 'I felt so alone until I found others who understood my journey. These connections changed everything about how I approach my condition...',
    tags: ['Support Groups', 'Community', 'Mental Health'],
    helpful: 45,
    timeToRead: '5 min read'
  }
];

const diseaseLibraryResources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Rare Disease Genetics',
    type: 'guide',
    description: 'Comprehensive guide to genetic factors in rare diseases, inheritance patterns, and family planning considerations.',
    source: 'National Organization for Rare Disorders',
    rating: 4.8,
    readTime: '15 min',
    category: 'Genetics'
  },
  {
    id: '2',
    title: 'Navigating Insurance for Rare Diseases',
    type: 'article',
    description: 'Practical strategies for dealing with insurance coverage, appeals, and finding financial assistance programs.',
    source: 'Global Genes',
    rating: 4.6,
    readTime: '12 min',
    category: 'Insurance'
  },
  {
    id: '3',
    title: 'Treatment Options Overview',
    type: 'video',
    description: 'Expert physicians discuss current and emerging treatment approaches for various rare conditions.',
    source: 'Rare Disease Clinical Research Network',
    rating: 4.9,
    readTime: '25 min',
    category: 'Treatment'
  },
  {
    id: '4',
    title: 'Symptom Tracking Best Practices',
    type: 'tool',
    description: 'Interactive tool and templates for effective symptom monitoring and communication with healthcare providers.',
    source: 'Patient-Centered Outcomes Research Institute',
    rating: 4.7,
    readTime: '10 min',
    category: 'Self-Management'
  }
];

export const OrganizePlan: React.FC<OrganizePlanProps> = ({ onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'journey' | 'library' | 'stories'>('journey');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'current': return '🔄';
      default: return '⏳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 border-green-200';
      case 'current': return 'bg-amber-50 border-amber-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return '📄';
      case 'video': return '🎥';
      case 'guide': return '📚';
      case 'tool': return '🛠️';
      default: return '📄';
    }
  };

  const categories = ['all', ...Array.from(new Set(diseaseLibraryResources.map(r => r.category)))];
  const filteredResources = selectedCategory === 'all' 
    ? diseaseLibraryResources 
    : diseaseLibraryResources.filter(r => r.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200"
                >
                  <span>←</span>
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
              )}
              <RadiantLogo size="md" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border border-orange-300">
                <span className="text-sm font-medium text-orange-800">🗺️ Stage 2: Organize & Plan</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Organize & Plan Your Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Build a comprehensive understanding of your condition and create a personalized roadmap for your healthcare journey.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/60 backdrop-blur-sm rounded-lg p-1 border border-orange-200">
            {[
              { id: 'journey', label: 'My Journey Map', icon: '🗺️' },
              { id: 'library', label: 'Disease Library', icon: '📚' },
              { id: 'stories', label: 'Peer Stories', icon: '👥' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-orange-600 hover:bg-white/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Journey Map Tab */}
          {activeTab === 'journey' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Personal Journey Map</h2>
                  <p className="text-gray-600">
                    A step-by-step plan to organize your information, research your condition, and build your support network.
                  </p>
                </div>

                <div className="space-y-6">
                  {journeyMapSteps.map((step, index) => (
                    <div key={step.id} className="relative">
                      <div className={`rounded-xl border p-6 transition-all duration-200 ${getStatusColor(step.status)}`}>
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                              <span className="text-xl">{getStatusIcon(step.status)}</span>
                              <span className="text-sm text-gray-500">{step.timeframe}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{step.description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Key Tasks:</h4>
                                <ul className="space-y-1">
                                  {step.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                      <span className="text-orange-500 mt-1">•</span>
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Resources:</h4>
                                <ul className="space-y-1">
                                  {step.resources.map((resource, resourceIndex) => (
                                    <li key={resourceIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                      <span className="text-blue-500 mt-1">•</span>
                                      <span>{resource}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < journeyMapSteps.length - 1 && (
                        <div className="absolute left-6 top-24 w-0.5 h-8 bg-gray-300"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Journey Progress</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: '37.5%' }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    1 of 4 steps completed
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  You're making great progress! Focus on completing your current step before moving to the next.
                </p>
              </div>
            </div>
          )}

          {/* Disease Library Tab */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Disease Library & Resources</h2>
                  <p className="text-gray-600">
                    Curated, reliable information about rare diseases, treatments, and management strategies.
                  </p>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResources.map((resource) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start space-x-3 mb-4">
                        <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                            <span>{resource.source}</span>
                            <span>•</span>
                            <span>{resource.readTime}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <span>⭐</span>
                              <span>{resource.rating}</span>
                            </div>
                          </div>
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {resource.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                      <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200">
                        {resource.type === 'video' ? 'Watch' : resource.type === 'tool' ? 'Use Tool' : 'Read'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Peer Stories Tab */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Peer Stories & Experiences</h2>
                  <p className="text-gray-600">
                    Learn from others who have walked similar paths. Real stories from patients navigating rare disease journeys.
                  </p>
                </div>

                <div className="space-y-6">
                  {peerStories.map((story) => (
                    <div key={story.id} className="border border-gray-200 rounded-lg p-6 hover:border-orange-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{story.storyTitle}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>By {story.patientName}</span>
                            <span>•</span>
                            <span>{story.condition}</span>
                            <span>•</span>
                            <span>{story.timeToRead}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <span>👍</span>
                          <span>{story.helpful}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{story.excerpt}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {story.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200">
                          Read Story
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Community Call-to-Action */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Share Your Story</h3>
                  <p className="text-gray-600 mb-4">
                    Your experience could help others on their journey. Share your insights, challenges, and victories with the community.
                  </p>
                  <button className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-2 px-6 rounded-md text-sm font-medium hover:from-blue-500 hover:to-indigo-600 transition-all duration-200">
                    Share My Story
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl border border-orange-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for the Next Stage?</h3>
              <p className="text-gray-600 text-sm">
                Once you've organized your information and built your knowledge base, 
                you can move on to Stage 3: Explore & Decide.
              </p>
            </div>
            <button className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-500 hover:to-red-600 transition-all duration-200 shadow-md hover:shadow-lg">
              Continue to Stage 3 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizePlan;