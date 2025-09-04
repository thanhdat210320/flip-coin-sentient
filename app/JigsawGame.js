"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, RotateCcw, Info, History, Wallet, ArrowUpDown } from "lucide-react";
import smile from "./images/smile.png";
import cry from "./images/cry.png";

// --- Utility: fair coin using crypto ---
function fairFlip() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    window.crypto.getRandomValues(arr);
    return (arr[0] & 1) === 1; // true = heads, false = tails
  }
  return Math.random() < 0.5;
}

function fmt(n) {
  return Number(n.toFixed(2)).toString();
}

const betOptions = [0.1, 0.5, 1];

export default function CoinFlipGame() {
  const [balance, setBalance] = useState(10);
  const [history, setHistory] = useState([]);
  const [selectedBet, setSelectedBet] = useState(betOptions[0]);
  const [choice, setChoice] = useState("heads");
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  // Load từ localStorage (chỉ khi client)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBalance = localStorage.getItem("cf-balance");
      const savedHistory = localStorage.getItem("cf-history");
      if (savedBalance) setBalance(parseFloat(savedBalance));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Lưu balance
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cf-balance", String(balance));
    }
  }, [balance]);

  // Lưu history
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cf-history", JSON.stringify(history.slice(0, 50)));
    }
  }, [history]);

  const canPlay = useMemo(
    () => !flipping && selectedBet > 0 && balance >= selectedBet,
    [flipping, selectedBet, balance]
  );

  function play() {
    if (!canPlay) {
      setMessage(balance < selectedBet ? "Insufficient balance." : "Flipping... please wait for completion.");
      return;
    }
    setFlipping(true);
    setMessage("");
    setResult(null);

    setBalance(b => Number((b - selectedBet).toFixed(2)));

    setTimeout(() => {
      const outcome = fairFlip() ? "heads" : "tails";
      setResult(outcome);

      const didWin = outcome === choice;
      setBalance(b => {
        const nb = didWin ? Number((b + selectedBet * 2).toFixed(2)) : b;
        return nb;
      });
      setHistory(h => [
        { ts: Date.now(), choice, bet: selectedBet, outcome, win: didWin },
        ...h,
      ].slice(0, 50));
      setMessage(didWin ? `You Win +${fmt(selectedBet)}!` : `You Lose -${fmt(selectedBet)}.`);
      setFlipping(false);
    }, 1600);
  }

  function resetAll() {
    setBalance(10);
    setHistory([]);
    setMessage("");
    setResult(null);
  }

  const rotation = flipping ? 720 : result ? (result === "heads" ? 0 : 180) : 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white flex items-center justify-center p-4 font-['Times_New_Roman']">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-2xl bg-slate-800 shadow">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-5xl font-semibold leading-tight">Coin Flip – Sentient</h1>
            <p className="text-slate-300 text-sm">
              Choose bet 0.1 / 0.5 / 1 point · Select face · Flip to win x2
            </p>
          </div>
        </div>

        {/* Top Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-2xl bg-slate-800 p-4 shadow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5"/>
              <span className="text-slate-300 text-sm">Balance</span>
            </div>
            <div className="text-xl font-bold">{fmt(balance)} pt</div>
          </div>
          <div className="rounded-2xl bg-slate-800 p-4 shadow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5"/>
              <span className="text-slate-300 text-sm">Bet</span>
            </div>
            <div className="flex gap-2">
              {betOptions.map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBet(b)}
                  className={`px-3 py-1.5 rounded-xl text-sm border transition ${selectedBet === b ? "bg-white text-slate-900 border-transparent" : "border-slate-600 hover:border-slate-400"}`}
                >{fmt(b)}</button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-slate-800 p-4 shadow flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5"/>
              <span className="text-slate-300 text-sm">Recent Games</span>
            </div>
            <div className="text-xl font-bold">{history.length}</div>
          </div>
        </div>

        {/* Game Card */}
        <div className="rounded-3xl bg-slate-800/80 shadow-xl p-6 md:p-8 border border-slate-700">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Coin */}
            <div className="flex flex-col items-center">
              <motion.div
                animate={{ rotateY: rotation }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
                className="w-48 h-48 md:w-56 md:h-56 [transform-style:preserve-3d] relative"
              >
                {/* HEADS */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-300 to-amber-500 shadow-2xl border border-amber-700 flex items-center justify-center text-slate-900 font-extrabold text-3xl backface-hidden">
                  <img src={smile.src} className="w-full h-full rounded-full" alt="smile"/>
                </div>
                {/* TAILS */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-500 shadow-2xl border border-zinc-700 flex items-center justify-center text-slate-900 font-extrabold text-3xl [transform:rotateY(180deg)] backface-hidden">
                  <img src={cry.src} className="w-full h-full rounded-full" alt="cry"/>
                </div>
              </motion.div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setChoice("heads")}
                  className={`px-4 py-2 rounded-2xl text-sm border transition ${choice === "heads" ? "bg-white text-slate-900 border-transparent" : "border-slate-600 hover:border-slate-400"}`}
                  disabled={flipping}
                >Choose Face ( SMILE )</button>
                <button
                  onClick={() => setChoice("tails")}
                  className={`px-4 py-2 rounded-2xl text-sm border transition ${choice === "tails" ? "bg-white text-slate-900 border-transparent" : "border-slate-600 hover:border-slate-400"}`}
                  disabled={flipping}
                >Choose Face ( CRY )</button>
              </div>

              <button
                onClick={play}
                disabled={!canPlay}
                className={`mt-6 px-6 py-3 rounded-2xl font-semibold shadow-lg transition border ${canPlay ? "bg-indigo-500 hover:bg-indigo-400 border-transparent" : "bg-slate-700 border-slate-600 cursor-not-allowed"}`}
              >{flipping ? "Flipping..." : "Flip the Coin"}</button>

              <div className="mt-4 h-6 text-sm text-center text-slate-300">{message}</div>

              <AnimatePresence>
                {result && !flipping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium ${result === choice ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"}`}
                  >Result: {result === "heads" ? "Heads (H)" : "Tails (T)"}</motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4">
                <button onClick={resetAll} className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white">
                  <RotateCcw className="w-4 h-4"/> Reset 
                </button>
              </div>
            </div>

            {/* History */}
            <div className="bg-slate-900/40 border border-slate-700 rounded-2xl p-4 max-h-80 overflow-auto">
              <div className="flex items-center gap-2 mb-2 text-slate-300">
                <History className="w-4 h-4"/>History (up to 50 games)
              </div>
              {history.length === 0 ? (
                <div className="text-slate-400 text-sm">No games yet. Try your luck!</div>
              ) : (
                <ul className="space-y-2">
                  {history.map((h, idx) => (
                    <li key={idx} className="grid grid-cols-5 gap-2 items-center text-sm bg-slate-800/60 rounded-xl p-2">
                      <div className="col-span-2 text-slate-200">{new Date(h.ts).toLocaleTimeString()}</div>
                      <div className="text-slate-300">Bet {fmt(h.bet)}</div>
                      <div className={`${h.win ? "text-emerald-300" : "text-rose-300"}`}>{h.win ? "+" : "-"}{fmt(h.bet)}</div>
                      <div className="text-right text-slate-200">{h.outcome === "heads" ? "Smile" : "Cry"}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer / Fairness */}
          <div className="mt-6 flex items-start gap-2 text-slate-300 text-xs">
            <Info className="w-4 h-4 mt-0.5 "/>
            <p>
              Game of chance, show that you are a prediction genius.
            </p>
          </div>
        </div>
      </div>

      <style>{`.backface-hidden{ backface-visibility: hidden; }`}</style>
    </div>
  );
}
