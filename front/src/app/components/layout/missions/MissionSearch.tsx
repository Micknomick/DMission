type MissionSearchProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const MissionSearch = ({ searchQuery, setSearchQuery }: MissionSearchProps) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Filter Missions ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-gray-700 text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default MissionSearch;
