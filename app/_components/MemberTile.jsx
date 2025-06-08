//app\_components\MemberTile.jsx
const MemberTile = ({ member }) => {
  return (
    <div className="p-4">
      <div className="relative group bg-white/30 backdrop-blur-xl rounded-2xl border border-blue-200 shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:border-purple-400 hover:shadow-purple-400">

        {/* Glowing border effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 blur opacity-30 group-hover:opacity-60 transition duration-300"></div>

        {/* Inner content */}
        <div className="relative z-10">
          {/* Image */}
          <div className="p-4">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-52 object-cover object-top rounded-xl transition duration-300 transform hover:scale-105"
            />
          </div>

          {/* Text Content */}
          <div className="px-6 pb-6 -mt-2 text-center">
            <h5 className="text-2xl font-bold text-blue-900 mb-1 drop-shadow-sm">
              {member.name}
            </h5>
            <p className="text-purple-700 font-medium text-sm tracking-wide">
              {member.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberTile;
