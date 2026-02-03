import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlassCard } from "../components/GlassCard.tsx";
import { Check, Loader2, Info, RefreshCcw, Minus, Plus } from "lucide-react";
import { useApp } from "../context/AppContext.tsx";
import { ProductPackage } from "../types.ts";

export const TopupPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { placeOrder, user, addNotification, products } = useApp();

  // Find product from Context (which merges DB and Initial data)
  const product = products.find((p) => p.id === id) || products[0];

  const packages: ProductPackage[] = product.packages || [];
  const [selectedPkg, setSelectedPkg] = useState<ProductPackage>(
    packages[0] || { amount: "N/A", price: 0 },
  );
  const [playerId, setPlayerId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "instant">(
    "wallet",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = useMemo(
    () => selectedPkg.price * quantity,
    [selectedPkg, quantity],
  );

  const handleBuy = async () => {
    if (!user) {
      addNotification("Please login to purchase.", "error");
      navigate("/login");
      return;
    }

    if (!playerId && !product.hasQuantity) {
      addNotification("Please enter your account details.", "error");
      return;
    }

    if (paymentMethod === "instant") {
      navigate("/payment", {
        state: {
          amount: totalPrice,
          product: { ...selectedPkg, name: product.name, id, playerId },
        },
      });
      return;
    }

    setIsProcessing(true);
    const orderProduct = {
      id: id || "1",
      name: `${product.hasQuantity ? quantity + "x " : ""}${selectedPkg.amount} (${product.name})`,
      price: totalPrice,
      image: product.image,
      category: "Topup",
    };

    const res = await placeOrder(orderProduct, playerId || "VOUCHER-REDEEM");
    setIsProcessing(false);

    if (res.success) {
      navigate("/orders");
    }
  };

  return (
    <div className="pb-24 space-y-6 transition-colors duration-300">
      <GlassCard className="p-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700 p-1 bg-white dark:bg-slate-900">
          <img
            src={product.image}
            alt="Product"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight leading-tight">
            {product.name}
          </h1>
          <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            Game / Top up
          </p>
        </div>
      </GlassCard>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ff8c00] text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
            1
          </div>
          <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
            Select Package
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {packages.map((pkg, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPkg(pkg)}
              className={`p-4 bg-white dark:bg-slate-800 border-2 rounded-xl flex flex-col gap-1 cursor-pointer transition-all duration-300 ${
                selectedPkg.amount === pkg.amount
                  ? "border-[#ff8c00] scale-[1.02] shadow-lg shadow-orange-500/10"
                  : "border-gray-50 dark:border-slate-800 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPkg.amount === pkg.amount
                      ? "border-[#ff8c00]"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                >
                  {selectedPkg.amount === pkg.amount && (
                    <div className="w-2 h-2 rounded-full bg-[#ff8c00] animate-in zoom-in" />
                  )}
                </div>
                <span className="text-xs font-black text-[#ff8c00] whitespace-nowrap">
                  {pkg.price}৳
                </span>
              </div>
              <span
                className={`text-[11px] font-bold transition-colors ${
                  selectedPkg.amount === pkg.amount
                    ? "text-[#ff8c00]"
                    : "text-gray-600 dark:text-slate-400"
                } leading-tight mt-1`}
              >
                {pkg.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {product.hasQuantity && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-xl shadow-sm">
            <span className="font-bold text-gray-800 dark:text-white">
              Quantity
            </span>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-400 dark:text-slate-500 hover:text-[#ff8c00] transition-colors"
              >
                <Minus size={18} />
              </button>
              <span className="text-xl font-black text-gray-800 dark:text-white min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 bg-gray-50 dark:bg-slate-900 rounded-full text-gray-400 dark:text-slate-500 hover:text-[#ff8c00] transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {product.inputLabel && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#ff8c00] text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
              2
            </div>
            <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
              Account Info
            </h3>
          </div>
          <div className="space-y-3">
            <label className="text-[11px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest block ml-1">
              {product.inputLabel}
            </label>
            <input
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder={product.inputPlaceholder}
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-[#ff8c00] transition-all text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-700 font-bold"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#ff8c00] text-white flex items-center justify-center font-black shadow-lg shadow-orange-500/20">
            3
          </div>
          <h3 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">
            Select Payment
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setPaymentMethod("wallet")}
            className={`p-5 bg-white dark:bg-slate-800 border-2 rounded-2xl flex flex-col items-center gap-4 relative cursor-pointer transition-all duration-300 overflow-hidden ${
              paymentMethod === "wallet"
                ? "border-[#ff8c00] scale-[1.02] shadow-xl shadow-orange-500/20"
                : "border-gray-100 dark:border-slate-800 opacity-50"
            }`}
          >
            {paymentMethod === "wallet" && (
              <div className="absolute top-2 right-2 bg-[#ff8c00] text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                <Check size={12} strokeWidth={4} />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl transition-colors ${paymentMethod === "wallet" ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-slate-900"}`}
            >
              <img
                src="https://www.svgrepo.com/show/513063/wallet.svg"
                className="w-8 h-8"
                alt="Wallet"
              />
            </div>
            <p
              className={`text-[10px] font-black uppercase tracking-widest w-full text-center py-2 transition-colors ${
                paymentMethod === "wallet"
                  ? "text-[#ff8c00]"
                  : "text-gray-400 dark:text-slate-500"
              }`}
            >
              Wallet Pay
            </p>
          </div>

          <div
            onClick={() => setPaymentMethod("instant")}
            className={`p-5 bg-white dark:bg-slate-800 border-2 rounded-2xl flex flex-col items-center gap-4 relative cursor-pointer transition-all duration-300 overflow-hidden ${
              paymentMethod === "instant"
                ? "border-[#ff8c00] scale-[1.02] shadow-xl shadow-orange-500/20"
                : "border-gray-100 dark:border-slate-800 opacity-50"
            }`}
          >
            {paymentMethod === "instant" && (
              <div className="absolute top-2 right-2 bg-[#ff8c00] text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                <Check size={12} strokeWidth={4} />
              </div>
            )}
            <div
              className={`p-3 rounded-2xl transition-colors ${paymentMethod === "instant" ? "bg-orange-50 dark:bg-orange-900/20" : "bg-gray-50 dark:bg-slate-900"}`}
            >
              <div className="flex gap-2 h-8 items-center">
                <img
                  src="https://www.svgrepo.com/show/353488/bkash.svg"
                  className="w-6 h-6 object-contain"
                />
                <img
                  src="https://www.svgrepo.com/show/331505/nagad.svg"
                  className="w-6 h-6 object-contain"
                />
              </div>
            </div>
            <p
              className={`text-[10px] font-black uppercase tracking-widest w-full text-center py-2 transition-colors ${
                paymentMethod === "instant"
                  ? "text-[#ff8c00]"
                  : "text-gray-400 dark:text-slate-500"
              }`}
            >
              Instant Pay
            </p>
          </div>
        </div>

        <button
          onClick={handleBuy}
          disabled={isProcessing}
          className="w-full py-5 bg-[#ff8c00] text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            `BUY FOR ${totalPrice}৳`
          )}
        </button>
      </div>

      {product.rules && product.rules.length > 0 && (
        <div className="p-4 bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <Info size={16} />
            <span className="text-xs font-black uppercase">Instruction</span>
          </div>
          <ul className="space-y-1">
            {product.rules.map((r, i) => (
              <li
                key={i}
                className="text-[11px] text-sky-800 dark:text-sky-200 font-medium list-disc ml-4"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
