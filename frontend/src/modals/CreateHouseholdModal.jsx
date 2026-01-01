import React, { useState } from 'react';
import { useHouseholdStore } from '../store/household';
import { useAuthStore } from '../store/auth';
import '../assets/modals/CreateHouseholdModal.css';

/* CreateHouseholdModal component
- Modal for creating a new household
- Includes form fields for name and description (both required)
- Submit and cancel buttons
- Closes on successful creation or cancel
*/
const CreateHouseholdModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const { createHousehold } = useHouseholdStore();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Include the current user in the users array
    const householdData = {
      ...formData,
      users: user?._id ? [user._id] : []
    };

    setIsSubmitting(true);
    const result = await createHousehold(householdData, user?._id);
    setIsSubmitting(false);

    if (result.success) {
      setFormData({ name: '', description: '' });
      onClose();
    } else {
      setError(result.message || 'Failed to create household');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setError('');
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  return (
    <div className="CreateHouseholdModal" onClick={handleOverlayClick}>
      <div className="CreateHouseholdModal-content">
        <h2 className="CreateHouseholdModal-title">Create New Household</h2>
        
        <form onSubmit={handleSubmit} className="CreateHouseholdModal-form">
          <div className="CreateHouseholdModal-field">
            <label htmlFor="name" className="CreateHouseholdModal-label">
              Household Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="CreateHouseholdModal-input"
              placeholder="Enter household name"
              disabled={isSubmitting}
            />
          </div>

          <div className="CreateHouseholdModal-field">
            <label htmlFor="description" className="CreateHouseholdModal-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="CreateHouseholdModal-textarea"
              placeholder="Enter household description"
              rows="4"
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="CreateHouseholdModal-error">
              {error}
            </div>
          )}

          <div className="CreateHouseholdModal-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="CreateHouseholdModal-button CreateHouseholdModal-button-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="CreateHouseholdModal-button CreateHouseholdModal-button-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Household'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHouseholdModal;

