import { motion } from "framer-motion";
import { ArrowLeft, Star, Crown, Zap, Heart, Lock } from "lucide-react";

interface PremiumFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  premium: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  color: string;
}

interface ChatLurePremiumProps {
  onBack: () => void;
  onUpgrade?: () => void;
}

export function ChatLurePremium({ onBack, onUpgrade }: ChatLurePremiumProps) {
  const features: PremiumFeature[] = [
    {
      icon: <Heart className="text-red-500" size={24} />,
      title: "Romance Stories",
      description: "Steamy conversations and love triangles",
      premium: false,
    },
    {
      icon: <Zap className="text-yellow-500" size={24} />,
      title: "Real-time Drama",
      description: "Live conversations that update every few minutes",
      premium: false,
    },
    {
      icon: <Crown className="text-purple-500" size={24} />,
      title: "Exclusive Scandals",
      description: "Premium storylines with major plot twists",
      premium: true,
    },
    {
      icon: <Lock className="text-blue-500" size={24} />,
      title: "Private Investigations",
      description: "Deep-dive into mysterious conversations",
      premium: true,
    },
    {
      icon: <Star className="text-orange-500" size={24} />,
      title: "Celebrity Drama",
      description: "Fictional but realistic celebrity conversations",
      premium: true,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Voyeur",
      price: "Free",
      period: "forever",
      color: "bg-gray-100",
      features: [
        "3 story threads",
        "Basic drama & romance",
        "Ads between conversations",
        "Limited cliffhangers",
      ],
    },
    {
      name: "Stalker",
      price: "$4.99",
      period: "month",
      color: "bg-ios-blue",
      popular: true,
      features: [
        "Unlimited story threads",
        "All premium storylines",
        "No ads",
        "Early access to new drama",
        "Typing speed control",
        "50% slower battery drain",
        "Instant battery charging",
      ],
    },
    {
      name: "Insider",
      price: "$39.99",
      period: "year",
      color: "bg-purple-600",
      features: [
        "Everything in Stalker",
        "Custom story requests",
        "Behind-the-scenes content",
        "VIP community access",
        "Beta feature testing",
        "150% battery capacity",
        "2.5x faster charging speed",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="w-full h-full bg-black text-white flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-16 bg-gradient-to-r from-purple-900 to-pink-900">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <img
            src="https://cdn.builder.io/api/v1/assets/9af82e6ddd6549809662cfc01aa22662/favico-c760c4?format=webp&width=800"
            alt="ChatLure Logo"
            className="w-6 h-6 rounded"
          />
          <h1 className="text-lg font-semibold">ChatLure Premium</h1>
        </div>
        <Crown size={20} className="text-yellow-400" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="p-6 bg-gradient-to-b from-purple-900/50 to-transparent text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="text-6xl mb-4"
          >
            👁️‍🗨️
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">
            Unlock the Ultimate Voyeur Experience
          </h2>
          <p className="text-gray-300 text-sm">
            Access exclusive storylines, unlimited drama, and premium features
          </p>
        </div>

        {/* Features Grid */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">What You Get</h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center p-3 rounded-xl ${
                  feature.premium
                    ? "bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30"
                    : "bg-gray-800/30"
                }`}
              >
                <div className="flex-shrink-0 mr-3">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{feature.title}</h4>
                    {feature.premium && (
                      <Crown size={14} className="text-yellow-400 ml-2" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
          <div className="space-y-4">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`relative p-4 rounded-xl border-2 ${
                  plan.popular
                    ? "border-ios-blue bg-ios-blue/10"
                    : "border-gray-700 bg-gray-800/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-ios-blue text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold">{plan.name}</h4>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      {plan.price !== "Free" && (
                        <span className="text-gray-400 text-sm ml-1">
                          /{plan.period}
                        </span>
                      )}
                    </div>
                  </div>
                  {plan.name === "Stalker" && (
                    <Star className="text-yellow-400" size={20} />
                  )}
                  {plan.name === "Insider" && (
                    <Crown className="text-purple-400" size={20} />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-ios-green rounded-full mr-3"></div>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (plan.price !== "Free" && onUpgrade) {
                      onUpgrade();
                    }
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.price === "Free"
                      ? "bg-gray-700 text-gray-300"
                      : plan.popular
                        ? "bg-ios-blue text-white"
                        : "bg-purple-600 text-white"
                  }`}
                >
                  {plan.price === "Free" ? "Current Plan" : "Upgrade Now"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800/30 rounded-xl p-4">
            <h3 className="font-semibold mb-3 text-center">
              What Voyeurs Are Saying
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">😍</div>
                <div>
                  <p className="text-sm text-gray-300">
                    "I'm completely addicted! The drama is so realistic, I
                    forget it's not real."
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Sarah M.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="text-2xl">🔥</div>
                <div>
                  <p className="text-sm text-gray-300">
                    "The premium storylines are worth every penny. So many plot
                    twists!"
                  </p>
                  <p className="text-xs text-gray-500 mt-1">- Alex R.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-4 bg-gradient-to-t from-purple-900/50 to-transparent">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpgrade && onUpgrade()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            Start 7-Day Free Trial
          </motion.button>
          <p className="text-center text-xs text-gray-400 mt-2">
            Cancel anytime. No commitments.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
