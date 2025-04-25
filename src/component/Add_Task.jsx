import { useState, useEffect } from "react";
import { addTask, updateTask } from "../Server_API";

export default function AddTask({ setShowAddTask, onTaskAdded, editingTask, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    dueDate: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        taskName: editingTask.taskName,
        description: editingTask.description,
        dueDate: new Date(editingTask.dueDate).toISOString().slice(0, 16)
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editingTask) {
        const response = await onTaskUpdated(editingTask._id, formData);
        if (response.message === 'Task updated successfully') {
          setShowAddTask(false);
        }
      } else {
        const response = await addTask(formData);
        if (response.message === 'Task created successfully') {
          setShowAddTask(false);
          await onTaskAdded();
        } else {
          setError(response.message || "Failed to add task");
        }
      }
    } catch (err) {
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowAddTask(false);
    setFormData({
      taskName: "",
      description: "",
      dueDate: ""
    });
    setError("");
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all">
        <div className="p-6">
          <div className="flex justify-center items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input 
                type="text" 
                id="taskName"
                name="taskName"
                value={formData.taskName}
                onChange={handleChange}
                placeholder="Enter Task Name" 
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                required
                disabled={loading}
              />
            </div>

            <div>

              <input 
                type="text" 
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description" 
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                required
                disabled={loading}
              />
            </div>

            <div>
              <input 
                type="datetime-local" 
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-3 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" 
                required
                disabled={loading}
              />
            </div>

            <div className="flex flex-col items-center space-y-3 pt-4">
              <button 
                type="submit"
                className="w-40 bg-blue-700 text-white py-3 px-8 rounded-full cursor-pointer hover:bg-blue-800 disabled:opacity-50 transition-all duration-200 shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editingTask ? "Updating..." : "Saving..."}
                  </span>
                ) : (
                  editingTask ? "Update" : "Save"
                )}
              </button>

              <button 
                type="button"
                onClick={handleClose}
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
