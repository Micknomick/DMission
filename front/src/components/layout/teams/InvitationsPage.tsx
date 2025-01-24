'use client';

import { useState, useEffect } from 'react';
import { fetchTeamInvitations, acceptTeamInvitation, rejectTeamInvitation} from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Invitation } from '@/lib/type';


const InvitationsPage = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const response = await fetchTeamInvitations();
      const data: Invitation[] = response.data;
      setInvitations(data); // 状態を更新
      } catch (error) {
        console.error('Failed to fetch invitations:', error);
      }
    };

    loadInvitations();
  }, []);

  const handleAccept = async (invitationId: number) => {
    setLoading(true);
    try {
      await acceptTeamInvitation(invitationId); // invitationIdをそのまま渡す
      alert('Invitation accepted!');
      setInvitations((prev) =>
        prev.filter((invitation) => invitation.id !== invitationId) // idでフィルタリング
      );
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      alert('Failed to accept invitation.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (invitationId: number) => {
    setLoading(true);
    try {
      await rejectTeamInvitation(Number(invitationId));
      alert('Invitation rejected!');
      setInvitations((prev) => prev.filter((invitation) => invitation.id !== invitationId));
    } catch (error) {
      console.error('Failed to reject invitation:', error);
      alert('Failed to reject invitation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Team Invitations</h1>
      {invitations.length > 0 ? (
        <ul className="space-y-4">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="p-4 bg-gray-800 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-bold">{invitation.team.name}</h2>
                <p>Status: {invitation.status}</p>
              </div>
              <div className="flex space-x-4">
                <Button
                  onClick={() => handleAccept(invitation.id)}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => handleReject(invitation.id)}
                  disabled={loading}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No invitations found.</p>
      )}
    </div>
  );
};

export default InvitationsPage;
