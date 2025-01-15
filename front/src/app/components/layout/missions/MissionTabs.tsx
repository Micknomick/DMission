type MissionTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const MissionTabs = ({ activeTab, setActiveTab }: MissionTabsProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex bg-gray-800 rounded p-1">
        {["Progress", "Done", "Deleted"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === tab
                ? "bg-black text-white" // アクティブなタブ
                : "bg-transparent text-gray-400 hover:text-white" // 非アクティブなタブ
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <button
        onClick={() => console.log("ミッション追加")}
        className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-full shadow hover:shadow-md"
      >
        <span className="text-lg font-bold">+</span>
        <span className="font-medium">Add Mission</span>
      </button>
    </div>
  );
};

export default MissionTabs;
