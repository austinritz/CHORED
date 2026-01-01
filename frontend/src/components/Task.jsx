import "../assets/components/Task.css";

const Task = ({ chore }) => {
  if (!chore) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="Task">
      <div className="Task-time">{chore.nextOccurrence && formatTime(chore.nextOccurrence)}</div>
      <div className="Task-name">{chore.name}</div>
      {chore.description && (
        <div className="Task-description">{chore.description}</div>
      )}
    </div>
  );
};

export default Task;

