import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AddTask from '../component/Add_Task'
import { getTasks, deleteTask, updateTask } from '../Server_API'
import { useAuth } from '../context/AuthContext'

export default function TasksManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showAddTask, setShowAddTask] = React.useState(false)
  const [activeDropdown, setActiveDropdown] = React.useState(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [tasks, setTasks] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState("")
  const [editingTask, setEditingTask] = React.useState(null)
  const itemsPerPage = 5

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getTasks();
      if (response.tasks.length > 0) {
        setTasks(response.tasks);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.");
      if (err.message === "Unauthorized") {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Reset to first page when tasks change
  useEffect(() => {
    setCurrentPage(1);
  }, [tasks]);

  const handleAddTaskClick = () => {
    setShowAddTask(true);
    setEditingTask(null);
  }

  const handleActionClick = (taskId, event) => {
    event.stopPropagation()
    setActiveDropdown(activeDropdown === taskId ? null : taskId)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setShowAddTask(true)
    setActiveDropdown(null)
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError("");
        setLoading(true);
        const response = await deleteTask(taskId);
        if (response.message === 'Task deleted successfully') {
          await fetchTasks();
        } else {
          setError("Failed to delete task. Please try again.");
        }
      } catch (err) {
        setError("Failed to delete task. Please try again.");
      } finally {
        setLoading(false);
        setActiveDropdown(null);
      }
    }
  }

  const handleTaskUpdate = async (taskId, updatedData) => {
    try {
      setError("");
      setLoading(true);
      const response = await updateTask(taskId, updatedData);
      if (response.message === 'Task updated successfully') {
        await fetchTasks();
        setShowAddTask(false);
        setEditingTask(null);
      } else {
        setError("Failed to update task. Please try again.");
      }
    } catch (err) {
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleTaskAdded = async () => {
    try {
      await fetchTasks();
    } catch (err) {
      setError("Failed to refresh task list. Please try again.");
    }
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Pagination calculations
  const totalPages = Math.ceil(tasks.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = tasks.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-700">Tasks Management</h1>
          <div className="flex items-center gap-4">
            <button 
              className="bg-blue-700 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-800 transition-colors duration-200 shadow-md"
              onClick={handleAddTaskClick}
            >
              <span className="mr-1">+</span> Add Task
            </button>

          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="hidden sm:table bg-gray-200 w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-blue-600">No</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-blue-600">Date & Time</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-blue-600">Task</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-blue-600">Description</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-blue-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((task,index) => (
                    <tr key={task._id} className="bg-gray-50 transition-colors duration-200">
                      <td className="py-4 px-4 text-sm font-bold text-gray-700">{indexOfFirstItem + index + 1}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-700">{new Date(task.dueDate).toLocaleString()}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-700">{task.taskName}</td>
                      <td className="py-4 px-4 text-sm font-bold text-gray-700">{task.description}</td>
                      <td className="py-4 px-4 relative">
                        <div className="relative inline-block">
                          <button 
                            className="text-black font-bold hover:text-gray-700 w-6 h-6 flex items-center justify-center transition-colors duration-200"
                            onClick={(e) => handleActionClick(task._id, e)}
                          >
                            ⋮
                          </button>
                          {activeDropdown === task._id && (
                            <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white  ring-opacity-5 z-50">
                              <div className="py-1" role="menu">
                                <button
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors duration-200"
                                  onClick={() => handleEdit(task)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left transition-colors duration-200"
                                  onClick={() => handleDelete(task._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 px-4 text-center text-gray-500">
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* mobile view */}
            <div className="sm:hidden space-y-4 p-4">
              {currentItems.length > 0 ? (
                currentItems.map((task,index) => (
                  <div key={task._id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{task.taskName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{new Date(task.dueDate).toLocaleString()}</p>
                      </div>
                      <div className="relative">
                        <button 
                          className="text-gray-600 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          onClick={(e) => handleActionClick(task._id, e)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>
                        {activeDropdown === task._id && (
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white  ring-opacity-5 z-50">
                            <div className="py-1" role="menu">
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                onClick={() => handleEdit(task)}
                              >
                               
                                Edit
                              </button>
                              <button
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-200"
                                onClick={() => handleDelete(task._id)}
                              >
               
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No tasks found
                </div>
              )}
            </div>
          </div>
        </div>

        {tasks.length > itemsPerPage && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm">
              <button 
                className="p-2 rounded-md border hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    currentPage === index + 1 
                      ? 'bg-blue-700 text-white' 
                      : 'border hover:bg-gray-50'
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button 
                className="p-2 rounded-md border hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
    {showAddTask && (
      <AddTask 
        setShowAddTask={setShowAddTask} 
        onTaskAdded={handleTaskAdded}
        editingTask={editingTask}
        onTaskUpdated={handleTaskUpdate}
      />
    )}
    </>
  )
}
