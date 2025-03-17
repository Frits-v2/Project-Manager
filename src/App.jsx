import React, { useState } from 'react';
import Sidebar from '/src/components/Sidebar.jsx';
import Projects from '/src/components/Projects.jsx';

function App() {
    const [state, setState] = useState({
        projects: [],
        showForm: false,
        selectedProject: null,
        newProject: { name: '', description: '', date: '' }
    });

    const toggleForm = () => {
        setState(prevState => ({
            ...prevState,
            showForm: !prevState.showForm,
            selectedProject: null
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            newProject: { ...prevState.newProject, [name]: value }
        }));
    };

    const submitProject = (e) => {
        e.preventDefault();
        const newProject = {
            id: state.projects.length + 1,
            name: state.newProject.name,
            description: state.newProject.description,
            date: state.newProject.date,
            tasks: [] // Store tasks here
        };

        setState(prevState => ({
            ...prevState,
            projects: [...prevState.projects, newProject],
            showForm: false,
            newProject: { name: '', description: '', date: '' }
        }));
    };

    const selectProject = (project) => {
        setState(prevState => ({
            ...prevState,
            selectedProject: project,
            showForm: false
        }));
    };

    // Rename updateProjectTasks to updateProject
    const updateProject = (projectId, updatedProjectData) => {
        setState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === projectId ? { ...project, ...updatedProjectData } : project
            ),
            // Optionally, update the selectedProject if it's the one being updated
            selectedProject: prevState.selectedProject?.id === projectId
                ? { ...prevState.selectedProject, ...updatedProjectData }
                : prevState.selectedProject
        }));
    };
    const updateTasks = (projectId, newTasks) => {
        setState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === projectId ? { ...project, tasks: newTasks } : project
            ),
            // Optionally, update the selectedProject if it's the one being updated
            selectedProject: prevState.selectedProject?.id === projectId
                ? { ...prevState.selectedProject, tasks: newTasks }
                : prevState.selectedProject
        }));
    };


    const deleteProject = (projectId) => {
        const updatedProjects = state.projects.filter(project => project.id !== projectId);

        setState(prevState => ({
            ...prevState,
            projects: updatedProjects,
            selectedProject: prevState.selectedProject?.id === projectId ? null : prevState.selectedProject
        }));
    };
    const finishProject = (projectId) => {
        setState(prevState => ({
            ...prevState,
            projects: prevState.projects.map(project =>
                project.id === projectId ? { ...project, finished: true } : project
            ),
            // Optionally update the selectedProject if it's the one being updated
            selectedProject: prevState.selectedProject?.id === projectId
                ? { ...prevState.selectedProject, finished: true }
                : prevState.selectedProject
        }));
    };


    return (
        <div className="flex">
            <Sidebar projects={state.projects} onAddProject={toggleForm} onSelectProject={selectProject} />

            <div className="flex-1 mt-20 ml-80 p-5">
                {state.selectedProject ? (
                    <Projects
                        project={state.selectedProject}
                        updateProject={updateProject}
                        updateTasks={updateTasks}  // 🔥 Make sure this function is passed
                        deleteProject={deleteProject}
                        finishProject={finishProject} // Pass the function
                    />

                ) : (
                    <>
                        {state.showForm ? (
                            <form onSubmit={submitProject} className="w-full flex flex-col justify-center items-center p-5">
                                <img alt="logo" className="w-20 h-20 mb-4" src="/public/logo.png" />
                                <p className="text-3xl font-bold text-stone-600 my-2">Create a New Project</p>

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Project Name"
                                    value={state.newProject.name}
                                    onChange={handleInputChange}
                                    className="p-2 rounded border-2 border-stone-600 focus:border-stone-400 text-stone-700 mb-3 w-3/4"
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Project Description"
                                    value={state.newProject.description}
                                    onChange={handleInputChange}
                                    className="p-2 rounded border-2 border-stone-600 text-stone-700 mb-3 w-3/4"
                                    required
                                />
                                <input
                                    type="date"
                                    name="date"
                                    value={state.newProject.date}
                                    onChange={handleInputChange}
                                    className="p-2 rounded border-2 focus:border-stone-600 border-stone-600 text-stone-700 mb-3 w-3/4"
                                    required
                                    placeholder="YYYY-MM-DD" // Add a placeholder to guide the user
                                />
                                <div className="flex justify-between w-3/4 mt-5">
                                    <button type="submit" className="bg-stone-800 text-white p-3 rounded w-full mr-2">
                                        Add Project
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-stone-400 text-white p-3 rounded w-full ml-2"
                                        onClick={toggleForm}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col justify-center items-center">
                                <img alt="logo" className="w-20 h-20 mb-4" src="/public/logo.png" />
                                <p className="text-3xl font-bold text-stone-600 my-2">No Projects Selected</p>
                                <p className="text-stone-400 text-xl">Select a project or start a new one</p>
                                <button
                                    className="text-stone-400 bg-stone-700 text-xl mt-10 p-5 rounded-xl"
                                    onClick={toggleForm}
                                >
                                    Create New Project
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
