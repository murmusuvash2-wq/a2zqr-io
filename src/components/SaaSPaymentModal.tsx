import React, { useState, useEffect } from 'react';
import { 
  X, Check, Sparkles, CreditCard, ShieldCheck, 
  HelpCircle, Smartphone, Award, ArrowRight, Activity, Globe, User, Lock, Mail, ChevronRight, Compass
} from 'lucide-react';
import { authService, UserStats } from '../lib/firebase';

interface SaaSPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (updatedUser: UserStats) => void;
  initialUser: UserStats | null;
}

export default function SaaSPaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  initialUser
}: SaaSPaymentModalProps) {
  // Sync core credentials
  const [currentUser, setCurrentUser] = useState<UserStats | null>(initialUser);
  const [activeStep, setActiveStep] = useState<'auth' | 'checkout' | 'success'>('auth');
  
  // Auth states
  const [email, setEmail] = useState('test@a2zqr.com');
  const [password, setPassword] = useState('password123');
  const [isRegister, setIsRegister] = useState(false);
  const [country, setCountry] = useState<'IN' | 'US'>('IN');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // checkout details
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi');

  // Multi-sync when props update or modal reloads
  useEffect(() => {
    setCurrentUser(initialUser);
    if (initialUser) {
      setCountry(initialUser.country as any || 'IN');
      if (initialUser.isPro) {
        setActiveStep('success');
      } else {
        setActiveStep('checkout');
      }
    } else {
      setActiveStep('auth');
    }
    setAuthError('');
  }, [isOpen, initialUser]);

  // Handle local location-based toggle
  useEffect(() => {
    setPaymentMethod(country === 'IN' ? 'upi' : 'card');
  }, [country]);

  if (!isOpen) return null;

  // Localized pricing structures
  const pricing = {
    IN: {
      monthly: { price: 149, symbol: '₹', label: '/month' },
      yearly: { price: 999, symbol: '₹', label: '/year', offer: 'Save ₹789 over monthly!' }
    },
    US: {
      monthly: { price: 9, symbol: '$', label: '/month' },
      yearly: { price: 49, symbol: '$', label: '/year', offer: 'Save over 50% on yearly plan!' }
    }
  };

  const selectedPrice = pricing[country][billingCycle];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setAuthError('Please input both functional email and password credentials.');
      return;
    }
    setAuthError('');
    setLoading(true);
    try {
      let result: UserStats;
      if (isRegister) {
        result = await authService.registerUser(email, password, country);
      } else {
        result = await authService.loginUser(email, password);
      }
      
      setCurrentUser(result);
      onPaymentSuccess(result); // sync instantly with top level frame state
      
      // If already Pro customer, directly congratulate
      if (result.isPro) {
        setActiveStep('success');
      } else {
        setActiveStep('checkout');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Verification of account has failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!currentUser) {
      setAuthError('No customer session detected. Please log in first.');
      return;
    }
    setLoading(true);
    try {
      const upgraded = await authService.upgradeUserToPro(currentUser.uid, billingCycle, country);
      setCurrentUser(upgraded);
      onPaymentSuccess(upgraded);
      setActiveStep('success');
    } catch (err: any) {
      setAuthError(err.message || 'Secured billing simulator failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
        
        {/* Modal Branding Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-xs font-bold text-slate-300 tracking-wider font-mono uppercase">
              Secure Subscription Wizard • A2ZQR Premium
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer text-xs flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>

        {/* Two-Column Simplified Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto flex-grow text-slate-200">
          
          {/* LEFT PANEL: Free vs Pro comparison breakdown */}
          <div className="lg:col-span-5 p-6 bg-slate-950/60 border-r border-slate-800/80 space-y-6">
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Feature Comparison</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Design custom branding codes instantly. Compare direct limits below and configure the plan that matches your production workflow.
              </p>
            </div>

            {/* Comparison Stack */}
            <div className="space-y-4">
              
              {/* Free Box */}
              <div className="p-3.5 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-xs font-black text-slate-300 uppercase letter tracking-wider font-mono">⭐ FREE PLAN</span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded">No login needed</span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                    <span>Basic high-contrast crisp squares</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-slate-500" />
                    <span>Standard presets (Plain Links, WiFi settings)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">&#x2715;</span>
                    <span className="text-slate-500">CTA framing borders (Smartphone surrounds, speech balloons)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">&#x2715;</span>
                    <span className="text-slate-500">No custom brand logo uploads</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-rose-500 font-bold">&#x2715;</span>
                    <span className="text-slate-500">Premium design styles have watermark overlays</span>
                  </li>
                </ul>
              </div>

              {/* Pro Box */}
              <div className="p-4 bg-indigo-650/10 border-2 border-indigo-500/30 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[8px] font-bold px-3 py-0.5 rounded-bl uppercase tracking-widest font-mono">
                  POPULAR
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-indigo-500/10 shadow-sm">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    👑 PRO PREMIUM MEMBER
                  </span>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>**Stylized CTA framing shapes** & frames included</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>**Custom company brand logo embeds**</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Diagonal gradients, premium stars & classy curves</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>**No watermarks** exported in secure HD files</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>100+ professional tools workspace profile access</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Unlimited generator lifetime quotas</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: Authentication and simplified secure pay simulation */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              {authError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl font-mono flex items-center gap-2 animate-shake">
                  <span className="font-extrabold text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded">ERROR:</span>
                  <span>{authError}</span>
                </div>
              )}

              {/* ACTION WINDOWS */}
              {activeStep === 'auth' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>{isRegister ? 'Create Premium Member Credentials' : 'Sign In Active Premium Session'}</span>
                    </h4>
                    <p className="text-xs text-slate-400 leading-normal">
                      Only premium styles and watermark bypass require a registered session. Free basic tools run automatically.
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="suvash.astrology@gmail.com"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                      />
                    </div>

                    {isRegister && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-500 font-bold block">
                          Select Local Pricing Territory (Location-Based)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setCountry('IN')}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              country === 'IN' 
                                ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold' 
                                : 'bg-slate-950/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold block">🇮🇳 India</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5">₹149/mo • ₹999/yr</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCountry('US')}
                            className={`p-2 rounded-xl border text-left transition-all ${
                              country === 'US' 
                                ? 'bg-indigo-600/10 border-indigo-500 text-white font-bold' 
                                : 'bg-slate-950/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="text-xs font-semibold block">🌐 Overseas / Global</span>
                            <span className="text-[9px] text-slate-500 font-mono mt-0.5">$9/mo • $49/yr</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-550 text-white rounded-xl text-xs font-black shadow transition-all flex items-center justify-center gap-1.5 mt-4 group cursor-pointer"
                    >
                      <span>{loading ? 'Authenticating...' : isRegister ? 'Confirm Account & Start Payments' : 'Verify Account Session'}</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </form>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRegister(!isRegister)}
                      className="text-indigo-400 hover:text-indigo-300 text-xs underline font-medium"
                    >
                      {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                    </button>
                  </div>
                </div>
              )}

              {activeStep === 'checkout' && (
                <div className="space-y-4">
                  {/* Active authentication status */}
                  <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-850 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-mono">Premium Account Active</p>
                        <p className="font-bold text-slate-200">{currentUser?.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        authService.logout();
                        setCurrentUser(null);
                        setActiveStep('auth');
                      }}
                      className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded hover:bg-rose-500/20"
                    >
                      Exit Session
                    </button>
                  </div>

                  {/* Pricing Switcher */}
                  <div className="bg-slate-950 p-1 rounded-xl border border-slate-850 grid grid-cols-2 text-center text-xs">
                    <button
                      type="button"
                      onClick={() => setBillingCycle('monthly')}
                      className={`py-2 rounded-lg transition-all ${
                        billingCycle === 'monthly' ? 'bg-indigo-650 font-bold text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Monthly Cycle
                    </button>
                    <button
                      type="button"
                      onClick={() => setBillingCycle('yearly')}
                      className={`py-2 rounded-lg transition-all relative ${
                        billingCycle === 'yearly' ? 'bg-indigo-650 font-bold text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span>Yearly Cycle</span>
                      <span className="absolute -top-1.5 -right-0.5 bg-emerald-500 text-white text-[7px] font-black px-1 rounded-full uppercase">
                        BEST VALUE
                      </span>
                    </button>
                  </div>

                  {/* Payment Details Container */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850/80 space-y-4">
                    <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl">
                      <span className="text-xs text-slate-400 font-medium">Subscription Bill Rate:</span>
                      <div className="text-right">
                        <span className="text-xl font-mono font-black text-white">
                          {selectedPrice.symbol}{selectedPrice.price}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{selectedPrice.label}</span>
                      </div>
                    </div>

                    {selectedPrice.offer && (
                      <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-lg p-2 text-center">
                        <span className="text-[9px] font-extrabold text-emerald-400 font-mono">
                          🎉 {selectedPrice.offer}
                        </span>
                      </div>
                    )}

                    {/* LOCATION-BASED SMART PAYMENT SWITCH */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between border-b border-rose-500/0 pb-1">
                        <span className="text-[10px] font-mono uppercase text-indigo-400 tracking-wider">
                          {country === 'IN' ? '🇮🇳 Indian Payment Mode Unified' : '🌐 Secure Card Gateway (Stripe Match)'}
                        </span>
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      {country === 'IN' ? (
                        <div className="space-y-3">
                          <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-xl max-w-[120px] mx-auto">
                            {/* Simulator BHIM QR Vector */}
                            <div className="w-20 h-20 bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-400 rounded-lg relative">
                              <span className="text-[7px] font-mono text-slate-500">BHIM UPI QR</span>
                              <div className="w-12 h-12 bg-slate-800 text-[10px] rounded flex items-center justify-center text-white font-extrabold mt-1">
                                UPI PAY
                              </div>
                            </div>
                          </div>
                          <p className="text-[9px] text-slate-400 text-center font-mono uppercase">
                            SIMULATOR: Scan QR using PhonePe, GPay, or Paytm
                          </p>

                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-mono text-slate-500 block">VPA UPI Address</label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="suvash@okaxis"
                              className="w-full px-3 py-1.5 bg-[#05050c] border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="space-y-1">
                            <label className="text-[9px] uppercase font-mono text-slate-500 block">Credit Card Number</label>
                            <input
                              type="text"
                              maxLength={19}
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4242 4242 4242 4242"
                              className="w-full px-3 py-1.5 bg-[#05050c] border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-mono text-slate-500 block">Expiry (MM/YY)</label>
                              <input
                                type="text"
                                maxLength={5}
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                placeholder="12/30"
                                className="w-full px-3 py-1.5 bg-[#05050c] border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] uppercase font-mono text-slate-500 block">CVV</label>
                              <input
                                type="password"
                                maxLength={3}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                placeholder="***"
                                className="w-full px-3 py-1.5 bg-[#05050c] border border-slate-800 rounded-lg focus:border-indigo-500 focus:outline-none text-xs text-slate-200"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-white rounded-xl text-xs font-black shadow transition-all uppercase tracking-wider cursor-pointer"
                  >
                    {loading ? 'Processing premium billing...' : 'Simulate secure checkout & bypass locks'}
                  </button>
                </div>
              )}

              {activeStep === 'success' && (
                <div className="text-center space-y-6 py-8 animate-scaleUp">
                  <div className="w-14 h-14 bg-gradient-to-tr from-emerald-400 to-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Award className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Premium Profile Unlocked!
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Your registered account **{currentUser?.email}** is active under the premium membership tier. Clean exports are now unlocked!
                    </p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 max-w-xs mx-auto text-[11px] space-y-2 text-left font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-500">MEMBER TIER:</span>
                      <span className="text-indigo-400 font-bold uppercase">{currentUser?.planType} PRO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">DAILY LIMITS:</span>
                      <span className="text-emerald-400 font-bold">UNLIMITED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">EXPIRY DATE:</span>
                      <span className="text-slate-200">
                        {currentUser?.expiryDate ? new Date(currentUser.expiryDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-indigo-650 hover:bg-indigo-550 text-white text-xs font-bold rounded-xl shadow transition-all"
                  >
                    Start Creating Brands
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Security Seals */}
            <div className="flex items-center gap-2 justify-center text-[10px] text-slate-500 pt-4 border-t border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>PCI-DSS Secured SSL Node Gateway. Auto-expiry simulated cleanly.</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
