import { FaExclamationTriangle, FaTimesCircle, FaCheckCircle } from "react-icons/fa";

export default function Sidebar({ projects, onAddProject, onSelectProject }) {
    const getDeadlineWarning = (date) => {
        if (!date) return null; // Ensure date exists

        const today = new Date();
        const projectDate = new Date(date);
        const timeDiff = projectDate - today;
        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert to days

        if (daysLeft < 0) {
            return <FaTimesCircle className="text-red-500 ml-2" />;
        } else if (daysLeft <= 2) {
            return <FaExclamationTriangle className="text-red-500 ml-2" />;
        } else if (daysLeft <= 7) {
            return <FaExclamationTriangle className="text-yellow-500 ml-2" />;
        }
        return null; // No warning if there's enough time
    };

    // Separate projects into overdue, ongoing, and finished
    const overdueProjects = projects.filter(project => {
        const daysLeft = Math.ceil((new Date(project.date) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft < 0 && !project.finished;
    });

    const ongoingProjects = projects.filter(project => {
        const daysLeft = Math.ceil((new Date(project.date) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 && !project.finished;
    });

    const finishedProjects = projects.filter(project => project.finished);

    return (
        <div className="w-80 h-screen bg-stone-950 fixed top-20 rounded-tr-2xl rounded-br-2xl left-0 p-5">
            <p className="text-stone-200 text-3xl font-bold">Your Projects</p>
            <button
                className="text-stone-400 bg-stone-700 text-xl mt-5 p-3 rounded-xl w-full"
                onClick={onAddProject}
            >
                + Add Project
            </button>

            {/* Overdue Projects */}
            {overdueProjects.length > 0 && (
                <>
                    <h2 className="text-red-400 text-xl mt-5">Overdue Projects</h2>
                    <ul className="mt-2 text-stone-300">
                        {overdueProjects.map((project) => (
                            <li
                                key={project.id}
                                className="cursor-pointer p-2 hover:bg-red-700 rounded flex justify-between items-center"
                                onClick={() => onSelectProject(project)}
                            >
                                <span>{project.name}</span>
                                <FaTimesCircle className="text-red-500 ml-2" />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Ongoing Projects */}
            <h2 className="text-stone-200 text-xl mt-5">Ongoing Projects</h2>
            <ul className="mt-2 text-stone-300">
                {ongoingProjects.map((project) => (
                    <li
                        key={project.id}
                        className="cursor-pointer p-2 hover:bg-stone-700 rounded flex justify-between items-center"
                        onClick={() => onSelectProject(project)}
                    >
                        <span>{project.name}</span>
                        {getDeadlineWarning(project.date)}
                    </li>
                ))}
            </ul>

            {/* Finished Projects */}
            <h2 className="text-stone-200 text-xl mt-5">Finished Projects</h2>
            <ul className="mt-2 text-stone-300">
                {finishedProjects.map((project) => (
                    <li
                        key={project.id}
                        className="cursor-pointer p-2 hover:bg-stone-700 rounded flex justify-between items-center"
                        onClick={() => onSelectProject(project)}
                    >
                        <span>{project.name}</span>
                        <FaCheckCircle className="text-green-500 ml-2" />
                    </li>
                ))}
            </ul>
        </div>
    );
}
