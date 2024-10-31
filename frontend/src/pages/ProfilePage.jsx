const ProfilePage = () => {
  return (
    <div className="justify-center h-screen p-1 space-y-1">
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
        my chores
      </div>
    </div>
  );
}
  
  export default ProfilePage