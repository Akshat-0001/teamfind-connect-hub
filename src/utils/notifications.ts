import { supabase } from '@/integrations/supabase/client';

export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  link?: string
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        link
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Notification helpers for different events
export const notifyTeamOwner = async (teamOwnerId: string, applicantName: string, teamTitle: string, teamId: string) => {
  await createNotification(
    teamOwnerId,
    'New Team Application',
    `${applicantName} has applied to join "${teamTitle}"`,
    `/teams/${teamId}`
  );
};

export const notifyApplicant = async (applicantId: string, status: string, teamTitle: string, teamId: string) => {
  const title = status === 'accepted' ? 'Application Accepted!' : 'Application Update';
  const message = status === 'accepted' 
    ? `Your application to join "${teamTitle}" has been accepted!`
    : `Your application to join "${teamTitle}" has been ${status}`;
  
  await createNotification(
    applicantId,
    title,
    message,
    status === 'accepted' ? `/teams/${teamId}` : undefined
  );
};

export const notifyTeamMembers = async (memberIds: string[], title: string, message: string, teamId?: string) => {
  const notifications = memberIds.map(memberId => 
    createNotification(
      memberId,
      title,
      message,
      teamId ? `/teams/${teamId}` : undefined
    )
  );
  
  await Promise.all(notifications);
};

export const notifyNewMember = async (newMemberId: string, teamTitle: string, teamId: string) => {
  await createNotification(
    newMemberId,
    'Welcome to the Team!',
    `You've successfully joined "${teamTitle}"`,
    `/teams/${teamId}`
  );
};

export const notifyTeamDeletion = async (memberIds: string[], teamTitle: string) => {
  const notifications = memberIds.map(memberId => 
    createNotification(
      memberId,
      'Team Deleted',
      `The team "${teamTitle}" has been deleted by the team owner`,
      undefined
    )
  );
  
  await Promise.all(notifications);
};