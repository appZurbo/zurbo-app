
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

const TactileVault = () => {
    const controls = useAnimation();
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const newRotation = Math.floor(Math.random() * 360);
            setRotation(newRotation);
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 400 400"
                animate={{ rotate: rotation }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full h-full"
            >
                <g>
                    <title>Layer 1</title>
                    {/* Background Circle - White as requested */}
                    <ellipse stroke="#000" ry="200" rx="200" id="svg_1" cy="200" cx="200" strokeWidth="0" fill="#FFFFFF" />

                    {/* Dotted border */}
                    <ellipse stroke="#b7b7b7" strokeDasharray="2,2" ry="182" rx="182" id="svg_12" cy="200" cx="200" strokeWidth="25" fill="none" />

                    {/* Number 0 - Orange as requested */}
                    <text fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_2" y="56" x="186.5" strokeWidth="0" stroke="#000" fill="#f97316">0</text>

                    {/* Other Numbers - Original #666666 */}
                    <text transform="rotate(36 298.1953125,68.00000000000001) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_3" y="88" x="266.5" strokeWidth="0" stroke="#000" fill="#666666">10</text>
                    <text transform="rotate(72 357.19531250000006,150.99999999999997) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_4" y="171" x="325.5" strokeWidth="0" stroke="#000" fill="#666666">20</text>
                    <text transform="rotate(108 356.19531249999994,254.99999999999997) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_5" y="275" x="324.5" strokeWidth="0" stroke="#000" fill="#666666">30</text>
                    <text transform="rotate(144 298.1953125,331.99999999999994) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_6" y="352" x="266.5" strokeWidth="0" stroke="#000" fill="#666666">40</text>
                    <text transform="rotate(180 200.1953125,364) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_7" y="384" x="168.5" strokeWidth="0" stroke="#000" fill="#666666">50</text>
                    <text transform="rotate(-144 101.19531249999997,331.99999999999994) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_8" y="352" x="69.5" strokeWidth="0" stroke="#000" fill="#666666">60</text>
                    <text transform="rotate(-108 44.19531250000001,254.00000000000003) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_9" y="274" x="12.5" strokeWidth="0" stroke="#000" fill="#666666">70</text>
                    <text transform="rotate(-72 44.195312499999986,145) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_10" y="165" x="12.5" fillOpacity="null" strokeOpacity="null" strokeWidth="0" stroke="#000" fill="#666666">80</text>
                    <text transform="rotate(-36 103.19531250000001,66.00000000000003) " fontWeight="bold" xmlSpace="preserve" textAnchor="start" fontFamily="Helvetica, Arial, sans-serif" fontSize="57" id="svg_11" y="86" x="71.5" strokeWidth="0" stroke="#000" fill="#666666">90</text>

                    {/* Inner Circle Border */}
                    <ellipse stroke="#878787" ry="134" rx="134" id="svg_13" cy="200" cx="200" strokeWidth="4" fill="none" />

                    {/* External radial markers (ticks) */}
                    {[...Array(100)].map((_, i) => (
                        <line
                            key={i}
                            x1="200" y1="18"
                            x2="200" y2={i % 5 === 0 ? "35" : "28"}
                            transform={`rotate(${i * 3.6} 200 200)`}
                            stroke={i % 10 === 0 ? "#888" : "#ccc"}
                            strokeWidth={i % 5 === 0 ? "2" : "1"}
                        />
                    ))}
                </g>
            </motion.svg>
        </div>
    );
};

export default TactileVault;
