
import { motion } from "framer-motion";
import { useState } from "react";

const DieterRamsSwitch = () => {
    const [isOn, setIsOn] = useState(true);

    return (
        <div
            className="group cursor-pointer select-none flex flex-col items-center"
            onClick={() => setIsOn(!isOn)}
        >
            {/* The Main Tactile Case inspired by Braun design */}
            <div className={`
                w-40 h-40 rounded-[48px] flex items-center justify-center transition-all duration-700
                ${isOn ? "bg-[#f97316]" : "bg-[#F2F2F2]"}
                relative
                shadow-[0_20px_40px_rgba(0,0,0,0.1),inset_0_-2px_10px_rgba(0,0,0,0.05)]
                ${!isOn && "shadow-[0_20px_40px_rgba(0,0,0,0.1),inset_0_2px_10px_rgba(255,255,255,0.8),inset_0_-2px_10px_rgba(0,0,0,0.05)]"}
                border-b-[10px] ${isOn ? "border-[#ea580c]" : "border-[#E0E0E0]"}
            `}>
                {/* The Recessed Area */}
                <div className="w-28 h-14 bg-[#EBEBEB] rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.1)] p-1.5 relative overflow-hidden flex items-center">

                    {/* The Sliding Button */}
                    <motion.div
                        animate={{
                            x: isOn ? 56 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="w-11 h-11 rounded-full bg-[#FAFAFA] shadow-[0_4px_8px_rgba(0,0,0,0.15),0_1px_2px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center relative z-20 border border-gray-200"
                    >
                        {/* Power Indicator Dot - using orange-500 */}
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${isOn ? "bg-[#f97316]" : "bg-gray-400"}`} />
                    </motion.div>

                    {/* Internal Labels with orange-600 for contrast */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
                        <span className={`text-[10px] font-black tracking-widest transition-opacity duration-300 ${isOn ? "opacity-20 text-gray-500" : "opacity-100 text-gray-600"}`}>OFF</span>
                        <span className={`text-[10px] font-black tracking-widest transition-opacity duration-300 ${isOn ? "opacity-100 text-[#ea580c]" : "opacity-20 text-gray-400"}`}>ON</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DieterRamsSwitch;
