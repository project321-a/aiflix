'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Navbar from '@/components/Navbar'
import { 
  Check, Crown, ChevronLeft, ChevronRight, CreditCard, 
  Shield, Smartphone, Wallet, Building2, Globe, Sparkles, Zap, Clock, Award, Star,
  ChevronDown, ChevronUp, Mail, MapPin, Phone
} from 'lucide-react'

// Pricing plans
const PLANS = [
  {
    id: 'monthly',
    name: '1 Month',
    priceUSD: 2.99,
    priceEUR: 2.79,
    priceGBP: 2.39,
    priceNGN: 4500,
    priceKES: 78,
    priceTZS: 2000,
    priceUGX: 3000,
    per: '1-time-payment',
    badge: '',
    color: 'from-blue-600 to-blue-500',
    features: ['No ads', 'HD 720p quality', 'Cancel anytime']
  },
  {
    id: 'quarterly',
    name: '3 Month',
    priceUSD: 6.99,
    priceEUR: 6.49,
    priceGBP: 5.59,
    priceNGN: 10500,
    priceKES: 196,
    priceTZS: 5000,
    priceUGX: 7000,
    per: '1-time-payment',
    badge: 'BEST VALUE',
    color: 'from-purple-600 to-purple-500',
    features: ['No ads', 'HD 720p quality', 'Cancel anytime']
  },
  {
    id: 'annual',
    name: '12 Month',
    priceUSD: 19.99,
    priceEUR: 18.49,
    priceGBP: 15.99,
    priceNGN: 30000,
    priceKES: 582,
    priceTZS: 15000,
    priceUGX: 22000,
    per: '1-time-payment',
    badge: 'SAVE 44%',
    color: 'from-green-600 to-green-500',
    features: ['No ads', 'HD 720p quality', 'Cancel anytime']
  }
]

// Currency configuration
const CURRENCIES = {
  USD: { symbol: '$', label: 'USD', region: 'Global' },
  EUR: { symbol: '€', label: 'EUR', region: 'Europe' },
  GBP: { symbol: '£', label: 'GBP', region: 'UK' },
  NGN: { symbol: '₦', label: 'NGN', region: 'Nigeria' },
  KES: { symbol: 'KSh', label: 'KES', region: 'Kenya' },
  TZS: { symbol: 'TSh', label: 'TZS', region: 'Tanzania' },
  UGX: { symbol: 'USh', label: 'UGX', region: 'Uganda' },
}

// Payment methods
const PAYMENT_METHODS = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: <CreditCard size={20} />,
    currencies: ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'TZS', 'UGX'],
    description: 'Visa, Mastercard, Amex',
  },
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: <Smartphone size={20} />,
    currencies: ['KES', 'TZS', 'UGX'],
    description: 'Kenya, Tanzania, Uganda',
  },
  {
    id: 'mtn',
    name: 'MTN Mobile Money',
    icon: <Smartphone size={20} />,
    currencies: ['NGN'],
    description: 'Nigeria',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <Wallet size={20} />,
    currencies: ['USD', 'EUR', 'GBP'],
    description: 'PayPal wallet',
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: <Building2 size={20} />,
    currencies: ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'TZS', 'UGX'],
    description: 'Direct bank transfer',
  },
]

export default function SubscribePage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('free')
  const [currency, setCurrency] = useState('KES')
  const [error, setError] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState('card')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Form fields
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCVC, setCardCVC] = useState('')
  const [cardName, setCardName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')

  useEffect(() => {
    if (session?.user?.email) {
      fetch('/api/subscription')
        .then(res => res.json())
        .then(data => {
          if (data.plan) setCurrentPlan(data.plan)
        })
        .catch(() => {})
    }
  }, [session])

  useEffect(() => {
    const available = getAvailablePaymentMethods()
    if (available.length > 0) {
      setSelectedPayment(available[0].id)
    }
  }, [currency])

  const getPrice = (plan: typeof PLANS[0]) => {
    const currencyKey = currency as keyof typeof plan
    if (currencyKey === 'priceUSD') return plan.priceUSD
    if (currencyKey === 'priceEUR') return plan.priceEUR
    if (currencyKey === 'priceGBP') return plan.priceGBP
    if (currencyKey === 'priceNGN') return plan.priceNGN
    if (currencyKey === 'priceKES') return plan.priceKES
    if (currencyKey === 'priceTZS') return plan.priceTZS
    if (currencyKey === 'priceUGX') return plan.priceUGX
    return plan.priceUSD
  }

  const formatPrice = (price: number) => {
    const currencyData = CURRENCIES[currency as keyof typeof CURRENCIES]
    if (currency === 'NGN' || currency === 'KES' || currency === 'TZS' || currency === 'UGX') {
      return `${currencyData.symbol}${price.toLocaleString()}`
    }
    return `${currencyData.symbol}${price.toFixed(2)}`
  }

  const getAvailablePaymentMethods = () => {
    return PAYMENT_METHODS.filter(m => 
      m.currencies.includes(currency)
    )
  }

  const availableMethods = getAvailablePaymentMethods()

  const handleSubscribe = (planId: string) => {
    if (!session) {
      router.push('/login')
      return
    }
    setSelectedPlanIndex(PLANS.findIndex(p => p.id === planId))
    setShowPayment(true)
  }

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1)

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessingPayment(true)
    setError('')

    const selectedPlan = PLANS[selectedPlanIndex]

    // Validation
    if (selectedPayment === 'card') {
      if (!cardNumber || !cardExpiry || !cardCVC || !cardName) {
        setError('Please fill in all card details')
        setProcessingPayment(false)
        return
      }
    }

    if ((selectedPayment === 'mpesa' || selectedPayment === 'mtn') && !phoneNumber) {
      setError('Please enter your phone number')
      setProcessingPayment(false)
      return
    }

    if (selectedPayment === 'bank' && (!bankName || !accountNumber)) {
      setError('Please fill in bank details')
      setProcessingPayment(false)
      return
    }

    await new Promise(resolve => setTimeout(resolve, 2000))

    try {
      const res = await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan.id })
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || 'Subscription failed')
        setProcessingPayment(false)
        return
      }

      await update()
      setCurrentPlan(selectedPlan.id)
      setPaymentSuccess(true)
      setShowPayment(false)
      setProcessingPayment(false)
      
      setTimeout(() => {
        router.push('/')
      }, 2500)
      
    } catch (error) {
      setError('Something went wrong')
      setProcessingPayment(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '')
    const groups = v.match(/.{1,4}/g)
    return groups ? groups.join(' ') : v
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4)
    }
    return v
  }

  const selectedPlan = PLANS[selectedPlanIndex]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-purple-900/30 via-black to-black pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-1 mb-4">
              <Crown size={14} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold">PREMIUM BENEFITS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get your Premium Benefits
            </h1>
            
            {/* Benefits Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-1">🚫</div>
                <div className="text-sm font-semibold">No ads</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-1">🎬</div>
                <div className="text-sm font-semibold">HD 720p quality</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-1">📱</div>
                <div className="text-sm font-semibold">Multi-downloads</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <div className="text-2xl mb-1">♾️</div>
                <div className="text-sm font-semibold">Unlimited access</div>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="flex justify-center mt-8">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white"
              >
                {Object.entries(CURRENCIES).map(([key, { symbol, label }]) => (
                  <option key={key} value={key}>{symbol} {label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, index) => {
              const isCurrent = currentPlan === plan.id
              const price = getPrice(plan)
              const formattedPrice = formatPrice(price)
              const isPopular = plan.badge === 'BEST VALUE'

              return (
                <div
                  key={plan.id}
                  className={`relative bg-gray-900 rounded-2xl border-2 p-6 transition-all hover:-translate-y-1 ${
                    isCurrent
                      ? 'border-green-500 shadow-lg shadow-green-500/20'
                      : isPopular
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                      BEST VALUE
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-center">{plan.name}</h3>
                  
                  <div className="text-center mt-4">
                    <span className="text-4xl font-bold">{formattedPrice}</span>
                    <span className="text-gray-400 text-sm block">{plan.per}</span>
                  </div>

                  <ul className="mt-6 space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check size={16} className="text-green-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading || isCurrent}
                    className={`mt-6 w-full py-3 rounded-xl font-bold text-lg transition ${
                      isCurrent
                        ? 'bg-gray-700 text-gray-400 cursor-default'
                        : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white`
                    }`}
                  >
                    {isCurrent ? '✓ Active' : 'Buy Now'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-lg w-full my-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Complete Payment</h2>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">{selectedPlan.name} Plan</div>
                    <div className="text-sm text-gray-400">{selectedPlan.per}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(getPrice(selectedPlan))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-4">
                <label className="text-sm font-medium mb-3 block">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`p-3 rounded-xl border-2 text-left transition ${
                        selectedPayment === method.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={selectedPayment === method.id ? 'text-purple-400' : 'text-gray-400'}>
                          {method.icon}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{method.name}</div>
                          <div className="text-xs text-gray-500">{method.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-3">
                  {/* Card Payment */}
                  {selectedPayment === 'card' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                            required
                          />
                          <CreditCard size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Expiry Date</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">CVC</label>
                          <input
                            type="password"
                            placeholder="123"
                            value={cardCVC}
                            onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            maxLength={3}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* M-Pesa / MTN */}
                  {(selectedPayment === 'mpesa' || selectedPayment === 'mtn') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input
                          type="tel"
                          placeholder={selectedPayment === 'mpesa' ? '07XX XXX XXX' : '080X XXX XXXX'}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-400 flex items-start gap-2">
                        <Smartphone size={18} className="flex-shrink-0 mt-0.5" />
                        <p>A payment prompt will be sent to your phone. Enter your PIN on your phone to complete.</p>
                      </div>
                    </>
                  )}

                  {/* PayPal */}
                  {selectedPayment === 'paypal' && (
                    <div className="text-center py-6">
                      <Wallet size={48} className="mx-auto text-blue-400 mb-3" />
                      <p className="text-gray-300">You will be redirected to PayPal</p>
                      <p className="text-sm text-gray-500 mt-1">to complete your payment</p>
                    </div>
                  )}

                  {/* Bank Transfer */}
                  {selectedPayment === 'bank' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bank Name</label>
                        <input
                          type="text"
                          placeholder="e.g., KCB, Equity, GTBank"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Account Number</label>
                        <input
                          type="text"
                          placeholder="Your bank account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400 flex items-start gap-2">
                        <Clock size={18} className="flex-shrink-0 mt-0.5" />
                        <p>Bank transfer may take 1-3 business days to reflect.</p>
                      </div>
                    </>
                  )}
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processingPayment}
                  className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-4 rounded-xl font-bold text-lg transition disabled:opacity-50"
                >
                  {processingPayment ? 'Processing...' : `Pay ${formatPrice(getPrice(selectedPlan))}`}
                </button>

                <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500">
                  <Shield size={14} />
                  <span>Secured by StreamAIV</span>
                  <span>·</span>
                  <span>256-bit encryption</span>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Success overlay */}
        {paymentSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-green-500 rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-400">
                You are now on the <span className="font-semibold text-green-400 capitalize">{selectedPlan.id}</span> plan.
              </p>
              <div className="mt-6 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse" style={{ width: '100%' }} />
              </div>
              <p className="text-sm text-gray-500 mt-3">Redirecting you home...</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 mt-12">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">S</span>
                  </div>
                  <span className="text-xl font-bold text-white">Stream<span className="text-purple-500">AIV</span></span>
                </div>
                <p className="text-gray-400 text-sm">
                  Watch AI-powered entertainment. Stream movies, series, and shorts. No ads. Cancel anytime.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="/browse" className="hover:text-white transition">Browse</a></li>
                  <li><a href="/" className="hover:text-white transition">Trending</a></li>
                  <li><a href="/creator" className="hover:text-white transition">Creator Studio</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Follow Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <Globe size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <Globe size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <Globe size={20} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    <Globe size={20} />
                  </a>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>© 2026 StreamAIV. All rights reserved.</p>
                  <p className="mt-1">Made with ❤️ for AI content creators</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}