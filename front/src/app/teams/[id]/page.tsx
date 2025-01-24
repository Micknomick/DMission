'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchTeamById } from '@/utils/api';
import { Team, Mission, User } from '@/lib/type';
import { Button } from '@/components/ui/button';
import Calendar from 'react-calendar'; // カレンダーをインポート
import '@/app/styles/calender.module.scss';
import { Pagination } from '@/components/layout/teams/Pagination';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TeamsPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMissions, setTotalMissions] = useState(0);
  const missionsPerPage = 3;

  useEffect(() => {
    const loadTeamDetails = async () => {
      if (!id) return;
      try {
        const response = await fetchTeamById(Number(id));
        const fetchedTeam = response.data;

        if (fetchedTeam) {
          setTeam(fetchedTeam);
          setMissions(fetchedTeam.missions?.slice(0, missionsPerPage) || []);
          setTotalMissions(fetchedTeam.missions?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch team details:', error);
      }
    };

    loadTeamDetails();
  }, [id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * missionsPerPage;
    const endIndex = startIndex + missionsPerPage;

    if (team?.missions) {
      setMissions(team.missions.slice(startIndex, endIndex));
    }
  };

  // ミッションの締切日をカレンダーにマーク
  const tileContent = ({ date }: { date: Date }) => {
    const deadlineMatch = missions.find((mission) =>
      mission.deadline ? new Date(mission.deadline).toDateString() === date.toDateString() : false
    );
    return deadlineMatch ? (
      <span className="bg-blue-500 text-white rounded-full px-2">
        {deadlineMatch.name}
      </span>
    ) : null;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold">DMission</h1>
      </header>
      <div className="container mx-auto py-8 px-4 grid grid-cols-3 gap-8">
        {/* Team Name and Stats */}
        <div className="col-span-3 md:col-span-1">
          <h2 className="text-xl font-bold">{team?.name || 'Team Name Unavailable'}</h2>
          <div className="flex justify-between mt-4">
            <div className="text-center">
              <span className="block text-4xl font-bold">{missions.length}</span>
              <span>Missions</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-bold">
                {missions.reduce((total, mission) => total + (mission.tasks?.length || 0), 0)}
              </span>
              <span>Tasks</span>
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="col-span-3 md:col-span-1">
          <h2 className="text-xl font-bold">Members</h2>
          <div className="flex items-center gap-2 mt-4">
            {team?.members?.slice(0, 5).map((user: User) => (
              <div
                key={user.id}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center"
              >
                <span className="text-sm">{user.name[0]}</span>
              </div>
            ))}
            {team?.members && team.members.length > 5 && (
              <span className="text-sm">+{team.members.length - 5}</span>
            )}

            {/* Dialog (Modal) */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-2 bg-white text-black rounded-full hover:bg-gray-300">＋</Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white rounded-lg shadow-lg p-6 max-w-md">
                <DialogHeader>
                  <DialogTitle>All Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  {team?.members?.map((user: User) => (
                    <div
                      key={user.id}
                      className="p-2 bg-gray-700 rounded flex items-center justify-between"
                    >
                      <span>{user.name}</span>
                      <span className="text-sm text-gray-400">{user.email}</span>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar */}
        <div className="col-span-3 md:col-span-1">
          <h2 className="text-xl font-bold">Calendar</h2>
          <div className="mt-4 bg-primary p-4 rounded">
            <Calendar
              tileContent={tileContent}
              className="react-calendar"
            />
          </div>
        </div>
      </div>

      {/* Missions */}
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold">Missions</h2>
        <div className="space-y-4 mt-4">
          {missions.length > 0 ? (
            missions.map((mission) => (
              <div key={mission.id} className="bg-gray-800 p-4 rounded">
                <h3 className="font-bold">{mission.name}</h3>
                <p className="text-sm">
                  Total tasks: {mission.tasks?.length || 0}, Completed tasks:{' '}
                  {mission.tasks?.filter((task) => task.progress_rate === 100).length || 0}
                </p>
                <div className="w-full bg-gray-700 h-2 rounded mt-2">
                  <div
                    className="bg-purple-500 h-2 rounded"
                    style={{
                      width: `${
                        Math.round(
                          ((mission.tasks?.filter((task) => task.progress_rate === 100).length || 0) /
                            (mission.tasks?.length || 1)) * 100
                        ) || 0
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button className="bg-blue-500 hover:bg-blue-600">Info</Button>
                </div>
              </div>
            ))
          ) : (
            <p>No missions found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalMissions / missionsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamsPage;
