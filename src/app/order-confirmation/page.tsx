"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Package, CheckCircle2, Clock, Truck, Phone, Wallet } from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const orderId = searchParams.get("orderId");
  const wcOrderId = searchParams.get("wcOrderId");
  const isCOD = searchParams.get("cod") === "true";

  useEffect(() => {
    setMounted(true);
    
    // Redirect if no order ID
    if (!orderId && !wcOrderId) {
      setTimeout(() => router.push("/"), 3000);
    }
  }, [orderId, wcOrderId, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!orderId && !wcOrderId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-sm font-light mb-4">No order found. Redirecting...</p>
          <Link 
            href="/"
            className="text-xs text-black underline hover:no-underline font-light tracking-widest uppercase"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="max-w-2xl mx-auto py-12 px-4">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-3 tracking-wide">
            Order Confirmed
          </h1>
          <p className="text-gray-600 text-sm font-light">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-200">
            <div>
              <p className="text-xs font-light text-gray-600 uppercase tracking-widest mb-2">
                Order Number
              </p>
              <p className="text-lg font-light text-gray-900">
                #{wcOrderId || orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-light text-gray-600 uppercase tracking-widest mb-2">
                Payment Method
              </p>
              <p className="text-sm font-light text-gray-900">
                {isCOD ? "Cash on Delivery" : "Online Payment"}
              </p>
            </div>
          </div>

          {/* Payment ID for online payments */}
          {!isCOD && orderId && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-xs font-light text-gray-600 uppercase tracking-widest mb-2">
                Payment ID
              </p>
              <p className="text-sm font-light text-gray-900 break-all">
                {orderId}
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-6">
            {/* Payment Status - Different for COD */}
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isCOD ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                {isCOD ? (
                  <Wallet className="w-5 h-5 text-blue-600" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-1">
                  {isCOD ? "Pay on Delivery" : "Payment Confirmed"}
                </h3>
                <p className="text-xs font-light text-gray-600">
                  {isCOD 
                    ? "Pay with cash or UPI when your order is delivered" 
                    : "Your payment has been successfully processed"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-1">
                  Processing Order
                </h3>
                <p className="text-xs font-light text-gray-600">
                  We are preparing your items for shipment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 pt-1">
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-1">
                  Delivery
                </h3>
                <p className="text-xs font-light text-gray-600">
                  Expected delivery within 4-5 business days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* COD Payment Notice */}
        {isCOD && (
          <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">
                  Payment on Delivery
                </h3>
                <p className="text-xs font-light text-gray-600 mb-2">
                  You can pay when your order arrives at your doorstep
                </p>
                <ul className="text-xs font-light text-gray-600 space-y-1">
                  <li>• Cash payment accepted</li>
                  <li>• UPI payment accepted</li>
                  <li>• Please keep exact change ready</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">
                Estimated Delivery
              </h3>
              <p className="text-sm font-light text-gray-600 mb-3">
                Your order will be delivered within <strong className="text-gray-900">4-5 business days</strong>
              </p>
              <p className="text-xs font-light text-gray-600">
                You will receive tracking details via WhatsApp and email once your order is shipped
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-light text-gray-900 uppercase tracking-widest mb-2">
                Need Help?
              </h3>
              <p className="text-xs font-light text-gray-600 mb-3">
                Our team is here to assist you with any questions
              </p>
              <a
                href={`https://api.whatsapp.com/send?phone=918799795681&text=Hi%2C%20I%20need%20help%20with%20order%20%23${wcOrderId || orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-light text-black hover:text-gray-600 transition-colors uppercase tracking-widest"
              >
                Contact on WhatsApp →
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 text-center px-8 py-4 text-xs text-white bg-black hover:bg-gray-800 transition-colors tracking-widest uppercase font-light"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 text-center px-8 py-4 text-xs text-black bg-white border border-gray-300 hover:bg-gray-50 transition-colors tracking-widest uppercase font-light"
          >
            Print Receipt
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-xs font-light text-gray-600 mb-2">
            A confirmation email has been sent to your registered email address
          </p>
          <p className="text-xs font-light text-gray-500">
            Order ID: {wcOrderId || orderId}
          </p>
          {isCOD && (
            <p className="text-xs font-light text-gray-500 mt-1">
              Payment Method: Cash on Delivery
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmation() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
