"use client";

import React from 'react';
import { Layout, PageHeader } from '../layout';
import Button from '../ui/Button';
import { PlayIcon, UserGroupIcon, MusicalNoteIcon } from '@heroicons/react/24/solid';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section with PageHeader */}
      <PageHeader
        title="Discover Music Like Never Before"
        subtitle="Connect with artists, explore new sounds, and experience music in a whole new way with Bright Ears."
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="primary" 
            size="lg" 
            leftIcon={<PlayIcon className="w-5 h-5" />}
          >
            Start Listening
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            leftIcon={<UserGroupIcon className="w-5 h-5" />}
          >
            Join Community
          </Button>
        </div>
      </PageHeader>

      {/* Main Content */}
      <div className="relative">
        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-gray mb-6">
                <span className="gradient-text">Why Choose Bright Ears?</span>
              </h2>
              <p className="font-inter text-lg text-dark-gray/80 max-w-2xl mx-auto">
                Experience music discovery with cutting-edge features designed for the modern music lover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="card-modern p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-cyan to-deep-teal rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MusicalNoteIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
                  Smart Discovery
                </h3>
                <p className="font-inter text-dark-gray/70 leading-relaxed">
                  Our AI-powered recommendation engine learns your taste and suggests music you'll love.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="card-modern p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-earthy-brown to-soft-lavender rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
                  Artist Connect
                </h3>
                <p className="font-inter text-dark-gray/70 leading-relaxed">
                  Connect directly with your favorite artists and discover new talent from around the world.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="card-modern p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-soft-lavender to-brand-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PlayIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair text-xl font-bold text-dark-gray mb-4">
                  Live Events
                </h3>
                <p className="font-inter text-dark-gray/70 leading-relaxed">
                  Join exclusive live sessions, concerts, and meet artists in virtual and real venues.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-deep-teal via-brand-cyan to-earthy-brown relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-soft-lavender/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Music Experience?
            </h2>
            <p className="font-inter text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of music lovers who have already discovered their new favorite songs with Bright Ears.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="glass" 
                size="lg"
                className="text-white border-white/30 hover:bg-white/20"
              >
                Get Started Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-deep-teal"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-playfair text-3xl sm:text-4xl font-bold text-brand-cyan mb-2">1M+</div>
                <div className="font-inter text-dark-gray/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="font-playfair text-3xl sm:text-4xl font-bold text-earthy-brown mb-2">50K+</div>
                <div className="font-inter text-dark-gray/70">Artists</div>
              </div>
              <div className="text-center">
                <div className="font-playfair text-3xl sm:text-4xl font-bold text-deep-teal mb-2">100M+</div>
                <div className="font-inter text-dark-gray/70">Songs Played</div>
              </div>
              <div className="text-center">
                <div className="font-playfair text-3xl sm:text-4xl font-bold text-soft-lavender mb-2">200+</div>
                <div className="font-inter text-dark-gray/70">Countries</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default HomePage;