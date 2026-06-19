import React, { useMemo } from "react";
import { Control, Controller } from "react-hook-form";

interface SuperChatSliderProps {
    control: Control<any>;
    amount: number;
    PREDEFINED_AMOUNTS: number[];
    onAmountChange: (newAmount: number) => void;
}

export default function SuperChatSlider({ control, amount, PREDEFINED_AMOUNTS, onAmountChange }: SuperChatSliderProps) {
    const currentSliderIndex = useMemo(() => {
        if (PREDEFINED_AMOUNTS.indexOf(amount) !== -1) return PREDEFINED_AMOUNTS.indexOf(amount);
        const idx = PREDEFINED_AMOUNTS.findIndex(a => a >= amount);
        return idx !== -1 ? idx : PREDEFINED_AMOUNTS.length - 1;
    }, [amount, PREDEFINED_AMOUNTS]);

    return (
        <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="text-xl flex items-center justify-center gap-2 dark:text-n-7">
                <span className="">Rs</span>
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="number"
                            className="bg-transparent border-b border-n-8 focus:border-white focus:border-b-2 outline-none text-center dark:text-n-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            style={{ width: `${Math.max(2, (field.value || "").toString().length)}ch` }}
                            value={field.value || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                const newAmount = val === '' ? 0 : Number(val);
                                if (newAmount >= 0) {
                                    onAmountChange(newAmount);
                                }
                            }}
                        />
                    )}
                />
                <span className="">PKR</span>
            </div>

            <div className="w-full relative h-6 flex items-center">
                {/* Track background */}
                <div className="absolute inset-x-0 h-[2px] bg-n-6 rounded-lg pointer-events-none">
                    <div
                        className="h-full bg-purple-1 rounded-lg"
                        style={{ width: `${(Math.max(0, currentSliderIndex) / (PREDEFINED_AMOUNTS.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Dots */}
                <div className="absolute inset-x-0 flex justify-between pointer-events-none px-1.5">
                    {PREDEFINED_AMOUNTS.map((_, i) => {
                        const isActive = i <= currentSliderIndex;
                        return (
                            <div
                                key={i}
                                className={`w-0.5 h-0.5 rounded-full ${isActive ? 'bg-n-8' : 'bg-n-8'}`}
                            />
                        );
                    })}
                </div>

                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                        <input
                            type="range"
                            min="0"
                            max={PREDEFINED_AMOUNTS.length - 1}
                            step="1"
                            value={currentSliderIndex}
                            onChange={(e) => {
                                const newAmount = PREDEFINED_AMOUNTS[Number(e.target.value)];
                                onAmountChange(newAmount);
                            }}
                            className="w-full h-[2px] appearance-none cursor-pointer accent-purple-1 absolute inset-0 m-auto bg-transparent focus:outline-none z-10"
                        />
                    )}
                />
            </div>
        </div>
    );
}
