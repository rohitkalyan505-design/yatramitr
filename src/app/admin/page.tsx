'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  AlertTriangle, 
  Check, 
  X, 
  MapPin, 
  UserCheck, 
  FileText, 
  Clock, 
  Search, 
  Filter,
  Eye,
  AlertCircle
} from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';

interface ApplicationItem {
  id: string;
  name: string;
  region: string;
  yearsResident: string;
  languages: string;
  knowledgeScore: number;
  status: 'Under Review' | 'Approved' | 'Rejected';
  dateApplied: string;
  specialty: string;
}

interface PlaceSubmissionItem {
  id: string;
  title: string;
  region: string;
  submittedBy: string;
  crowdSensitivity: 'High' | 'Moderate';
  status: 'Pending Vetting' | 'Approved' | 'Changes Requested';
  coordinates: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'buddies' | 'places' | 'reports'>('buddies');

  const [applications, setApplications] = useState<ApplicationItem[]>([
    {
      id: 'APP-842',
      name: 'Kameshwar Rao Korra',
      region: 'Hyderabad, Telangana',
      yearsResident: 'Lifelong Native (28 yrs)',
      languages: 'Telugu, Kondh Tribal, Hindi',
      knowledgeScore: 96,
      status: 'Under Review',
      dateApplied: 'Yesterday',
      specialty: 'Tribal Ethnobotany & Dhimsa Ritual Rhythms',
    },
    {
      id: 'APP-839',
      name: 'Pema Wangdi',
      region: 'Ziro Valley (Hong Village)',
      yearsResident: 'Lifelong Native (34 yrs)',
      languages: 'Apatani, English, Hindi',
      knowledgeScore: 98,
      status: 'Under Review',
      dateApplied: '3 days ago',
      specialty: 'Bamboo Architecture & Wet-Paddy Canals',
    },
    {
      id: 'APP-821',
      name: 'Raghunath Murmu',
      region: 'Gandikota (Gorge Perimeter)',
      yearsResident: '14 Years',
      languages: 'Telugu, Kannada',
      knowledgeScore: 92,
      status: 'Approved',
      dateApplied: 'Oct 02, 2026',
      specialty: 'Fort Bastion Architecture & Stargazing',
    },
  ]);

  const [placeSubmissions, setPlaceSubmissions] = useState<PlaceSubmissionItem[]>([
    {
      id: 'SUB-209',
      title: 'Galikonda Highland Cloud Gap',
      region: 'Hyderabad, Telangana',
      submittedBy: 'Subba Rao Konda',
      crowdSensitivity: 'High',
      status: 'Pending Vetting',
      coordinates: '18.2514° N, 82.9641° E',
    },
    {
      id: 'SUB-198',
      title: 'Kinnerasani Hidden Bamboo Grove',
      region: 'Telangana Eastern Forests',
      submittedBy: 'V. Prakash',
      crowdSensitivity: 'Moderate',
      status: 'Pending Vetting',
      coordinates: '17.6890° N, 80.6210° E',
    },
  ]);

  const handleBuddyDecision = (id: string, decision: 'Approved' | 'Rejected') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: decision } : app))
    );
  };

  const handlePlaceDecision = (id: string, decision: 'Approved' | 'Changes Requested') => {
    setPlaceSubmissions((prev) =>
      prev.map((place) => (place.id === id ? { ...place, status: decision } : place))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-300 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-terracotta-600">
              Governance & Integrity
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-forest-900 text-gold-300">
              Admin Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-950">
            Yatra Mitra Verification Control
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700">
            Audit Local Mitra applications, vet submitted hidden trails against overtourism, and inspect safety reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-forest-100 border border-forest-200 text-xs font-bold text-forest-900">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            <span>Platform Vetting Active</span>
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-sand-200/70 max-w-md text-xs font-bold">
        <button
          onClick={() => setActiveTab('buddies')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'buddies'
              ? 'bg-forest-900 text-sand-50 shadow-sm'
              : 'text-charcoal-700 hover:text-forest-950'
          }`}
        >
          Buddy Applications ({applications.filter((a) => a.status === 'Under Review').length})
        </button>
        <button
          onClick={() => setActiveTab('places')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'places'
              ? 'bg-forest-900 text-sand-50 shadow-sm'
              : 'text-charcoal-700 hover:text-forest-950'
          }`}
        >
          Place Submissions ({placeSubmissions.filter((p) => p.status === 'Pending Vetting').length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
            activeTab === 'reports'
              ? 'bg-forest-900 text-sand-50 shadow-sm'
              : 'text-charcoal-700 hover:text-forest-950'
          }`}
        >
          Safety Reports (1)
        </button>
      </div>

      {/* Tab 1: Buddy Applications Queue */}
      {activeTab === 'buddies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Pending Local Mitra Vetting Queue
            </h3>
            <span className="text-xs text-charcoal-600">
              Aadhaar & oral knowledge test review
            </span>
          </div>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-6 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-forest-950 bg-sand-200 px-2.5 py-0.5 rounded">
                      {app.id}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-forest-950">
                      {app.name}
                    </h4>
                    <span className="text-charcoal-500">•</span>
                    <span className="text-charcoal-700 font-medium">{app.region}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'Approved'
                        ? 'bg-forest-100 text-forest-800'
                        : app.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      ● {app.status}
                    </span>
                    <span className="text-[11px] text-charcoal-500">{app.dateApplied}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-charcoal-800">
                  <div>
                    <strong className="text-forest-950 block">Ancestral Roots:</strong>
                    <span>{app.yearsResident}</span>
                  </div>
                  <div>
                    <strong className="text-forest-950 block">Languages:</strong>
                    <span>{app.languages}</span>
                  </div>
                  <div>
                    <strong className="text-forest-950 block">Oral Assessment Score:</strong>
                    <span className="font-bold text-forest-900">{app.knowledgeScore}/100</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sand-100 text-charcoal-800">
                  <strong className="text-forest-950 font-serif">Proposed Area of Expertise:</strong> {app.specialty}
                </div>

                {app.status === 'Under Review' && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleBuddyDecision(app.id, 'Rejected')}
                      className="px-4 py-2 rounded-xl border border-red-300 text-red-700 font-bold hover:bg-red-50 text-xs"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleBuddyDecision(app.id, 'Approved')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold text-xs shadow transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-gold-400" />
                      <span>Approve & Grant Trust Badge</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Place Submissions */}
      {activeTab === 'places' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Submitted Hidden Places & Sensitive Routes
            </h3>
            <span className="text-xs text-charcoal-600">
              Ecological sensitivity & anti-geotagging audit
            </span>
          </div>

          <div className="space-y-3">
            {placeSubmissions.map((place) => (
              <div
                key={place.id}
                className="p-6 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-4 text-xs"
              >
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-forest-950 bg-sand-200 px-2 py-0.5 rounded">
                      {place.id}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-forest-950">
                      {place.title}
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    place.status === 'Approved'
                      ? 'bg-forest-100 text-forest-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    ● {place.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-charcoal-800">
                  <div>
                    <strong className="text-forest-950 block">Geography:</strong>
                    <span>{place.region}</span>
                  </div>
                  <div>
                    <strong className="text-forest-950 block">Contributed By:</strong>
                    <span>{place.submittedBy}</span>
                  </div>
                  <div>
                    <strong className="text-forest-950 block">Ecosystem Sensitivity:</strong>
                    <span className="text-terracotta-700 font-bold">{place.crowdSensitivity} (No public geotags)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sand-100 flex items-center justify-between text-charcoal-700 font-mono text-[11px]">
                  <span>GPS Landmark: {place.coordinates}</span>
                  <span className="text-forest-800 font-sans font-bold">Offline Topo Map Generated</span>
                </div>

                {place.status === 'Pending Vetting' && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handlePlaceDecision(place.id, 'Changes Requested')}
                      className="px-4 py-2 rounded-xl border border-sand-300 text-charcoal-700 font-semibold hover:bg-sand-100 text-xs"
                    >
                      Request Route Adjustments
                    </button>
                    <button
                      onClick={() => handlePlaceDecision(place.id, 'Approved')}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-sand-50 font-bold text-xs shadow"
                    >
                      <Check className="w-3.5 h-3.5 text-gold-400" />
                      <span>Approve for Seeded Recommendation</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Safety Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-forest-950">
              Community Trail Reports & Incident Moderation
            </h3>
            <span className="text-xs text-charcoal-600">
              Real-time traveler and host safety logs
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-sand-50 border border-sand-300 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-sand-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-forest-950 text-sm">
                  Report #REP-089: Unmarked Slippery Rock Section
                </span>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Investigating
              </span>
            </div>

            <p className="text-charcoal-800 leading-relaxed">
              <strong>Location:</strong> Charminar Area Heritage Walk Meeting Point (Hyderabad).
              <br />
              <strong>Feedback:</strong> Traveler noticed sudden moss growth following recent unseasonal rain. Recommended advising travelers to wear spiked rubber footwear or carry bamboo poles.
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-sand-200 text-charcoal-600 text-[11px]">
              <span>Logged by Traveler Aditi Sharma • Trip ID: YM-2026-HYD-084</span>
              <button
                onClick={() => alert('Safety note broadcasted to all Hyderabad Local Mitras.')}
                className="px-3 py-1.5 rounded-lg bg-forest-900 text-sand-50 font-bold hover:bg-forest-800"
              >
                Broadcast Advisory to Mitras
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
