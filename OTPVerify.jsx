import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { 
  Shield, Mail, CheckCircle2, XCircle, 
  RefreshCw, ArrowLeft, Lock 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function OTPVerifyPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [otpData, setOtpData] = useState(null);

  useEffect(() => {
    // Load OTP data from localStorage
    const data = localStorage.getItem('otp_data');
    if (!data) {
      navigate(createPageUrl("Login"));
      return;
    }
    setOtpData(JSON.parse(data));

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error("OTP expired. Please request a new one.");
          navigate(createPageUrl("Login"));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);

    try {
      if (enteredOtp !== otpData.otp) {
        toast.error("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        document.getElementById("otp-0")?.focus();
        setIsVerifying(false);
        return;
      }

      // Check if OTP expired
      if (new Date() > new Date(otpData.otpExpiry)) {
        toast.error("OTP expired. Please request a new one.");
        navigate(createPageUrl("Login"));
        return;
      }

      // OTP is valid - trigger Base44 authentication
      await base44.auth.redirectToLogin(
        otpData.userType === 'institution' 
          ? createPageUrl("Dashboard") 
          : createPageUrl("UserDashboard")
      );

      // Note: After Base44 authentication, we'll update user with verified status
      localStorage.setItem('pending_verification', JSON.stringify({
        userType: otpData.userType,
        verified: true
      }));

      localStorage.removeItem('otp_data');
      
    } catch (error) {
      toast.error("Verification failed. Please try again.");
      console.error(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const newExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

      await base44.integrations.Core.SendEmail({
        to: otpData.email,
        subject: "Your New EduVerify Login OTP",
        body: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #00C2A8 0%, #00A896 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0;">🔐 New OTP Code</h1>
            </div>
            <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 12px 12px;">
              <div style="background: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; border: 2px solid #00C2A8;">
                <p style="font-size: 42px; font-weight: bold; color: #00C2A8; letter-spacing: 8px; margin: 0;">${newOtp}</p>
              </div>
              <p style="color: #64748B;">This new OTP expires in 10 minutes.</p>
            </div>
          </div>
        `
      });

      const updatedData = { ...otpData, otp: newOtp, otpExpiry: newExpiry };
      setOtpData(updatedData);
      localStorage.setItem('otp_data', JSON.stringify(updatedData));
      setTimeLeft(600);
      setOtp(["", "", "", "", "", ""]);
      toast.success("New OTP sent to your email!");
    } catch (error) {
      toast.error("Failed to resend OTP");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!otpData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-slate-50 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 bg-gradient-to-br ${
              otpData.userType === 'institution'
                ? 'from-teal-500 to-cyan-600'
                : 'from-purple-500 to-pink-600'
            } rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl relative`}>
              <Mail className="w-10 h-10 text-white" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-600 mb-4">
              We've sent a 6-digit code to<br />
              <span className="font-semibold text-slate-900">{otpData.email}</span>
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">
                Expires in {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold border-2 focus:border-teal-500"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              onClick={handleVerify}
              disabled={isVerifying || otp.join("").length !== 6}
              className={`w-full h-12 bg-gradient-to-r ${
                otpData.userType === 'institution'
                  ? 'from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700'
                  : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              } text-lg font-semibold shadow-lg`}
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Verify & Login
                </>
              )}
            </Button>
          </div>

          {/* Resend OTP */}
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-slate-600 mb-3">Didn't receive the code?</p>
              <Button
                onClick={handleResendOTP}
                variant="outline"
                className="border-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend OTP
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                localStorage.removeItem('otp_data');
                navigate(createPageUrl("Login"));
              }}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">Security Tips</p>
                <p className="text-xs text-amber-800">
                  Never share your OTP with anyone. EduVerify will never ask for your OTP via phone or other channels.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}