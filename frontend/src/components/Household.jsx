import "../assets/components/Household.css";

/* Household component
- Shows basic information about the household
- Includes the household name and icon
- When clicked, opens the HouseholdPage
*/
const Household = ({ household }) => {
  if (!household) {
    return null;
  }

  return (
    <div className="Household">
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