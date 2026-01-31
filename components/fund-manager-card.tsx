'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Award,
  Building2,
  Calendar,
  DollarSign,
  Target,
  Linkedin,
  Twitter,
} from 'lucide-react';

interface ManagerDetails {
  name: string;
  bio?: string;
  experience?: number; // years
  qualification?: string[];
  designation?: string;
  currentFundHouse?: string;
  fundsManaged?: number;
  totalAumManaged?: number; // in crores
  joinedDate?: string; // Date when joined current fund house
  previousFundHouses?: string[]; // Previous employers
  investmentPhilosophy?: string; // Manager's investment approach
  specialization?: string[]; // Areas of expertise (e.g., ["Large Cap", "Technology Sector"])
  performanceRank?: string; // e.g., "Top 10% in category"
  averageReturns?: {
    oneYear?: number;
    threeYear?: number;
    fiveYear?: number;
    tenYear?: number;
  };
  awards?: string[];
  certifications?: string[]; // Professional certifications (CFA, etc.)
  linkedin?: string;
  twitter?: string;
  email?: string;
}

interface FundManagerCardProps {
  managerDetails: ManagerDetails | null;
  fallbackName?: string | { name?: string; experience?: string } | any;
}

export function FundManagerCard({
  managerDetails,
  fallbackName,
}: FundManagerCardProps) {
  // Safely extract manager name and experience from fallbackName
  // Handle both string and object formats
  const extractManagerInfo = () => {
    if (!fallbackName) {
      return { name: null, experience: null };
    }

    if (typeof fallbackName === 'string') {
      return { name: fallbackName, experience: null };
    }

    if (typeof fallbackName === 'object' && fallbackName !== null) {
      return {
        name: fallbackName.name || null,
        experience: fallbackName.experience || null,
      };
    }

    return { name: null, experience: null };
  };

  const { name: fallbackManagerName, experience: fallbackManagerExperience } =
    extractManagerInfo();

  // Handle null/missing manager details
  if (!managerDetails) {
    return (
      <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 text-transparent bg-clip-text">
                Fund Manager
              </CardTitle>
              <CardDescription className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {fallbackManagerName ? (
                  <>
                    <div className="font-medium">{fallbackManagerName}</div>
                    {fallbackManagerExperience && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Experience: {fallbackManagerExperience}
                      </div>
                    )}
                  </>
                ) : (
                  'Information not available'
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 p-4 bg-white/80 dark:bg-gray-900/40 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-gray-600 dark:text-gray-400">
              Detailed information not available for this fund manager.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {managerDetails.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 mt-1">
              {managerDetails.designation && (
                <>
                  <Briefcase className="w-4 h-4" />
                  {managerDetails.designation}
                </>
              )}
              {managerDetails.currentFundHouse && (
                <>
                  {managerDetails.designation && ' • '}
                  <Building2 className="w-4 h-4" />
                  {managerDetails.currentFundHouse}
                </>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Experience */}
          {managerDetails.experience !== undefined && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Experience
                </span>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 text-transparent bg-clip-text">
                {managerDetails.experience} Years
              </p>
            </div>
          )}

          {/* Funds Managed */}
          {managerDetails.fundsManaged !== undefined && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Funds
                </span>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 text-transparent bg-clip-text">
                {managerDetails.fundsManaged}
              </p>
            </div>
          )}

          {/* Total AUM */}
          {managerDetails.totalAumManaged !== undefined && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                  Total AUM
                </span>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 text-transparent bg-clip-text">
                ₹{managerDetails.totalAumManaged.toLocaleString('en-IN')} Cr
              </p>
            </div>
          )}

          {/* Qualifications */}
          {managerDetails.qualification &&
            managerDetails.qualification.length > 0 && (
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                    Education
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                  {managerDetails.qualification.join(', ')}
                </p>
              </div>
            )}
        </div>

        {/* Career Timeline */}
        {(managerDetails.joinedDate || managerDetails.previousFundHouses) && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Career Timeline
            </h4>
            <div className="space-y-3">
              {managerDetails.joinedDate && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {managerDetails.currentFundHouse || 'Current Fund House'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Joined:{' '}
                      {new Date(managerDetails.joinedDate).toLocaleDateString(
                        'en-IN',
                        { month: 'long', year: 'numeric' }
                      )}
                    </p>
                  </div>
                </div>
              )}
              {managerDetails.previousFundHouses &&
                managerDetails.previousFundHouses.length > 0 && (
                  <div className="pl-1 border-l-2 border-gray-300 dark:border-gray-700 ml-1">
                    {managerDetails.previousFundHouses.map((company, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 mb-2 pl-4"
                      >
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {company}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Biography Section */}
        {managerDetails.bio && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Biography
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {managerDetails.bio}
            </p>
          </div>
        )}

        {/* Investment Philosophy */}
        {managerDetails.investmentPhilosophy && (
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Investment Philosophy
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
              "{managerDetails.investmentPhilosophy}"
            </p>
          </div>
        )}

        {/* Specialization & Performance Rank */}
        {(managerDetails.specialization || managerDetails.performanceRank) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Specialization */}
            {managerDetails.specialization && (
              <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Areas of Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(managerDetails.specialization)
                    ? managerDetails.specialization
                    : [managerDetails.specialization]
                  ).map((spec, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full border border-purple-300 dark:border-purple-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Rank */}
            {managerDetails.performanceRank && (
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-200 dark:border-green-800">
                <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  Performance Ranking
                </h4>
                <p className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 text-transparent bg-clip-text">
                  {managerDetails.performanceRank}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Average Returns Section */}
        {managerDetails.averageReturns && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Average Returns Track Record
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 1 Year Returns */}
              {managerDetails.averageReturns.oneYear !== undefined && (
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    1 Year
                  </p>
                  <p
                    className={`text-3xl font-extrabold ${
                      managerDetails.averageReturns.oneYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {managerDetails.averageReturns.oneYear >= 0 ? '+' : ''}
                    {managerDetails.averageReturns.oneYear.toFixed(2)}%
                  </p>
                </div>
              )}

              {/* 3 Year Returns */}
              {managerDetails.averageReturns.threeYear !== undefined && (
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    3 Year
                  </p>
                  <p
                    className={`text-3xl font-extrabold ${
                      managerDetails.averageReturns.threeYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {managerDetails.averageReturns.threeYear >= 0 ? '+' : ''}
                    {managerDetails.averageReturns.threeYear.toFixed(2)}%
                  </p>
                </div>
              )}

              {/* 5 Year Returns */}
              {managerDetails.averageReturns.fiveYear !== undefined && (
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    5 Year
                  </p>
                  <p
                    className={`text-3xl font-extrabold ${
                      managerDetails.averageReturns.fiveYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {managerDetails.averageReturns.fiveYear >= 0 ? '+' : ''}
                    {managerDetails.averageReturns.fiveYear.toFixed(2)}%
                  </p>
                </div>
              )}

              {/* 10 Year Returns */}
              {managerDetails.averageReturns.tenYear !== undefined && (
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    10 Year
                  </p>
                  <p
                    className={`text-3xl font-extrabold ${
                      managerDetails.averageReturns.tenYear >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {managerDetails.averageReturns.tenYear >= 0 ? '+' : ''}
                    {managerDetails.averageReturns.tenYear.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center italic">
              Average returns across all funds managed by this fund manager
            </p>
          </div>
        )}

        {/* Certifications */}
        {managerDetails.certifications &&
          managerDetails.certifications.length > 0 && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800">
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                Professional Certifications
              </h4>
              <div className="flex flex-wrap gap-2">
                {managerDetails.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 text-sm font-bold rounded-lg border-2 border-amber-300 dark:border-amber-700"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Awards Section */}
        {managerDetails.awards && managerDetails.awards.length > 0 && (
          <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-amber-200 dark:border-amber-800">
            <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Awards & Recognition
            </h4>
            <ul className="space-y-2">
              {managerDetails.awards.map((award, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  <span className="text-lg">🏆</span>
                  <span className="flex-1">{award}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Social Media Links */}
        {(managerDetails.linkedin || managerDetails.twitter) && (
          <div className="flex gap-3 flex-wrap">
            {managerDetails.linkedin && (
              <a
                href={managerDetails.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[150px]"
              >
                <Button
                  variant="outline"
                  className="w-full border-2 border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </Button>
              </a>
            )}
            {managerDetails.twitter && (
              <a
                href={managerDetails.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[150px]"
              >
                <Button
                  variant="outline"
                  className="w-full border-2 border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 text-sky-600 dark:text-sky-400 font-semibold"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter Profile
                </Button>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
