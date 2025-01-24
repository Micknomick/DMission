import Link from "next/link";

type MissionTabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const MissionTabs = ({ activeTab, setActiveTab }: MissionTabsProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex bg-primary rounded p-1">
        {["Todo", "Progress", "Done"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md font-medium ${
              activeTab === tab
                ? "bg-second text-white" // アクティブなタブ
                : "bg-transparent text-neutral-300 hover:text-white" // 非アクティブなタブ
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Link href="/missions/new" className="flex items-center space-x-2 bg-second text-white px-4 py-2 rounded-full shadow hover:bg-blue-500">
        <span className="text-lg font-bold">+</span>
        <span className="font-medium">Add Mission</span>
      </Link>
    </div>
  );
};

export default MissionTabs;
