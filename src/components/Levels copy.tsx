import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { useState } from "react";
import { FaBook, FaDumbbell, FaLock, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router";

const icons = {
    book: <FaBook className="text-white text-2xl" />,
    star: <FaStar className="text-white text-2xl" />,
    exercise: <FaDumbbell className="text-white text-2xl" />,
    lock: <FaLock className="text-white text-2xl" />,
    chest: <FaDumbbell
        className="text-white text-2xl" />,
};

const levelsData = [
    { type: "start", status: "active" },
    { type: "book", status: "locked" },
    { type: "star", status: "locked" },
    { type: "book", status: "locked" },
    { type: "exercise", status: "locked" },
    { type: "book", status: "locked" },
    { type: "chest", status: "locked" },
    { type: "star", status: "locked" },
    { type: "star", status: "locked" },
];

const getIcon = (type) => {
    if (type === "start") return <FaStar className="text-white text-2xl" />;
    return icons[type] || <FaLock className="text-white text-2xl" />;
};

const stylesByIndex = [
    { left: 0, marginTop: 67 },
    { left: 44.884, marginTop: 11.8533 },
    { left: 70, marginTop: 20.3826 },
    { left: 44.884, marginTop: 20.3826 },
    { left: 0, marginTop: 11.8533 },
    { left: -44.884, marginTop: 11.8533 },
    { left: -70, marginTop: 20.3826 },
    { left: -44.884, marginTop: 20.3826 },
    { left: 0, marginTop: 11.8533 },
];

const LevelItem = ({ level, index }) => {
    const isActive = level.status === "active";
    const [show, setShow] = useState<boolean>(false)
    const style = stylesByIndex[index % stylesByIndex.length];
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, x: style.left }}
            animate={{ opacity: 1, y: 0, x: style.left }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center space-y-2"
            style={{ left: `${style.left}px`, marginTop: `${style.marginTop}px` }}
        >
            <button
                onClick={() => setShow(!show)}
                className={`relative w-16 h-16 group rounded-full flex items-center justify-center shadow-lg border-4 ${isActive ? "bg-blue-500 border-white" : "bg-gray-700 border-gray-500"
                    }`}
            >
                {getIcon(level.type)}
                {
                    index === 0 && (
                        <div className="absolute bottom-full animate-[bounce_2s_ease-in-out_infinite] duration-300 ease-in-out " style={{ zIndex: 50 }}>
                            <div className="relative bg-[#37464f] text-white px-4 py-2 rounded-lg shadow-lg text-sm z-30">
                                <div className="text-white"> Start </div>
                                {/* // Make a triangle */}
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#37464f] rotate-45 -z-[20px]"></div>
                            </div>
                        </div>

                    )
                }
                {
                    show && (
                        <>

                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-600 rotate-45 z-[50]"></div>
                            <div className="absolute bottom-[107%] bg-blue-600 text-white px-4 py-4 rounded-lg shadow-lg w-64 "
                                style={{ zIndex: 50 }}>
                                <Tooltip level={level} />
                            </div>
                        </>
                    )
                }
            </button>
        </motion.div>
    );
};

const Tooltip = ({ level }) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ zIndex: 50 }}
        >

            <div className="text-white text-lg font-bold flex items-center gap-2">
                {level.title}
            </div>
            <div className="text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {level.duration_minutes} minutes
            </div>
            <div>
                <button className="mt-2 bg-white text-blue-500 font-bold px-3 py-3 w-full rounded cursor-pointer" onClick={() => {
                    navigate(`/admin/courses/${level.course_id}/lessons/${level.id}/instructions`);
                }}>
                    Play Game
                </button>
                {/* <button className="mt-2 bg-white text-blue-500 font-bold px-3 py-3 w-full rounded cursor-pointer">
                MCQ
            </button> */}
            </div>
        </motion.div>
    );
}

export default function Levels({ lessons, course }) {
    return (
        <div className="bg-[#131f24] min-h-screen flex flex-col items-center py-10">
            <div className="fixed inset-0">
                <img src="/images/kids.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="fixed inset-0 bg-black/80">

            </div>
            <div className="relative max-w-3xl w-full">
                <div className="bg-blue-500 px-4 py-3 rounded-xl text-white text-lg font-semibold mb-8 max-w-3xl w-full">
                    <p className="text-white text-lg capitalize"> {course.title} </p>
                </div>
                {/* Images  */}
                <div className="absolute top-[250px] left-12">
                    <img src="/images/boy.png" alt="robot" className="w-48" />
                </div>
                <div className="absolute bottom-[40px] right-8">
                    <img src="/images/leaning.png" alt="robot" className="w-64" />
                </div>
                <div className="flex flex-col items-center">
                    {/* {levelsData.map((level, index) => (
                        <>
                            <LevelItem key={index} level={level} index={index} />

                        </>
                    ))} */}
                    {lessons?.map((level, index) => (
                        <>
                            <LevelItem key={index} level={level} index={index} />
                        </>
                    ))}
                </div>
            </div>
        </div>
    );
}
