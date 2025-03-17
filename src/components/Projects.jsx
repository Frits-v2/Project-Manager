import React, { useEffect, useState } from 'react';
import {FaExclamationTriangle, FaRegCalendarAlt, FaTrashAlt} from 'react-icons/fa';
import Toast from './Toast.jsx'; // Import the Toast component

export default function Projects({ project, updateTasks, deleteProject, finishProject }) {
    const [taskInput, setTaskInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showFinishModal, setShowFinishModal] = useState(false); // State for finish confirmation modal
    const [warningMessage, setWarningMessage] = useState('');
    const [daysLeft, setDaysLeft] = useState(null);
    const [finished, setFinished] = useState('Finish Project');
    const [toastMessage, setToastMessage] = useState(''); // State for toast message
    const [showToast, setShowToast] = useState(false); // State for toast visibility
    const [showDateModal, setShowDateModal] = useState(false);
    const [newDate, setNewDate] = useState(project.date);
    const [projects, setProjects] = useState([]); // State to hold projects

    useEffect(() => {
        const savedProjects = JSON.parse(localStorage.getItem('projects'));
        if (savedProjects) {
            setProjects(savedProjects);
        }
    }, []);

    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('projects', JSON.stringify(projects));
        }
    }, [projects]);

    useEffect(() => {
        if (!project.date) return;

        const currentDate = new Date();
        const projectDeadline = new Date(project.date);
        const timeDiff = projectDeadline - currentDate;
        const calculatedDaysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days

        setDaysLeft(calculatedDaysLeft);

        // Set warning messages based on calculatedDaysLeft
        if (project.finished) {
            // Only show overdue message if project is finished and overdue
            setWarningMessage(calculatedDaysLeft < 0 ? "❌ Project deadline has passed! It's overdue!" : "");
        } else {
            if (calculatedDaysLeft === 7) {
                setWarningMessage("⚠️ One week left to finish this project!");
            } else if (calculatedDaysLeft === 2) {
                setWarningMessage("⏳ Only two days left to complete this project!");
            } else if (calculatedDaysLeft === 1) {
                setWarningMessage("⏳ Only one day left to complete this project!");
            } else if (calculatedDaysLeft <= 7 && calculatedDaysLeft >= 3) {
                setWarningMessage("⚠️ Less than one week left!");
            } else if (calculatedDaysLeft === 0) {
                setWarningMessage("⚠️ Last Day to complete this project!");
            } else if (calculatedDaysLeft < 0) {
                setWarningMessage("❌ Project deadline has passed! It's overdue!");
            } else {
                setWarningMessage(""); // No warning if more than a week left
            }
        }
    }, [project.date, project.finished]);
    const addTask = () => {
        if (taskInput.trim() !== "" && !project.finished) {
            const newTasks = [...project.tasks, { text: taskInput, completed: false }];
            updateTasks(project.id, newTasks);  // This line is causing the error
            setTaskInput("");
        }
    };
    const updateProjectDate = (projectId, newDate) => {
        if (newDate) {
            project.date = newDate; // Update the project date locally
            setNewDate(newDate); // Update state
        }
    };
    const handleFinishProject = () => {
        finishProject(project.id); // Call the function to finish the project
        setShowFinishModal(false); // Close the finish confirmation modal
        setFinished("Project Finished"); // Update the local finished state
    };

    // Toggle task completion
    const toggleTaskCompletion = (index) => {
        if (!project.finished) { // Check if the project is not finished
            const newTasks = project.tasks.map((task, i) =>
                i === index ? { ...task, completed: !task.completed } : task
            );
            updateTasks(project.id, newTasks);
        }
    };
    const removeTask = (index) => {
        if (!project.finished) { // Check if the project is not finished
            const newTasks = project.tasks.filter((_, i) => i !== index);
            updateTasks(project.id, newTasks);
        }
    };


    const getBannerBackgroundColor = () => {
        if (daysLeft < 0) return 'bg-red-700'; // Overdue
        if (daysLeft <= 2) return 'bg-red-600'; // 2 days or less
        if (daysLeft <= 7) return 'bg-orange-500'; // 1 week or less
    };

    return (
        <div className="w-full p-5 flex flex-col">
            {showDateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-stone-800">Edit Project Date</h2>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="p-2 border rounded w-full mt-3"
                        />
                        <div className="flex justify-between mt-4">
                            <button onClick={() => setShowDateModal(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    updateProjectDate(project.id, newDate); // Function to update project date
                                    setShowDateModal(false);
                                }}
                                className="bg-stone-600 text-white px-4 py-2 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Banner for Finished Projects */}
            {project.finished && (
                <div className="bg-green-600 text-white text-center p-4 rounded-lg shadow-md mb-5 flex items-center justify-center">
                    <p className="text-lg font-bold">✅ This project has been successfully finished!</p>
                </div>
            )}

            {/* Warning Banner */}
            {warningMessage && (
                <div className={`${getBannerBackgroundColor()} text-white text-center p-4 rounded-lg shadow-md mb-5 flex items-center justify-center`}>
                    <p className="text-lg font-bold">{warningMessage}</p>
                </div>
            )}

            {/* Project Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-stone-600">{project.name}</h2>
                    <p
                        className={`text-stone-400 flex items-center gap-2 ${project.finished ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        onClick={() => {
                            if (!project.finished) setShowDateModal(true);
                        }}
                    >
                        {project.date}
                        <FaRegCalendarAlt className="text-lg text-stone-500 hover:text-stone-300"/>
                    </p>

                    <p className="text-stone-600">{project.description}</p>
                </div>

                <div className={'flex justify-between w-40'}>
                    <button
                        className={`p-2 rounded-lg text-white 
        ${project.finished
                            ? "bg-green-500"
                            : daysLeft < 0
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-stone-600"
                        }`
                        }
                        onClick={() => {
                            if (!project.finished && daysLeft >= 0) {
                                setShowFinishModal(true);
                            }
                        }}
                        disabled={project.finished || daysLeft < 0} // Disable if finished OR overdue
                    >
                        {project.finished
                            ? "Project Finished"
                            : daysLeft < 0
                                ? "Project Overdue"
                                : "Finish Project"
                        }
                    </button>


                    <button onClick={() => setShowModal(true)} className="text-red-600 hover:text-red-800">
                        <FaTrashAlt className="text-xl"/>
                    </button>
                </div>
            </div>
            <div className="my-5 border-t-2 border-stone-400 w-full"></div>

            {/* Remaining Days */}
            {daysLeft !== null && daysLeft >= 0 && (
                <p className="text-sm text-stone-600 font-bold">
                    ⏳ {daysLeft} {daysLeft === 1 ? "day" : "days"} remaining
                </p>
            )}

            {/* Task Input */}
            <div className="mt-3 flex w-96">
                <input
                    type="text"
                    className="p-2 rounded text-stone-900 bg-stone-300 flex-grow"
                    placeholder="New Task..."
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                />
                <button className="ml-2 bg-stone-600 text-white p-2 rounded" onClick={addTask}>
                    Add Task
                </button>
            </div>

            {/* Task List */}
            <ul className="mt-5">
                {project.tasks.length > 0 ? (
                    project.tasks.map((task, index) => (
                        <li
                            key={index}
                            className={`flex justify-between items-center p-3 rounded-lg mb-2 cursor-pointer select-none transition-all
                            ${task.completed ? "bg-stone-300 text-stone-500 line-through" : "bg-stone-700 text-stone-300"}`}
                            onClick={() => toggleTaskCompletion(index)}
                        >
                            <span>{task.text}</span>
                            <button onClick={(e) => {
                                e.stopPropagation(); // Prevent toggling completion when clicking remove
                                removeTask(index);
                            }}>
                                <FaTrashAlt className="text-red-500 hover:text-red-700" />
                            </button>
                        </li>
                    ))
                ) : (
                    <p className="text-stone-500">No tasks yet</p>
                )}
            </ul>

            {/* Confirmation Modal for Deletion */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-stone-800">Confirm Deletion</h2>
                        <p className="text-stone-600 my-4">Are you sure you want to delete this project?</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteProject(project.id);
                                    setShowModal(false);
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Finishing Project */}
            {showFinishModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-stone-800">Confirm Finish Project</h2>
                        <p className="text-stone-600 my-4">Are you sure you want to finish this project? No further changes can be made.</p>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowFinishModal(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleFinishProject} // Call the finish project handler
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Finish Project
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showToast && (
                <Toast
                    message={toastMessage}
                    onClose={() => {
                        setShowToast(false);
                    }}
                    className={showToast ? 'animate-fade-in' : 'animate-fade-out'}
                />
            )}
        </div>
    );
}
