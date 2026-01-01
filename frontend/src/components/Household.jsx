import { useNavigate } from 'react-router-dom';
import { useHouseholdStore } from '../store/household';
import "../assets/components/Household.css";

/* Household component
- Shows basic information about the household
- Includes the household name and icon
- When clicked, opens the HouseholdPage
*/
const Household = ({ household }) => {
  const navigate = useNavigate();
  const { setCurrentHousehold } = useHouseholdStore();

  if (!household) {
    return null;
  }

  const handleClick = () => {
    setCurrentHousehold(household);
    navigate('/household');
  };

  return (
    <div className="Household" onClick={handleClick}>
      <div className="Household-content">
        <h3 className="Household-name">{household.name || 'Unnamed Household'}</h3>
        {household.description && (
          <p className="Household-description">{household.description}</p>
        )}
      </div>
    </div>
  );
};

export default Household;