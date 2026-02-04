
import { motion } from "framer-motion";

const TactileLock = () => {
    // Orange-500 palette
    const copper = "#f97316";
    const lightCopper = "#fb923c";
    const darkCopper = "#ea580c";
    const darkestCopper = "#c2410c";
    const grey = "#808080";

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* The main container matching the div in CSS */}
            <div
                className="relative w-[110px] h-[90px] rounded-[15px]"
                style={{
                    backgroundColor: copper,
                    backgroundImage: `
                        radial-gradient(circle at 50% 65px, ${darkCopper} 5px, transparent 5px),
                        linear-gradient(to bottom, ${copper} 0px, ${copper} 45%, transparent 45%, transparent 65px, ${copper} 65px),
                        linear-gradient(to right, transparent 0px, transparent 50px, ${darkCopper} 50px, ${darkCopper} 60px, transparent 60px)
                    `,
                    boxShadow: `inset 0px 5px ${lightCopper}, 0px 5px ${darkCopper}`
                }}
            >
                {/* Shackle (Based on :before) */}
                <div
                    className="absolute -top-[65px] left-1/2 -translate-x-1/2 w-[68px] h-[100px] rounded-[54px] border-[15px] border-[#808080]"
                    style={{
                        zIndex: -1
                    }}
                />

                {/* Keyhole (Based on :after) */}
                <div
                    className="absolute top-1/2 left-1/2 w-[25px] h-[25px] rounded-full"
                    style={{
                        backgroundColor: darkCopper,
                        transform: "translate(-50%, -100%)",
                        boxShadow: `0px 3px ${darkestCopper} inset`
                    }}
                />
            </div>
        </div>
    );
};

export default TactileLock;
