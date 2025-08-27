"use client";

import React from 'react';
import { MusicalNoteIcon, CurrencyDollarIcon, UsersIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Link } from '@/components/navigation';

const ArtistSignupSection: React.FC = () => {
  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: "Zero Commission",
      description: "Keep 100% of your earnings"
    },
    {
      icon: UsersIcon,
      title: "Direct Bookings",
      description: "Connect directly with clients"
    },
    {
      icon: CheckBadgeIcon,
      title: "Verified Profile",
      description: "Build trust with verification"
    },
    {
      icon: MusicalNoteIcon,
      title: "Grow Your Career",
      description: "Access corporate & hotel gigs"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-deep-teal via-deep-teal/95 to-earthy-brown/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <MusicalNoteIcon className="w-4 h-4 text-brand-cyan" />
              <span className="text-sm font-medium text-white">For Artists & Musicians</span>
            </div>
            
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
              Are You an Entertainer?
            </h2>
            
            <p className="text-lg text-white/90 mb-8">
              Join 10,000+ artists earning more with zero commission. Get direct access to corporate events, hotels, weddings, and private parties across Thailand.
            </p>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{benefit.title}</div>
                    <div className="text-white/70 text-xs">{benefit.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/register/artist" className="group px-8 py-4 bg-gradient-to-r from-brand-cyan to-deep-teal text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-cyan/50 inline-block">
                <span className="flex items-center gap-2">
                  Start Your Artist Profile
                  <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              
              <Link href="/artist-login" className="group px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-white/20 inline-block">
                <span className="flex items-center gap-2">
                  Already a Member? Login
                </span>
              </Link>
            </div>

            <p className="mt-4 text-sm text-white/70">
              <span className="text-brand-cyan font-semibold">✓</span> Quick approval • 
              <span className="text-brand-cyan font-semibold">✓</span> Professional support • 
              <span className="text-brand-cyan font-semibold">✓</span> No hidden fees • 
              <span className="text-brand-cyan font-semibold">✓</span> Start earning today
            </p>
          </div>

          {/* Right Content - Stats & Social Proof */}
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/20 to-soft-lavender/20 rounded-3xl blur-3xl" />
            
            {/* Stats Cards */}
            <div className="relative space-y-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-playfair text-2xl font-bold text-white">Success Stories</h3>
                  <span className="text-brand-cyan text-sm font-semibold">NEW</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-cyan to-deep-teal" />
                    <div className="flex-1">
                      <div className="text-white font-semibold">DJ Max</div>
                      <div className="text-white/70 text-sm">15 bookings this month • ฿125,000 earned</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-soft-lavender to-earthy-brown" />
                    <div className="flex-1">
                      <div className="text-white font-semibold">The Jazz Quartet</div>
                      <div className="text-white/70 text-sm">Regular at 5 hotels • ฿200,000/month</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                  <div className="font-playfair text-3xl font-bold text-white mb-1">฿8,500</div>
                  <div className="text-white/70 text-sm">Avg. per booking</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
                  <div className="font-playfair text-3xl font-bold text-white mb-1">24hr</div>
                  <div className="text-white/70 text-sm">Approval time</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-brand-cyan/20 to-soft-lavender/20 border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white font-semibold text-sm">23 artists joined today</span>
                </div>
                <div className="text-white/70 text-xs">
                  High demand for wedding DJs and jazz bands this month
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistSignupSection;