import { useState } from "react";
import { useChoreStore } from "../store/chore.js"

const ProfilePage = () => {
  const [ formVisible, setformVisible ] = useState(false);
  const [ newChore, setNewChore ] = useState({
    name: "",
    description: "",
  });

  const {createChore}=useChoreStore();

  const chores = useChoreStore((state) => state.chores)
  console.log("Chores:", chores)
  function handleClick() {
    setformVisible(!formVisible);
  }

  const handleAddChore = async() => {
    console.log(newChore);
    const {success,message} = await createChore(newChore)
    console.log("Success:", success)
    console.log("Message:", message)
  }
  return (
    <main className="ml-48 p-2 justify-center items-center h-screen space-y-1">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src="../assets/logo/chored_logo.png"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-semibold">John Doe</h2>
          </div>
          <div className="text-center">
            <p className="text-gray-600">johndoe@example.com</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          My Chores  
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chores.map((chore, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200"
            >
              <h3 className="text-lg font-bold mb-2">{chore.name}</h3>
              <p className="text-gray-600">{chore.description}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center p-8">
          <button onClick={handleClick} className="text-black bg-gray-100 shadow appearance-none rounded p-2">
            Create a chore!
          </button>
        </div>
        <div className="flex justify-center">
        {formVisible &&
          <div className=" w-full max-w-xs">
            <form 
              className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (e.target.checkValidity()) {  // Check if form is valid
                  handleAddChore();
                }
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Chore Name
                </label>
                <input 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                  id="className"
                  type="text"
                  placeholder="Chore Name"
                  required
                  pattern=".{2,}"
                  value={newChore.name}
                  onChange={(e) => setNewChore({ ...newChore, name: e.target.value })}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                  id="classDescription"
                  type="text"
                  placeholder="Short description"
                  required
                  pattern=".{2,}"
                  value={newChore.description}
                  onChange={(e) => setNewChore({ ...newChore, description: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                  type="submit"
                >
                  Create Chore
                </button>
              </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
              &copy;2024 Austin. No rights reserved.
            </p>
          </div>
        }
        </div>
      </div>
    </main>
  );
}
  
  export default ProfilePage